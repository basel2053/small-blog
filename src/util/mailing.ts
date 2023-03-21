import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { MAILING_USER, MAILING_PW, FROM_EMAIL } = process.env;

// NOTE  remember to pass options to the function for email and content
const mail = (email: string, subject: string, link: string, name?: string) => {
  // HERE  create SMTP service to be able to send mails
  const transporter = createTransport({
    service: 'hotmail',
    auth: {
      user: MAILING_USER,
      pass: MAILING_PW,
    },
  });

  const message = {
    from: `Beanzo <${FROM_EMAIL}>`,
    to: email,
    subject: subject,
    text: 'For clients with plaintext support only',
    html: `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>Hi ${name},</p>
        <p>You requested to reset your password.</p>
        <p> Please, click the link below to reset your password</p>
          <a href="${link}">Reset Password</a>
      </body>
    </html>`,
  };

  transporter.sendMail(message, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('mail sent');
    }
  });
};

export default mail;
