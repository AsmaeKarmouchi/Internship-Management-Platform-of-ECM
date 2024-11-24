const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const StudentModel = require('./student');
const InternshipModel = require('./internship');
const NoticesModel = require('./notices');
const FacultyModel = require('./faculty');

// Créez les instances des modèles en utilisant la connexion Sequelize et les types Sequelize
const Student = StudentModel(sequelize, Sequelize);
const Internship = InternshipModel(sequelize, Sequelize);
const Notices = NoticesModel(sequelize, Sequelize);
const Faculty = FacultyModel(sequelize, Sequelize);


// Synchronisation avec la base de données
sequelize.sync()
  .then(() => {
    console.log('Models synchronized with the database');
  })
  .catch(err => {
    console.error('Error synchronizing models:', err);
  });

// Initialisez les associations entre les modèles si nécessaire

module.exports = {
  Student,
  Internship,
  Notices,
  Faculty,
};
