const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://fashionbbsr.shop';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// ---- MySQL Pool ----
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'applongpass',
  database: process.env.DB_NAME || 'fashion_db',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return res.json({ ok: rows[0]?.ok === 1, db: 'up' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

function signToken(user) {
  return jwt.sign(
    { id: String(user.id), name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token, please login.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid/expired token, please login again.' });
  }
}

// --- Auth Routes (DB-backed) ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password required' });
    }
    const normEmail = String(email).toLowerCase().trim();

    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [normEmail]);
    if (exists.length > 0) {
      return res.status(409).json({ error: 'User already exists. Please login.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, normEmail, passwordHash]
    );

    return res.json({ message: 'Signup successful. Please login now.' });
  } catch (e) {
    console.error('Signup error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    const normEmail = String(email).toLowerCase().trim();

    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1',
      [normEmail]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'No account found. Please sign up.' });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid password' });

    const token = signToken({ id: user.id, name: user.name, email: user.email });
    return res.json({
      token,
      user: { id: String(user.id), name: user.name, email: user.email }
    });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// --- Protected Categories (DB-backed) ---
app.get('/api/product', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name FROM categories ORDER BY name ASC');
    const products = rows.map(r => ({ name: r.name })); // UI shape SAME
    return res.json({ products });
  } catch (e) {
    console.error('Categories error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
