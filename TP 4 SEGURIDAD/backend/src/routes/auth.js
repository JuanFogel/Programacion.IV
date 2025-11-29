const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

// 🔒 Rate limiting para /api/login
const loginRateLimiter = rateLimit({
  windowMs: 1000,  // 1 segundo
  max: 5,          // máximo 5 intentos por IP en 1 segundo
  standardHeaders: true,
  legacyHeaders: true,
  message: {
    error: 'Demasiados intentos de login. Intente nuevamente más tarde.'
  }
});

// Rutas de autenticación
router.post('/login', loginRateLimiter, authController.login);
router.post('/register', authController.register);
router.post('/verify-token', authController.verifyToken);
router.post('/check-username', authController.checkUsername);

module.exports = router;
