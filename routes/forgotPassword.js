// routes/forgotPassword.js
const express = require('express');
const pool = require('../utils/db');
const { sendPasswordResetEmail } = require('../utils/sendMail');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      // No revelar si el usuario existe o no
      return res.status(200).json({
        ok: true,
        msg: 'Si el usuario existe, se enviará un código por correo.'
      });
    }

    const user = result.rows[0];

    // ❌ Verificar límite total de restablecimientos
    if (user.reset_total >= 3) {
      return res.status(403).json({
        error: 'Has alcanzado el número máximo de restablecimientos permitidos.'
      });
    }

    // ✅ Generar código y expiración
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await pool.query(
      `UPDATE users
       SET reset_code = $1,
           reset_code_expires = $2,
           reset_attempts = 0
       WHERE username = $3`,
      [code, expires, username]
    );

    await sendPasswordResetEmail(user.email, user.name, code);

    res.json({
      ok: true,
      msg: 'Se ha enviado un código al correo asociado a este usuario.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
});

module.exports = router;
