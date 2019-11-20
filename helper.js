const sgMail = require("@sendgrid/mail");
//const config = require("./config/config");
const config = require("./config/configheroku"); // For Heroku

async function sendEmail(to, subject, html) {
    sgMail.setApiKey(config.key);
    const mail = {
        from: "invitation@agusto.com",
        to,
        subject,
        text: html.replace(/<[^>]*>?/gm, ""),
        html
    };
    var res = await sgMail.send(mail);
    return res;
}

module.exports = { sendEmail };
