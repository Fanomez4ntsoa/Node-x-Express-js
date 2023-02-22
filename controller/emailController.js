const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler ( async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_ID,
      pass: process.env.MP,
    }
  });

  const mailOptions = {
    from: ' "Welcome" <no-response@gmail.com',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
        // do something useful
    }
  });
});
module.exports = sendEmail;