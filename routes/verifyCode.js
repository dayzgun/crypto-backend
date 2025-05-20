// routes/verifyCode.js
const express = require('express');
const pool = require('../utils/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND verification_code = $2',
      [email, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Código inválido o usuario no encontrado' });
    }

    await pool.query(
      'UPDATE users SET verified = TRUE, verification_code = NULL WHERE email = $1',
      [email]
    );

    res.json({ ok: true, msg: 'Cuenta verificada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al verificar el código' });
  }
});

module.exports = router;
