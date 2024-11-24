const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.showFacultyProfile = async (req, res, next) => {
  try {
    const { id } = req.decoded;    
    const profile = await db.Faculty.findByPk(id);
    const formattedProfile = {
      name: {
        firstname: profile.dataValues.firstname,
        lastname: profile.dataValues.lastname,
      },
      currentClass: {
        year: profile.dataValues.year,
        div: String(profile.dataValues.div),
      },
      designation:profile.dataValues.designation,
      emailId: profile.dataValues.emailId,
      department:profile.dataValues.department,
      username:profile.dataValues.username,
    };
    console.log(formattedProfile);
    if (formattedProfile) {
      return res.json(profile);
    } else {
      throw new Error("Profile not found");
    }
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};

exports.updateFProfile = async (req, res, next) => {
  try {
    const { id } = req.params;    
    const profile = await db.Faculty.findByPk(id);
    
    if (!profile) {
      throw new Error("Profile not found");
    }

    const updatedProfile = await profile.update({
      name: {
        firstname: req.body.firstname || profile.name.firstname,
        lastname: req.body.lastname || profile.name.lastname,
      },
      currentClass: {
        year: req.body.year || profile.currentClass.year,
        div: req.body.div || profile.currentClass.div,
      },
      emailId: req.body.emailId || profile.emailId,
      username: req.body.username || profile.username,
      department: req.body.department || profile.department,
      designation: req.body.designation || profile.designation,
    });
    
    if (updatedProfile) {
      return res.status(200).json(updatedProfile);
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    next({
      status: 400,
      message: error.message,
    });
  }
};
