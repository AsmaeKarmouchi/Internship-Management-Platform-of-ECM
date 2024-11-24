const db = require("../models");
const chain = require("./chain");
const path = require("path");
const { Op } = require('sequelize');
const fs = require('fs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require("dotenv").config();

const transportOptions = {
  service: 'gmail',
  auth: {
    user: process.env.EMAILFROM,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const client = nodemailer.createTransport(smtpTransport(transportOptions));


exports.addNewInternship = async (req, res, next) => {
  const { id } = req.decoded;
  const { application, files } = req.body;

  try {
    const student = await db.Student.findByPk(id);
    
    const internship = await db.Internship.create({
      studentId: student.id,
      firstname: student.firstname,
      lastname: student.lastname,
      year: student.year,
      div: student.div,
      prevSemAttendance: student.prevSemAttendance,
      rollNo: student.rollNo,
      emailId: student.emailId,
      submittedDate: new Date(),
      internshipType: application.internshipType,
      startDate: new Date(application.startDate),
      workplace: application.workplace,
      durationOfInternship: application.durationOfInternship,
      reference: application.reference,
      stipend: application.stipend, // Ensure it's parsed as a float
      NOCRequired: application.NOCRequired ? 'Yes' : 'No',
      files: [files]
      
    });
    
    const faculty = await db.Faculty.findOne({
      where: {
        year: student.year,
        div: student.div,
      },
    });

    if (!faculty) {
      throw new Error('Faculty not found');
    }

    await faculty.addApplicationsReceived(internship.id);
    await student.addInternship(internship.id);

    const email = {
      from: process.env.EMAILFROM,
      to: student.emailId,
      subject: "New Internship Application Created",
      html: `<p>Dear student,</p>
      <p>New Internship Application for <b>${application.durationOfInternship} months</b> at <b>${application.workplace}</b> has been created on <b>${new Date().toDateString()}</b>. Your application is currently held by: Prof. <b>${faculty.firstname} ${faculty.lastname}</b>. <a href='https://localhost:3000'>Click here to login and check.</a> Regards IMS Portal Pune Institute of Computer Technology</p>`,
    };

    const emailFac = {
      from: process.env.EMAILFROM,
      to: faculty.emailId,
      subject: "New Internship Application for Approval",
      html: `<p>Respected Coordinator,</p>
      <p>New Internship application for <b>${application.durationOfInternship} months</b> at <b>${application.workplace}</b> has been created on <b>${new Date().toDateString()}</b>. Application received from <b>${student.firstname} ${student.lastname}</b> studying in <b>${student.currentClass.year} ${student.currentClass.div}</b>. <a href='https://localhost:3000'>Click here to login and check.</a> Regards IMS Portal Pune Institute of Computer Technology</p>`,
    };

    client.sendMail(email, (err, info) => {
      if (err) {
        console.error(err);
      }
    });

    client.sendMail(emailFac, (err, info) => {
      if (err) {
        console.error(err);
      }
    });

    return res.status(201).json({ ...internship.toJSON(), studentId: student.id });
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

exports.showInternships = async (req, res, next) => {
  try {
    const { id } = req.decoded;

    // Trouver le corps professoral
    const faculty = await db.Faculty.findByPk(id, {
      include: { model: db.Internship, as: 'applicationsReceived' }
    });

    if (!faculty) {
      throw new Error('Faculty not found');
    }

    const internships = faculty.applicationsReceived;

    res.status(200).json(internships);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.showAllInternships = async (req, res, next) => {
  try {
    const internships = await db.Internship.findAll();
    res.status(200).json(internships);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.showApprovedInternships = async (req, res, next) => {
  try {
    // Fetch only internships with a completionStatus of 'Approved'
    const internships = await db.Internship.findAll({
      where: {
        completionStatus: 'Approved' // Filter for approved internships
      }
    });

    res.status(200).json(internships);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};


exports.showReport = async (req, res, next) => {
  try {
    const { id } = req.decoded;

    // Recherche de l'enseignant par ID
    const faculty = await db.Faculty.findByPk(id, {
      include: [
        { model: db.Internship, as: 'applicationsApproved' },
        { model: db.Internship, as: 'applicationsReceived' },
      ],
    });

    if (!faculty) {
      throw new Error('Faculty not found');
    }

    // Collecte des internships approuvés et reçus
    const approvedInternships = faculty.applicationsApproved || [];
    const receivedInternships = faculty.applicationsReceived || [];

    // Concaténation des deux listes d'internships
    const applications = [...approvedInternships, ...receivedInternships];

    res.status(200).json(applications);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};


exports.studentsInternships = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    // Recherche de l'étudiant par ID
    db.Student.hasMany(db.Internship, { foreignKey: 'studentId', as: 'internships' });
db.Internship.belongsTo(db.Student, { foreignKey: 'studentId', as: 'student' });

const student = await db.Student.findByPk(id, {
  include: [{ model: db.Internship, as: 'internships' }],
});
    
    if (!student) {
      throw new Error('Student not found');
    }

    // Récupération des internships associés à l'étudiant
    const internships = student.internships || [];

    // Ajout de messages de débogage pour afficher les données
    console.log('Étudiant trouvé :', student.toJSON());
    console.log('Stages de l\'étudiant :', internships.map(internship => internship.toJSON()));

    res.status(200).json(internships);
  } catch (err) {
    // Ajout d'un message de débogage pour l'erreur
    console.error('Erreur lors de la récupération des stages de l\'étudiant :', err.message);

    return next({
      status: 400,
      message: err.message,
    });
  }
};


exports.getInternship = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Recherche de l'internship par ID
    const internship = await db.Internship.findByPk(id);

    if (!internship) {
      throw new Error("No internship found");
    }

    res.status(200).json(internship);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

exports.deleteInternship = async (req, res, next) => {
  const { internshipId } = req.params;
  const { id: studentId } = req.decoded;

  try {
    // Recherche de l'étudiant par ID
    let student = await db.Student.findByPk(studentId);

    // Si l'étudiant a des internships
    if (student && student.internships) {
      // Filtrer les internships pour supprimer celui correspondant à l'ID fourni dans la requête
      student.internships = student.internships.filter((studentInternship) => {
        return studentInternship.id.toString() !== internshipId.toString();
      });
    }

    // Recherche de l'internship à supprimer
    const internship = await db.Internship.findByPk(internshipId);

    if (!internship) {
      throw new Error("No internship found");
    }

    // Vérification que l'internship appartient à l'étudiant
    if (internship.studentId.toString() !== studentId) {
      throw new Error("Unauthorized access");
    }

    // Sauvegarde des modifications et suppression de l'internship
    await student.save();
    await internship.destroy();

    return res.status(200).json({ internship, deleted: true });
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};


exports.updateInternship = async (req, res, next) => {
  try {
    const { id } = req.body;
    const details = req.body;

    let internship = await db.Internship.findByPk(id);

    // Si l'internship n'est pas trouvé
    if (!internship) {
      throw new Error("Internship not found");
    }

    // Mise à jour des détails de l'internship
    for (const key of Object.keys(details)) {
      internship[key] = details[key];
    }

    // Ajout d'un commentaire
    internship.comments = "\nApplication status changed! Please check.";

    // Sauvegarde des modifications
    await internship.save();

    res.status(200).json(internship);
  } catch (err) {
    err.message = "Could not update";
    next(err);
  }
};


exports.approveInternship = async (req, res, next) => {
  const { internshipId: internshipId, remark } = req.body;
  const { id: facultyId } = req.decoded;

  try {
    let internship = await db.Internship.findByPk(internshipId);
    let emailId = internship.studentEmailId;

    // Modification du statut de complétion pour "Approved"
    internship.completionStatus = "Approved";

    let faculty = await db.Faculty.findByPk(facultyId);

    // Ajout de l'internship approuvé à la liste des applications approuvées pour la faculté
    faculty.applicationsApproved.push(internshipId);

    // Suppression de l'internship approuvé de la liste des applications reçues de la faculté
    const index = faculty.applicationsReceived.indexOf(internshipId);
    if (index !== -1) {
      faculty.applicationsReceived.splice(index, 1);
    }

    // Ajout de l'approbation par le membre de la faculté
    internship.approvedByDesignation = faculty.designation;
    internship.approvedByRemark = remark;

    // Mise à jour de l'internship et de la faculté
    await faculty.save();
    internship.comments = `Congratulations! Your application ${internshipId} has been approved.`;
    await internship.save();

    // Envoi de l'email à l'étudiant
    var email = {
      from: process.env.EMAILFROM,
      to: emailId,
      subject: "Internship Application Approved!",
      html:
        "Dear Student,<br /> " +
        `Your internship application for <b>${internship.workplace}</b> has been <b>approved</b>.<br /> <br /> <strong><a href=''>Click Here</a></strong> to login and check.<br /> <br />` +
        "This is an automatically generated mail. Please do not respond to this mail.<br/><br/>" +
        "Regards<br/>IMS Portal<br/>Pune Institute of Computer Technology",
    };

    // Envoi de l'email
    client.sendMail(email, (err, info) => {
      if (err) {
        // Gestion des erreurs lors de l'envoi de l'email
      } else if (info) {
        // Succès de l'envoi de l'email
      }
    });

    res.status(200).json(internship);
  } catch (err) {
    err.message = "Could not approve";
    next(err);
  }
};


exports.forwardInternship = async (req, res, next) => {
  const { internshipId: _id, remark } = req.body;
  const { id: facultyId } = req.decoded;

  try {
    let internship = await db.Internship.findByPk(_id);
    let faculty = await db.Faculty.findByPk(facultyId);

    // Ajout de l'ID d'internship aux applications approuvées de la faculté
    faculty.applicationsApproved.push(_id);

    // Suppression de l'ID d'internship des applications reçues de la faculté
    const index = faculty.applicationsReceived.indexOf(_id);
    if (index !== -1) {
      faculty.applicationsReceived.splice(index, 1);
    }

    // Ajout de l'approbation par le membre de la faculté
    internship.approvedBy.push({
      designation: faculty.designation,
      remark: remark,
    });

    // Récupération du prochain membre de la faculté pour la révision
    let forwardToFaculty = await db.Faculty.findOne({
      where: chain.getNextPerson(faculty.designation, faculty.department),
    });

    if (!forwardToFaculty) {
      throw new Error("Next point of contact unavailable.");
    }

    // Mise à jour du détenteur de l'internship
    internship.holderDesignation = forwardToFaculty.designation;

    // Mise à jour des commentaires de l'internship
    internship.comments = `\nApplication id: ${_id} has been approved by ${
      faculty.designation
    }. It is now reviewed by: ${
      forwardToFaculty.designation
    }.`;

    // Ajout de l'internship aux applications reçues du prochain membre de la faculté
    forwardToFaculty.applicationsReceived.push(_id);

    // Sauvegarde des changements dans la base de données
    await faculty.save();
    await forwardToFaculty.save();
    await internship.save();

    // Envoi des emails à l'étudiant et à la faculté
    const emailId = internship.studentEmailId;

    // Email à l'étudiant
    var email = {
      from: process.env.EMAILFROM,
      to: emailId,
      subject: "Internship Application Status Changed!",
      html: `Dear Student,<br /> Your internship application for <b>${internship.workplace}</b> has been approved by <b>${faculty.designation}</b>. It is currently being reviewed by: <b>${forwardToFaculty.designation} (${forwardToFaculty.name.firstname} ${forwardToFaculty.name.lastname})</b><br /> <br /><strong><a href=''>Click Here</a></strong> to login and check.<br /> <br />This is an automatically generated mail. Please do not respond to this mail.<br/><br/>Regards<br/>IMS Portal<br/>Pune Institute of Computer Technology`,
    };

    // Email à la faculté
    var emailFac = {
      from: process.env.EMAILFROM,
      to: emailId,
      subject: "New Internship Application for Approval!",
      html: `Respected Coordinator,<br/>You have a new internship application for approval. Application is approved and forwarded by <b>${faculty.name.firstname} ${faculty.name.lastname}</b><br /> <br /><strong><a href=''>Click Here</a></strong> to login and check.<br /> <br />This is an automatically generated mail. Please do not respond to this mail.<br/><br/>Regards<br/>IMS Portal<br/>Pune Institute of Computer Technology`,
    };

    // Envoi des emails
    client.sendMail(email, (err, info) => {
      if (err) {
        // Gestion des erreurs lors de l'envoi de l'email à l'étudiant
      }
    });

    client.sendMail(emailFac, (err, info) => {
      if (err) {
        // Gestion des erreurs lors de l'envoi de l'email à la faculté
      }
    });

    res.status(200).json(internship);
  } catch (err) {
    err.message = "Could not forward";
    next(err);
  }
};


exports.rejectInternship = async (req, res, next) => {
  try {
    const { internshipId: _id, comments } = req.body;
    const { id: facultyId } = req.decoded;

    const internship = await db.Internship.findByPk(_id);
    const faculty = await db.Faculty.findByPk(facultyId);

    // Retrait de l'internship des applications reçues de la faculté
    const indexReceived = faculty.applicationsReceived.indexOf(_id);
    if (indexReceived !== -1) {
      faculty.applicationsReceived.splice(indexReceived, 1);
    }

    // Ajout de l'internship aux applications approuvées de la faculté
    faculty.applicationsApproved.push(_id);

    // Mise à jour des commentaires et du statut de complétion de l'internship
    internship.comments = `Your application ${_id} has been rejected by ${faculty.designation}. Reason: ${comments}`;
    internship.completionStatus = "Rejected";

    // Enregistrement des changements dans la base de données
    await internship.save();
    await faculty.save();

    // Envoi de l'email à l'étudiant
    var email = {
      from: process.env.EMAILFROM,
      to: internship.studentEmailId,
      subject: "Internship Application Rejected!",
      html: `Dear Student,<br /> Your internship application for <b>${internship.workplace}</b> has been rejected by the <b>${faculty.designation} (${faculty.name.firstname} ${faculty.name.lastname})</b><br />Reason: ${comments}<br /> <br /><strong><a href=''>Click Here</a></strong> to login and check.<br /> <br />This is an automatically generated mail. Please do not respond to this mail.<br/><br/>Regards<br/>IMS Portal<br/>Pune Institute of Computer Technology`,
    };

    // Envoi de l'email
    client.sendMail(email, (err, info) => {
      if (err) {
        // Gestion des erreurs lors de l'envoi de l'email
      }
    });

    res.status(200).json(internship);
  } catch (err) {
    err.message = "Could not reject";
    next(err);
  }
};


exports.getStats = async (req, res, next) => {
  try {
    // Top 5 workplaces - info
    const top5workplaces = await db.Internship.findAll({
      attributes: ['application.workplace', [db.sequelize.fn('COUNT', 'id'), 'count']],
      group: ['application.workplace'],
      order: [[db.sequelize.literal('count DESC')]],
      limit: 5,
    });

    // Datewise status - bar
    const datewiseStatusDistribution = await db.Internship.findAll({
      attributes: [
        [db.sequelize.fn('date_format', db.sequelize.col('application.submittedDate'), '%Y-%m'), 'date'],
        'completionStatus',
        [db.sequelize.fn('COUNT', 'id'), 'count'],
      ],
      group: [db.sequelize.literal('date, status')],
      limit: 48,
    });

    // Yearwise - polar
    const yearwiseDistribution = await db.Internship.findAll({
      attributes: ['student.currentClass.year', [db.sequelize.fn('COUNT', 'id'), 'count']],
      group: ['student.currentClass.year'],
    });

    // Class wise in each year - doughnut
    const classwiseDistribution = await db.Internship.findAll({
      attributes: [
        'student.currentClass.year',
        'student.currentClass.div',
        [db.sequelize.fn('COUNT', 'id'), 'count'],
      ],
      group: ['student.currentClass.year', 'student.currentClass.div'],
    });

    // Monthwise - line
    const totalMonthwise = await db.Internship.findAll({
      attributes: [
        [db.sequelize.fn('date_format', db.sequelize.col('application.startDate'), '%Y-%m'), 'date'],
        [db.sequelize.fn('COUNT', 'id'), 'count'],
      ],
      group: [db.sequelize.literal('date')],
      limit: 48,
    });

    let data = {
      top5workplaces,
      datewiseStatusDistribution,
      yearwiseDistribution,
      classwiseDistribution,
      totalMonthwise,
    };

    res.status(200).json(data);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

exports.getFile = async (req, res, next) => {
  const { file } = req.body;
  console.log(file);
  let p = path.join(__dirname, "../public/Documents/" + file);
  res.sendFile(p, (err) => {
    if (err) console.log(err.message);
  });
};



exports.getaictereport = async (req, res, next) => {
  try {
    const today = new Date();
    const previousYear = await db.Internship.findAll({
      where: {
        'application.submittedDate': {
          [Op.between]: [
            new Date(today.getFullYear() - 1, 6, 1),
            new Date(today.getFullYear(), 6, 30),
          ],
        },
      },
      attributes: [
        ['student.currentClass.year', 'department'],
        [sequelize.fn('COUNT', sequelize.col('*')), 'total'],
      ],
      group: ['student.currentClass.year'],
    });

    const lastTYear = await db.Internship.findAll({
      where: {
        'application.submittedDate': {
          [Op.between]: [
            new Date(today.getFullYear() - 2, 6, 1),
            new Date(today.getFullYear() - 1, 6, 30),
          ],
        },
      },
      attributes: [
        ['student.currentClass.year', 'department'],
        [sequelize.fn('COUNT', sequelize.col('*')), 'total'],
      ],
      group: ['student.currentClass.year'],
    });

    let data = {};
    data["previousYear"] = previousYear;
    data["lastTYear"] = lastTYear;

    if (!data) {
      throw new Error("Empty");
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};
