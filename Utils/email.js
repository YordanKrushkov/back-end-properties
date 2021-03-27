require('dotenv').config();
const nodemailer = require('nodemailer');

//Send Email
const Email = async (req, res) => {
  const body = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_ADDRESS,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.NODEMAILER_ADDRESS,
    to: body.to,
    subject: `You have a new message from ${body.from_name}`,
    text: ` ${body.message} \n 
    \n
    Reply to:
    ${body.reply_to}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = Email;