var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'javitempad@gmail.com',
    pass: ''
  }
});

var mailOptions = {
  from: 'javitempad@gmail.com',
  to: 'javitempad@gmail.com',
  subject: 'Javi - Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});