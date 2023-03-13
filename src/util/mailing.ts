import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { MAILING_USER, MAILING_PW, MAILING_HOST } = process.env;

// NOTE  remember to pass options to the function for email and content
const mail = () => {
  // HERE  create SMTP service to be able to send mails
  const transporter = createTransport({
    host: MAILING_HOST,
    port: 2525,
    secure: true,
    auth: {
      user: MAILING_USER,
      pass: MAILING_PW,
    },
  });

  const message = {
    from: 'basselsalah2053@gmail.com',
    to: 'baselsalah2053@gmail.com',
    subject: 'AMP4EMAIL message',
    text: 'For clients with plaintext support only',
    html: '<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>',
    amp: `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
      </head>
      <body>
        <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
        <p>GIF (requires "amp-anim" script in header):<br/>
          <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
      </body>
    </html>`,
  };

  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default mail;
