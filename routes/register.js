// routes/register.js
const express = require('express');
const pool = require('../utils/db');
const { sendVerificationEmail } = require('../utils/sendMail');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, username, email, password_hash } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese correo o nombre de usuario' });
    }

    await pool.query(
      `INSERT INTO users (name, username, email, password_hash, verification_code)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, username, email, password_hash, verificationCode]
    );

    await sendVerificationEmail(email, name, verificationCode);

    res.json({ ok: true, msg: 'Revisa tu correo para verificar tu cuenta' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

module.exports = router;
