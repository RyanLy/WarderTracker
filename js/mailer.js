var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "ryanwardapp@gmail.com",
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = smtpTransport