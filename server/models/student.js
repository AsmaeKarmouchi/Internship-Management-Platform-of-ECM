const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is exported from 'db.js'

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Etudiant', {

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
    // unique: true, Sequelize handles unique constraints differently
  },
  marksheets: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Adjust the type according to your data structure
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Student.associate = function(models) {
  // Association avec le modèle Internship
  Student.hasMany(models.Internship, {
    foreignKey: 'studentId',
    as: 'internships'
  });
};



// Pre-save hook for hashing password
Student.beforeCreate(async (student, options) => {
  if (student.changed('password')) {
    const hashedPassword = await bcrypt.hash(student.password, 10);
    student.password = hashedPassword;
  }
});

// Method to compare passwords
Student.prototype.comparePassword = async function (attempt) {
  return await bcrypt.compare(attempt, this.password);
};

return Student;
}
