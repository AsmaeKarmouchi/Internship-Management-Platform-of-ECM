const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is exported from 'db.js'

module.exports = (sequelize, DataTypes) => {
const Internship = sequelize.define('Stage', {

  studentId: {
    type: DataTypes.INTEGER, // or INTEGER if using auto-incrementing IDs
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rollNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  div: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  prevSemAttendance: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  emailId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  submittedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  approvedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  internshipType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  workplace: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationOfInternship: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stipend: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  NOCRequired: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  files: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Adjust the type according to your file storage strategy
    allowNull: true,
  },
  approvedByDesignation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  approvedByRemark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  applicationStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  undertakingStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  offerLetterStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  marksheetsStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  attendanceStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  completionStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  holderDesignation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comments: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
});

Internship.associate = function(models) {
  // Association avec le modèle Student
  Internship.belongsTo(models.Student, {
    foreignKey: 'studentId',
    as: 'student'
  });
};

return Internship ;
};
