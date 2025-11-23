const express = require('express');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

function createAuthRouter() {
  const router = express.Router();

  // Crear limiter fresco en cada llamada
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 6, // para que deje pasar más y permita testear delay
    statusCode: 429,
    message: { error: 'Demasiados intentos. Espere unos minutos.' }
  });

  router.post('/login', authLimiter, authController.login);
  router.post('/register', authLimiter, authController.register);
  router.post('/auth/verify', authController.verifyToken);
  router.post('/check-username', authController.checkUsername);

  return router;
}

module.exports = createAuthRouter;