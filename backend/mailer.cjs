// // server.js
// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Create a transporter using SMTP

// let transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // Use TLS
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// app.post('/api/send-email', async (req, res) => {
//   const { to, subject, text } = req.body;

//   try {
//     let info = await transporter.sendMail({
//       from: '"Eezy Living" <${process.env.EMAIL_USER}>',
//       to: to,
//       subject: subject,
//       text: text,
//     });

//     console.log("Message sent: %s", info.messageId);
//     res.status(200).send('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).send('Error sending email');
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// module.exports = { transporter };


const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a transporter using SMTP
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify the connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP verification failed:', error);
  } else {
    console.log("Server is ready to send emails");
  }
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    let info = await transporter.sendMail({
      from: `"Eezy Living" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send(`Error sending email: ${error.message}`); 
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
