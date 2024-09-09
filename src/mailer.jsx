// mailer.js
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use a different service like 'hotmail'
  auth: {
    user: 'sphllzulu@gmail.com', // Your email address
    pass: 'Ntsw3mb4!'    // Your email password
  }
});

// Function to send email
const sendCancellationEmail = async (email, bookingId) => {
  try {
    // Define email options
    const mailOptions = {
      from: 'sphllzulu@gmail.com', // Sender address
      to: email, // List of recipients
      subject: 'Booking Cancellation Confirmation', // Subject line
      text: `Your booking with ID ${bookingId} has been cancelled.`, // Plain text body
      // You can also use HTML body
      // html: `<p>Your booking with ID <strong>${bookingId}</strong> has been cancelled.</p>`
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent successfully.');
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    throw new Error('Failed to send cancellation email');
  }
};

module.exports = sendCancellationEmail;
