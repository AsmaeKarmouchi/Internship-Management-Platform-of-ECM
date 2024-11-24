const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAILFROM,
    pass: process.env.PASSWORD,
  },
});


exports.register = async (req, res, next) => { //exports c'est a dire lu dans tous les dossiers et fichiers dans le serveur
  try {
    const { username, emailId, password } = req.body; //request info reçu json file username+emailId+password 

    // Vérification si le username est déjà pris
    const existingStudent = await db.Student.findOne({ where: { username } }); //findOne=select..where.. ORM
    if (existingStudent) {
      throw new Error('Sorry, username is already taken.');
    }
    // Création du nouvel étudiant
    //const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await db.Student.create({ username, emailId, password});
    
    if (newStudent) {
      const { id } = newStudent;
      let link = "<h2>Welcome to IMS!</h2><br/><h4>Your registration to IMS as a student was successful.</h4><br/>";

      const email = {
        from: process.env.EMAILFROM,
        to: emailId,
        subject: 'Registration Successful',
        html: link,
      };

      transporter.sendMail(email, (err, info) => {
        if (err) {
          console.error('Could not send email', err);
          return res.status(500).json({ message: 'Could not send email' });
        } else {
          const { id, username } = newStudent;
          const token = jwt.sign({ id, username }, process.env.SECRET);
          return res.status(201).json({ id, username, token });
        }
      });
    } else {
      throw new Error('Something went wrong, please try again!');
    }
  } catch (err) {
    next(err);
  }
};



exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Chercher l'étudiant par le nom d'utilisateur
    const student = await db.Student.findOne({ where: { username } });
    
    if (!student) {
      console.log('Invalid username');
      throw new Error('Invalid username/password');
    }
    
    
    
    // Vérifier si le mot de passe est valide
    const validPassword = await bcrypt.compare(password, student.password);

    if (validPassword) {
      
      const { id, username } = student;
      const token = jwt.sign({ id, username }, process.env.SECRET);
      res.json({ id, username, token });
    } else {
      console.log('Invalid password');
      throw new Error('Invalid username/password');
    }
  } catch (err) {
    next(err);
  }
};

exports.genPassword = () => {
  var length = 10,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@_',
    retVal = '';
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { username, emailId, role } = req.body;

    let user;
    if (role === 'student') {
      user = await db.Student.findOne({ where: { username, emailId } });
    } else {
      user = await db.Faculty.findOne({ where: { username, emailId } });
    }

    if (!user) {
      let err = new Error('Sorry, the credentials do not match with the one in the database.');
      throw err;
    } else {
      let tempPwd = this.genPassword();

      // Hashing the temporary password before saving
      const hashedPassword = await bcrypt.hash(tempPwd, 10);
      user.password = hashedPassword;

      // Saving the new password
      await user.save();

      var email = {
        from: process.env.EMAILFROM,
        to: emailId,
        subject: 'Password Changed.',
        html:
          'Your request for password reset has been approved.' +
          "<br />You can login to IMS using this temporary password: <br /><b>" +
          tempPwd +
          '</b>',
      };

      client.sendMail(email, (err, info) => {
        if (err) {
          next(new Error('Could not send email' + err));
        } else {
          return res.status(200).json({ message: 'Email sent successfully' });
        }
      });
    }
  } catch (err) {
    next(new Error('Could not reset password. Please try again.'));
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    const details = req.body;

    const student = await db.Student.findByPk(id);

    if (!student) {
      throw new Error('Student not found');
    }

    // Si les données reçues contiennent 'name'
    if ('name' in details) {
      const { firstname, lastname } = details.name;
      await student.update({
        firstname: firstname || student.firstname,
        lastname: lastname || student.lastname,
      });
    }

    // Si les données reçues contiennent 'currentClass'
    if ('currentClass' in details) {
      const { year, div } = details.currentClass;
      await student.update({
        year: year || student.year,
        div: div || student.div,
      });
    }

    // Mise à jour de chaque champ
    for (const [key, value] of Object.entries(details)) {
      student[key] = value;

    }

    // Sauvegarde des modifications
    await student.save();

    // Renvoie les données mises à jour
    const { firstname, lastname, year, div, rollNo, prevSemAttendance, emailId } = student;
    res.status(200).json({ firstname, lastname, year, div, rollNo, prevSemAttendance, emailId });
  } catch (err) {
    next(new Error('Could not update'));
  }
};


exports.getStudentDetails = async (req, res, next) => {
  try {
    const { id } = req.decoded;

    const student = await db.Student.findByPk(id);
    // Reformater les données pour les envoyer au composant StudentProfile
    const formattedStudent = {
      name: {
        firstname: student.dataValues.firstname,
        lastname: student.dataValues.lastname,
      },
      currentClass: {
        year: student.dataValues.year,
        div: String(student.dataValues.div),
      },
      prevSemAttendance: String(student.dataValues.prevSemAttendance),
      rollNo: String(student.dataValues.rollNo),
      emailId: student.dataValues.emailId,
    };
    
    if (!student) {
      throw new Error('Aucun étudiant trouvé');
    }

    res.status(200).json(formattedStudent);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};


exports.resetStudentPassword = async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  const { id } = req.decoded;

  try {
    const student = await db.Student.findByPk(id);

    if (!student) {
      throw new Error('Student not found');
    }

    const valid = await student.comparePassword(oldpassword);

    if (valid) {
      const newhashed = await bcrypt.hash(newpassword, 10);
      student.password = newhashed;
      await student.save();

      res.status(200).json(student);
    } else {
      throw new Error('Old password is wrong!');
    }
  } catch (err) {
    next(err);
  }
};
