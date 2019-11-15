const sgMail = require("@sendgrid/mail");

async function sendEmail(to, subject, html) {
    sgMail.setApiKey("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");
    const mail = {
        from: "chijiokeudokporo@agusto.com",
        to,
        subject,
        text: html.replace(/<[^>]*>?/gm, ""),
        html
    };
    var res = await sgMail.send(mail);
    return res;
}

module.exports = { sendEmail };
