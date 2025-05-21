// routes/verifyCode.js
const express = require('express')
const pool = require('../utils/db')

const router = express.Router()

router.post('/', async (req, res) => {
  const { username, verification_code } = req.body
  const code = verification_code

  try {
    // 1️⃣ Buscamos al usuario por username + código
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND verification_code = $2',
      [username, code]
    )

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: 'Código inválido o usuario no encontrado' })
    }

    // 2️⃣ Marcamos verificado y limpiamos el código
    await pool.query(
      `UPDATE users 
         SET verified = TRUE,
             verification_code = NULL
       WHERE username = $1`,
      [username]
    )

    // 3️⃣ Respondemos OK
    res.json({ ok: true, msg: 'Cuenta verificada correctamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al verificar el código' })
  }
})

module.exports = router
