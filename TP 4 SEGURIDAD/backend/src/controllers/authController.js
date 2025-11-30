const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Mapa para manejar intentos fallidos (para delay + captcha)
const failedLoginAttempts = new Map(); 
const loginBurstAttempts = new Map(); 
const BURST_WINDOW_MS = 1000;   // 1 segundo
const BURST_MAX_ATTEMPTS = 5;   // más de 5 intentos en 1s => 429
const MAX_FAILED_FOR_CAPTCHA = 3; 

const login = async (req, res) => {
  const { username, password, captcha } = req.body;
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  // 1) ESTADO PARA DELAY + CAPTCHA (verificar PRIMERO)
  let state = failedLoginAttempts.get(ip);
  if (!state) {
    state = { failedCount: 0 };
  }

  // Si ya hubo varios intentos fallidos, exigir CAPTCHA (ANTES del rate limiting)
  if (state.failedCount >= MAX_FAILED_FOR_CAPTCHA && !captcha) {
    return res.status(400).json({
      error: 'Se requiere captcha válido para continuar'
    });
  }

  // 2) RATE LIMITING POR RÁFAGA (después de verificar CAPTCHA)
  let burst = loginBurstAttempts.get(ip) || [];

  // Nos quedamos solo con los intentos del último segundo
  burst = burst.filter(ts => now - ts < BURST_WINDOW_MS);
  burst.push(now);
  loginBurstAttempts.set(ip, burst);

  // Si hay más de 5 intentos en 1 segundo -> 429
  if (burst.length > BURST_MAX_ATTEMPTS) {
    return res.status(429).json({
      error: 'Demasiados intentos de login. Intente nuevamente más tarde.'
    });
  }

  const query = `SELECT * FROM users WHERE username = ?`;

  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    // Helper para manejar intento fallido con DELAY PROGRESIVO
    const handleFailedAttempt = async () => {
      state.failedCount += 1;
      failedLoginAttempts.set(ip, state);

      // Delay exponencial: 1s, 2s, 4s, 8s... (tope 8s)
      const delayMs = Math.min(8000, 1000 * Math.pow(2, state.failedCount - 1));

      await new Promise(resolve => setTimeout(resolve, delayMs));

      return res.status(401).json({ error: 'Credenciales inválidas' });
    };

    // Usuario inexistente
    if (results.length === 0) {
      return handleFailedAttempt();
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return handleFailedAttempt();
    }

    // Login correcto: reseteamos contador de fallos
    failedLoginAttempts.delete(ip);

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'supersecret123'
    );

    res.json({ token, username: user.username });
  });
};

const register = async (req, res) => {
  const { username, password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, hashedPassword, email], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }
    res.json({ message: 'Usuario registrado con éxito' });
  });
};

const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    req.session.userId = decoded.id;
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


// Rate limiting específico para checkUsername
const checkUsernameAttempts = new Map();
const CHECK_USERNAME_WINDOW_MS = 60000; // 1 minuto
const CHECK_USERNAME_MAX_ATTEMPTS = 20; // máximo 20 intentos por minuto

const checkUsername = (req, res) => {
  const { username } = req.body;
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  // Rate limiting para prevenir ataques de enumeración
  let attempts = checkUsernameAttempts.get(ip) || [];
  attempts = attempts.filter(ts => now - ts < CHECK_USERNAME_WINDOW_MS);
  
  if (attempts.length >= CHECK_USERNAME_MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Demasiados intentos. Intente más tarde.' });
  }
  
  attempts.push(now);
  checkUsernameAttempts.set(ip, attempts);

  // Validación estricta de entrada
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Formato de usuario inválido' });
  }

  // Validar formato: solo letras, números y guión bajo, entre 3 y 20 caracteres
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    // Devolver respuesta genérica sin revelar si el formato es inválido
    return res.json({ exists: false });
  }

  // CORREGIDO: Usar consultas parametrizadas
  const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      // No exponer detalles del error SQL - respuesta genérica
      console.error('Error en checkUsername:', err.message);
      return res.json({ exists: false });
    }

    // Agregar delay aleatorio para prevenir timing attacks
    const delay = Math.floor(Math.random() * 100) + 50; // 50-150ms
    setTimeout(() => {
      const exists = results[0].count > 0;
      res.json({ exists });
    }, delay);
  });
};

module.exports = {
  login,
  register,
  verifyToken,
  checkUsername
};
