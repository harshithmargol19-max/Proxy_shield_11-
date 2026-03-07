import nodemailer from 'nodemailer';

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const createSMTPConfig = () => {
  return {
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT || 2525,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
};

export { createEmailTransporter, createSMTPConfig };
