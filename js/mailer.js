var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "ryanwardapp@gmail.com",
        pass: "LeagueWard1"
    }
});

module.exports = smtpTransport