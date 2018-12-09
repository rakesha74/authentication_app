const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: "yedvsywdmk5avyc5@ethereal.email",
        pass: "vSUvBcbQy8wChQaKjQ"
    }
});


let mailOptions = {
    from: 'yedvsywdmk5avyc5@ethereal.email', // sender address
    to: 'rakesha74@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
};

module.exports.transporter = transporter;
module.exports.mailOptions = mailOptions;
