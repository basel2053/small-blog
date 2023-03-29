"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
const mails_1 = require("./mail-templates/mails");
dotenv_1.default.config();
const { MAILING_USER, MAILING_PW, FROM_EMAIL } = process.env;
// NOTE  remember to pass options to the function for email and content
const mail = (email, subject, link, name, code) => {
    // HERE  create SMTP service to be able to send mails
    const transporter = (0, nodemailer_1.createTransport)({
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
        html: code ? (0, mails_1.resetTemplate)(link, code, name) : (0, mails_1.confirmTemplate)(link, name),
    };
    transporter.sendMail(message, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('mail sent');
        }
    });
};
exports.default = mail;
