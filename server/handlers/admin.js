const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILFROM,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


exports.register_faculty = async (req, res, next) => {
  try {
    const faculty = await db.Faculty.create(req.body);
    const { id, username } = faculty;
    const token = jwt.sign({ id, username }, process.env.SECRET);
    res.status(201).json({ id, username, token });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      err.message = "Sorry, username is already taken.";
    }
    next(err);
  }
};

exports.login_faculty = async (req, res, next) => {
  try {
    const faculty = await db.Faculty.findOne({ where: { username: req.body.username } });
    if (!faculty) {
      throw new Error('Invalid username/password');
    }
    const { id, username } = faculty;
    const valid = await bcrypt.compare(req.body.password, faculty.password);
    if (valid) {
      const token = jwt.sign({ id, username }, process.env.SECRET);
      res.json({ id, username, token });
    } else {
      throw new Error('Invalid username/password');
    }
  } catch (err) {
    next(err);
  }
};

exports.login_admin = async (req, res, next) => {
  try {
    const faculty = await db.Faculty.findOne({ where: { username: req.body.username } });
    if (!faculty) {
      throw new Error('Invalid username/password');
    }
    const { id, username, designation } = faculty;

    // Assurez-vous que seule la désignation 'Admin' peut se connecter ici
    if (designation !== "Admin") {
      throw new Error('Access is restricted to admin only');
    }

    // Ici, comparePassword devrait être une méthode d'instance sur le modèle Sequelize de Faculty.
    const valid = await faculty.comparePassword(req.body.password);
    if (valid) {
      const token = jwt.sign({ id, username }, process.env.SECRET);
      res.json({ id, username, token });
    } else {
      throw new Error('Invalid username/password');
    }
  } catch (err) {
    err.message = "Invalid username/password";
    next(err);
  }
};

exports.addFaculty = async (req, res, next) => {
  try {
    // Hachage du mot de passe avant de l'enregistrer
    const hashedPassword = req.body.password;
    const { firstname, lastname } = req.body.name;
    const { year, div } = req.body.currentClass;
    const newFacultyData = {
      ...req.body,
      firstname: firstname,
      lastname: lastname,
      year: year,
      div: div,
      password: hashedPassword

    };  
    
    const faculty = await db.Faculty.create(newFacultyData);
    // Préparation du message email
    let link =
      `<h4>You have been added to IMS as a faculty member.</h4><br/>` +
      `Your default username is: <b>${faculty.username}</b><br/>` +
      `Your default password is: <b>${req.body.password}</b><br/>` + // Le mot de passe clair ne devrait jamais être envoyé par email en production !
      `<a href='http://localhost:3000/login'>Click here to login.</a>`;

    let emailOptions = {
      from: process.env.EMAILFROM,
      to: faculty.emailId,
      subject: "Registered to IMS.",
      html: link,
      // Ajout de l'événement iCal si nécessaire, sinon cela peut être omis
      icalEvent: {
        filename: "invitation.ics",
        method: "request",
        content: "BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\n..."
      }
    };

    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.error("Could not send email", error);
        return res.status(500).json({ message: 'Could not send email' });
      } else {
        let message = "Email sent successfully";
        return res.status(200).json({ faculty, message });
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      error.message = "Sorry, that username is already taken.";
    }
    next(error);
  }
};


exports.findFaculty = async (req, res, next) => {
  try {
    const { user } = req.params;
    // Utiliser `where` pour spécifier la condition de recherche
    const faculty = await db.Faculty.findOne({ where: { username: user } });
    if (!faculty) {
      // Si aucun membre du corps professoral n'est trouvé, renvoyer une erreur 404
      return res.status(404).json({ message: "Faculty not found" });
    }
    return res.status(200).json(faculty);
  } catch (error) {
    // Passer l'erreur au middleware d'erreur pour un traitement centralisé
    next(error);
  }
};


exports.findAll = async (req, res, next) => {
  try {
    // Utilisez `findAll` pour récupérer tous les enregistrements
    const faculties = await db.Faculty.findAll({
      // Ici, vous pouvez ajouter des options de jointure si vous avez des associations
      // par exemple: include: [{ model: OtherModel, as: 'OtherModelAlias' }]
    });
    res.status(200).json(faculties);
  } catch (err) {
    // Sequelize ne définit pas `err.status`, donc vous devez définir le code d'état de réponse directement
    res.status(400).json({ message: err.message });
  }
};


