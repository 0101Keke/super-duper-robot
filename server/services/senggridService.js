const sgMail = require('@sendgrid/mail');
const axios = require('axios'); // used only for example if desired

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
      html
    };
    await sgMail.send(msg);
    return true;
  } catch (err) {
    console.error('SendGrid error:', err?.response?.body || err.message);
    return false;
  }
};

module.exports = { sendEmail };
