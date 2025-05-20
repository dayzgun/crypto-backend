// routes/login.js
const express = require('express');
const pool = require('../utils/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password_hash } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    if (!user.verified) {
      return res.status(401).json({ error: 'Cuenta no verificada. Revisa tu correo.' });
    }

    if (user.password_hash !== password_hash) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
