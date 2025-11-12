// transporter.js
const nodemailer = require("nodemailer");

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // simplifies host/port setup
  auth: {
    user: process.env.GMAIL_USER || "psurya162@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD || "twix oygv vefv mmfq",
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail SMTP configuration error:", error);
  } else {
    console.log("✅ Gmail SMTP server is ready to send emails");
  }
});

module.exports = transporter;
