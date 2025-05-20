// routes/resetPassword.js
const express = require('express');
const pool = require('../utils/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, new_password_hash, code } = req.body;

  try {
    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Verificar si ya excedió el total permitido
    if (user.reset_total >= 3) {
      return res.status(403).json({ error: 'Límite de restablecimientos alcanzado. Contacta soporte.' });
    }

    // Verificar que aún tiene intentos
    if (user.reset_attempts >= 5) {
      return res.status(403).json({ error: 'Demasiados intentos. Solicita un nuevo código.' });
    }

    // Verificar expiración
    const ahora = new Date();
    const expira = new Date(user.reset_code_expires);
    if (ahora > expira) {
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
    }

    // Verificar que el código sea correcto
    if (code !== user.reset_code) {
      await pool.query(
        'UPDATE users SET reset_attempts = reset_attempts + 1 WHERE username = $1',
        [username]
      );
      return res.status(401).json({ error: 'Código incorrecto. Intenta de nuevo.' });
    }

    // ✅ Todo correcto → actualizar contraseña y limpiar
    await pool.query(
      `UPDATE users SET
         password_hash = $1,
         reset_code = NULL,
         reset_code_expires = NULL,
         reset_attempts = 0,
         reset_total = reset_total + 1
       WHERE username = $2`,
      [new_password_hash, username]
    );

    res.json({ ok: true, msg: 'Contraseña actualizada correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

module.exports = router;
