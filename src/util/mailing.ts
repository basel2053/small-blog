import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import { confirmTemplate, resetTemplate } from './mail-templates/mails';
dotenv.config();

const { MAILING_USER, MAILING_PW, FROM_EMAIL } = process.env;

// NOTE  remember to pass options to the function for email and content
const mail = (
  email: string,
  subject: string,
  link: string,
  name?: string,
  code?: string
) => {
  // HERE  create SMTP service to be able to send mails
  const transporter = createTransport({
    service: 'hotmail',
    auth: {
      user: MAILING_USER,
      pass: MAILING_PW,
    },
  });

  const message = {
    from: `Beanzo-Blog <${FROM_EMAIL}>`,
    to: email,
    subject: subject,
    text: 'For clients with plaintext support only',
    html: code ? resetTemplate(link, code, name) : confirmTemplate(link, name),
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
