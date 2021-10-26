const nodemailer = require("nodemailer");
const mailSender = {
  sendGmail: function (param) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      prot: 587,
      host: "smtp.gmail.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GOOGLE_ID,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.GOOGLE_ID,
      to: param.toEmail,
      subject: param.subject,
      html: param.html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};

module.exports = mailSender;
