const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendVerificationEmail(to, name, code) {
  await transporter.sendMail({
    from: `"Crypto App" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Tu código de verificación',
    html: `
      <h2>Hola, ${name}</h2>
      <p>Gracias por registrarte en Crypto App.</p>
      <p>Tu <strong>código de verificación</strong> es:</p>
      <h1>${code}</h1>
      <p>Ingresa este código en la app para activar tu cuenta.</p>
    `
  });
}

async function sendPasswordResetEmail(to, name, code) {
  await transporter.sendMail({
    from: `"Crypto App" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Código para restablecer tu contraseña',
    html: `
      <h2>Hola, ${name}</h2>
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Tu <strong>código de recuperación</strong> es:</p>
      <h1>${code}</h1>
      <p>Este código es válido por 15 minutos. Si no solicitaste esto, puedes ignorarlo.</p>
    `
  });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
