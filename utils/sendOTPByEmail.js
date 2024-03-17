const nodemailer = require("nodemailer");
require("dotenv").config();

const adminEmail = process.env.USERNAME_GMAIL;
const adminPassword = process.env.PASSWORD_APPGMAIL;
const mailHost = "smtp.gmail.com";
const mailPort = 456;
// Tạo transporter
const transporter = nodemailer.createTransport({
  host: mailHost,
  service: "gmail",
  logger: true,
  debug: true,
  port: mailPort,
  secure: true,
  secureConnection: false,
  auth: {
    user: adminEmail,
    pass: adminPassword,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// Hàm gửi email
const sendOTPByEmail = async (email, OTP) => {
  try {
    const mailOptions = {
      from: adminEmail,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${OTP} (It is expired after 2 min)`,
    };

    // Gửi Email
    return transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("Error sending email: ", err.response);
  }
};

module.exports = sendOTPByEmail;
