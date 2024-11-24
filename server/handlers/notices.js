const db = require("../models");

// Ajouter un nouvel avis
exports.addNewNotice = async (req, res, next) => {
  // Destructuring the request body to extract all the notice properties
  const {
    subject,
    description,
    link,
    designation,
    duration,
    stipend,
    workplace,
    contact,
    location,
    positions,
    requirements,
    domain,
    emailId,
  } = req.body;

  try {
    // Logging the received data for debugging
    console.log("Received notice data:", req.body);

    // Creating a new notice in the database
    const notices = await db.Notices.create({
      subject,
      description,
      link,
      createdDate: new Date(), // Automatically setting the created date
      designation,
      duration,
      stipend,
      workplace,
      contact,
      location,
      positions,
      requirements,
      domain,
      emailId,
    });

    // Logging the created notice for debugging
    console.log("Created notice:", notices);

    // Sending the created notice as a response
    return res.status(201).json(notices);
  } catch (err) {
    // Logging the error for debugging
    console.error("Error in creating notice:", err);

    // Passing the error to the next middleware
    next({
      status: 400,
      message: err.message,
    });
  }
};


// Afficher tous les avis
exports.showNotices = async (req, res, next) => {
  try {
    const notices = await db.Notices.findAll();
    res.status(200).json(notices);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

// Afficher les avis pour un étudiant spécifique
exports.studentsNotices = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    const studentInternships = await db.Student.findByPk(id, {
      include: [{
        model: db.Internship,
        as: 'internships',
        attributes: ['comments']
      }]
    });

    res.status(200).json(studentInternships ? studentInternships.internships : []);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

// Supprimer un avis
exports.deleteNotice = async (req, res, next) => {
  const { id: noticeId } = req.params;
  try {
    const notice = await db.Notices.findByPk(noticeId);
    if (!notice) {
      return res.status(404).json({ message: "No Notice found" });
    }
    
    await notice.destroy();
    return res.status(202).json({ notice, deleted: true });
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};
