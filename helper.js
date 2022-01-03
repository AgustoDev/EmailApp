const sgMail = require("@sendgrid/mail");
require("dotenv").config();
//const config = require("./config/config");
const config = require("./config/configheroku"); // For Heroku

async function sendEmail(to, subject, html) {
  sgMail.setApiKey(process.env.SendgridKey);
  const mail = {
    from: "invitation@agusto.com",
    to,
    subject,
    text: html.replace(/<[^>]*>?/gm, ""),
    html,
  };
  var res = await sgMail.send(mail);
  return res;
}

module.exports = { sendEmail };