exports.deleteFaculty = async (req, res, next) => {
  try {
    const { user } = req.params;
    // Utilisez `destroy` avec la clause `where` pour supprimer l'entrée
    const result = await db.Faculty.destroy({
      where: { username: user }
    });

    // `destroy` renvoie le nombre de lignes affectées, donc si c'est 0, l'utilisateur n'a pas été trouvé
    if (result === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    return res.status(200).json({ message: "Faculty deleted" });
  } catch (error) {
    // Passer l'erreur au middleware d'erreur pour un traitement centralisé
    next(error);
  }
};


exports.showProfile = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    // Sequelize utilise findByPk pour rechercher par l'identifiant primaire
    const profile = await db.Faculty.findByPk(id);

    // Vérifier la désignation après avoir récupéré le profil
    if (profile && profile.designation === "Admin") {
      return res.status(200).json(profile);
    } else {
      // Si le profil n'existe pas ou que la désignation n'est pas "Admin"
      return res.status(404).json({ message: "Not an admin or profile does not exist." });
    }
  } catch (error) {
    // L'erreur est directement passée au middleware d'erreur
    next(error);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Trouvez le profil par son ID
    const profile = await db.Faculty.findByPk(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Mise à jour des données du profil
    const updatedData = {
      name: {
        firstname: req.body.firstname || profile.name.firstname,
        lastname: req.body.lastname || profile.name.lastname,
      },
      emailId: req.body.emailId || profile.emailId,
      department: req.body.department || profile.department,
      designation: req.body.designation || profile.designation,
    };

    // Appliquez la mise à jour
    const updatedProfile = await profile.update(updatedData);

    return res.status(200).json(updatedProfile);
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};


exports.resetPassword = async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  const { id } = req.params;

  try {
    // Trouver l'utilisateur par son ID
    const faculty = await db.Faculty.findByPk(id);

    if (!faculty) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Comparer l'ancien mot de passe
    const valid = await bcrypt.compare(oldpassword, faculty.password);

    if (valid) {
      // Hasher le nouveau mot de passe
      const newHashedPassword = await bcrypt.hash(newpassword, 10);

      // Mettre à jour le mot de passe
      await faculty.update({ password: newHashedPassword });

      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      return res.status(400).json({ message: "Old password is wrong!" });
    }
  } catch (err) {
    next(err);
  }
};


exports.findAllStudents = async (req, res, next) => {
  try {
    // Utiliser findAll pour récupérer tous les étudiants
    const students = await db.Student.findAll({
      // Ajoutez ici des options d'inclusion si vous avez des relations à joindre
      // Par exemple: include: [{ model: OtherModel, as: 'OtherModelAlias' }]
    });
    res.status(200).json(students);
  } catch (err) {
    // Définissez correctement le code d'état et passez l'erreur au middleware suivant
    res.status(400).json({ message: err.message });
  }
};


exports.SomeStudents = async (req, res, next) => {
  try {
    const YEAR = req.query.YEAR;
    const DIV = req.query.DIV;

    // Utiliser findAll avec la condition where pour filtrer les étudiants
    const students = await db.Student.findAll({
      where: {
        'currentClass.year': YEAR,
        'currentClass.div': DIV,
      }
    });

    res.status(200).json(students);
  } catch (err) {
    // Définir le code d'erreur correctement avant de passer au middleware suivant
    res.status(400).json({ message: err.message });
  }
};


exports.deletestudent = async (req, res, next) => {
  try {
    const arr = req.body;

    // Utiliser destroy pour supprimer des enregistrements qui correspondent à la condition
    const result = await db.Student.destroy({
      where: {
        id: arr, // Assurez-vous que 'arr' est un tableau d'identifiants
      }
    });

    // Vérifier si des enregistrements ont été supprimés
    if (result === 0) {
      return res.status(404).json({ message: "No students found to delete" });
    } else {
      return res.status(200).json({ message: "Students deleted successfully" });
    }
  } catch (error) {
    // Gérer les erreurs
    res.status(400).json({ message: error.message });
  }
};

