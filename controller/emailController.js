const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler ( async(data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILER_ID,
      pass: process.env.MP,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendEmail({
    from: ' "Welcome" <no-response@gmail.com',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  });

  console.log('Message sent: %s', info.messageId);
  
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

});

module.exports = sendEmail;