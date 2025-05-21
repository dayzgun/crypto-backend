// routes/resetPassword.js
const express = require('express')
const pool = require('../utils/db')

const router = express.Router()

router.post('/', async (req, res) => {
  const { username, new_password_hash, code, only_verify } = req.body

  try {
    // 1️⃣ Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    const user = result.rows[0]

    // 2️⃣ Límite de restablecimientos totales
    if (user.reset_total >= 3) {
      return res.status(403).json({ error: 'Límite de restablecimientos alcanzado. Contacta soporte.' })
    }

    // 3️⃣ Límite de intentos
    if (user.reset_attempts >= 5) {
      return res.status(403).json({ error: 'Demasiados intentos. Solicita un nuevo código.' })
    }

    // 4️⃣ Verificar expiración del código
    const ahora = new Date()
    const expira = new Date(user.reset_code_expires)
    if (ahora > expira) {
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' })
    }

    // 5️⃣ Verificar que el código sea correcto
    if (code !== user.reset_code) {
      // Incrementar contador de intentos fallidos
      await pool.query(
        'UPDATE users SET reset_attempts = reset_attempts + 1 WHERE username = $1',
        [username]
      )
      return res.status(401).json({ error: 'Código incorrecto. Intenta de nuevo.' })
    }

    // 🔍 Si sólo queremos verificar el código, respondemos aquí
    if (only_verify) {
      return res.json({ ok: true, msg: 'Código verificado correctamente' })
    }

    // 6️⃣ Todo correcto → actualizar contraseña y limpiar datos de reset
    await pool.query(
      `UPDATE users SET
         password_hash = $1,
         reset_code = NULL,
         reset_code_expires = NULL,
         reset_attempts = 0,
         reset_total = reset_total + 1
       WHERE username = $2`,
      [new_password_hash, username]
    )

    res.json({ ok: true, msg: 'Contraseña actualizada correctamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al restablecer la contraseña' })
  }
})

module.exports = router
