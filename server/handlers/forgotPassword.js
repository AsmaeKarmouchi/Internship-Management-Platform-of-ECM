const db = require("../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configurer le transporteur de nodemailer
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

module.exports = (app) => {
  app.post('/forgotPassword', async (req, res) => {
    const emailID = req.body.emailID;
    if (!emailID) {
      return res.status(400).send('email required');
    }

    try {
      const student = await db.Student.findOne({
        where: { emailID: emailID },
      });

      if (!student) {
        return res.status(403).send('email not in db');
      } else {
        const token = crypto.randomBytes(20).toString('hex');
        await student.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
        });

        const mailOptions = {
          from: process.env.EMAILFROM,
          to: student.emailID,
          subject: 'Link To Reset Password',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                + `http://localhost:3031/reset/${token}\n\n`
                + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json('recovery email sent');
      }
    } catch (error) {
      console.error("Error in /forgotPassword: ", error);
      res.status(500).send('Error in sending email');
    }
  });
};
