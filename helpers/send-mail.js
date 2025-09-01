const nodemailer = require("nodemailer")
const config = require("../config")

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secureConnection: false,
    tls: {
        ciphers: "SSLv3"
    },
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    }
}); 

module.exports = transporter;