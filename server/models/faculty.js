const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  const Faculty= sequelize.define('Professeur', { //table professeur

  firstname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING,
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
  emailId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
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
  
  designation: { //colonne dans la table professeur
    type: DataTypes.ENUM(
      'ClassCoordinator',
      'DepartmentInternshipCoordinator',
      'CollegeInternshipCoordinator',
      'HOD',
      'Principal',
      'Admin'
    ),
    defaultValue: 'ClassCoordinator',
  },
  created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});


// Middleware equivalent in Sequelize
Faculty.beforeCreate(async (faculty) => {  
  try {
    const hashed = await bcrypt.hash(faculty.password, 10);
    faculty.password = hashed;
  } catch (err) {
    throw new Error('Error hashing password');
  }
});

// Method equivalent in Sequelize
Faculty.prototype.comparePassword = async function (attempt) {
  try {
    return await bcrypt.compare(attempt, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

return  Faculty;
};