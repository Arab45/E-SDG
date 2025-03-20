const nodemailer = require("nodemailer");


const sendMail = (to, subject, body) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });

    const emailBody = {
        from: `"SDG Edu" <${process.env.EMAIL_USERNAME}>`,
        replyTo: process.env.APP_EMAIL,
        to: to,
        subject: subject,
        html: body
    };

    transporter.sendMail(emailBody, (error, success) => {
        if (error) {
            console.log(`Unable to send email, something went wrong ${error}`);
        };

        if (success) {
            console.log(`successfully send email. ${success.messageId}`);
        }
    });
};

module.exports = sendMail;
