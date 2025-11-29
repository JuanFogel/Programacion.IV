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

  // 1) RATE LIMITING POR RÁFAGA (para el test 1: ver algún 429)
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

  // 2) ESTADO PARA DELAY + CAPTCHA
  let state = failedLoginAttempts.get(ip);
  if (!state) {
    state = { failedCount: 0 };
  }

  // Si ya hubo varios intentos fallidos, exigir CAPTCHA
  if (state.failedCount >= MAX_FAILED_FOR_CAPTCHA && !captcha) {
    return res.status(400).json({
      error: 'Se requiere captcha válido para continuar'
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


const checkUsername = (req, res) => {
  const { username } = req.body;

  // VULNERABLE: SQL injection que permite inferir información
  const query = `SELECT COUNT(*) as count FROM users WHERE username = '${username}'`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const exists = results[0].count > 0;
    res.json({ exists });
  });
};

module.exports = {
  login,
  register,
  verifyToken,
  checkUsername
};
