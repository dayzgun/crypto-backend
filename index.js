const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const verifyCodeRoute = require('./routes/verifyCode');
const forgotPasswordRoute = require('./routes/forgotPassword');
const resetPasswordRoute = require('./routes/resetPassword');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/verify-code', verifyCodeRoute);
app.use('/forgot-password', forgotPasswordRoute);
app.use('/reset-password', resetPasswordRoute);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('✅ API funcionando correctamente');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
