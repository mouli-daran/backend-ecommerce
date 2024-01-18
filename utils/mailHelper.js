const nodemailer = require('nodemailer')

const mailHelper = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      
        const message = {
            from: 'cruzemouli15@gmail.com', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.message, // plain text body
            // html: "<a></a>", // html body
          }
    
        await transporter.sendMail(message);
}


    module.exports = mailHelper;