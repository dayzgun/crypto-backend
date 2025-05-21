// src/utils/sendMail.js
const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

// URL pública de tu logo; puedes subirlo a tu bucket o usar el public de tu frontend
const LOGO_URL = 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png'
const SLOGAN = 'Tu puerta al universo cripto'

async function sendVerificationEmail(to, name, code) {
  await transporter.sendMail({
    from: `"Crypto App" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Tu código de verificación – Crypto App',
    html: `
      <div style="
        max-width:600px;
        margin:0 auto;
        padding:20px;
        font-family:Arial, sans-serif;
        color:#333;
        background:#f9f9f9;
        border:1px solid #ececec;
        border-radius:8px;
      ">
        <!-- Header con logo -->
        <div style="text-align:center; margin-bottom:20px;">
          <img src="${LOGO_URL}" alt="Crypto App Logo" style="width:80px;"/>
          <h2 style="margin:10px 0 0;font-size:18px;color:#444;">Crypto App</h2>
          <p style="margin:5px 0 0;color:#777;font-style:italic;">${SLOGAN}</p>
        </div>

        <!-- Cuerpo -->
        <p>Hola <strong>${name}</strong>,</p>
        <p>Gracias por registrarte en <strong>Crypto App</strong>. Para activar tu cuenta, por favor ingresa el siguiente código de verificación en la aplicación:</p>
        <div style="
          text-align:center;
          margin:20px 0;
        ">
          <span style="
            display:inline-block;
            padding:15px 25px;
            font-size:24px;
            letter-spacing:4px;
            background:#1e1e2f;
            color:#fff;
            border-radius:4px;
          ">${code}</span>
        </div>
        <p>Si no has solicitado este correo, puedes ignorarlo sin problema.</p>

        <!-- Footer -->
        <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#aaa;text-align:center;">
          &copy; ${new Date().getFullYear()} Crypto App – Todos los derechos reservados.
        </p>
      </div>
    `
  })
}

async function sendPasswordResetEmail(to, name, code) {
  await transporter.sendMail({
    from: `"Crypto App" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Código para restablecer tu contraseña – Crypto App',
    html: `
      <div style="
        max-width:600px;
        margin:0 auto;
        padding:20px;
        font-family:Arial, sans-serif;
        color:#333;
        background:#f9f9f9;
        border:1px solid #ececec;
        border-radius:8px;
      ">
        <!-- Header -->
        <div style="text-align:center; margin-bottom:20px;">
          <img src="${LOGO_URL}" alt="Crypto App Logo" style="width:80px;"/>
          <h2 style="margin:10px 0 0;font-size:18px;color:#444;">Crypto App</h2>
          <p style="margin:5px 0 0;color:#777;font-style:italic;">${SLOGAN}</p>
        </div>

        <!-- Cuerpo -->
        <p>Hola <strong>${name}</strong>,</p>
        <p>Has solicitado restablecer tu contraseña en <strong>Crypto App</strong>. Para continuar, ingresa tu usuario y utiliza el siguiente código de recuperación:</p>
        <div style="
          text-align:center;
          margin:20px 0;
        ">
          <span style="
            display:inline-block;
            padding:15px 25px;
            font-size:24px;
            letter-spacing:4px;
            background:#1e1e2f;
            color:#fff;
            border-radius:4px;
          ">${code}</span>
        </div>
        <p>Este código es válido por 15 minutos. Si no solicitaste restablecer tu contraseña, ignora este correo.</p>

        <!-- Footer -->
        <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#aaa;text-align:center;">
          &copy; ${new Date().getFullYear()} Crypto App – Todos los derechos reservados.
        </p>
      </div>
    `
  })
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
}
