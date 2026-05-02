const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const router = express.Router();

// ── Register ─────────────────────────────────────────────
router.post('/register', (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    if (!username || !password || !displayName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be 3-20 characters' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    // Check if username exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const colors = ['#ff6b6b', '#ffa500', '#ffff00', '#00ff00', '#0088ff', '#9b59b6', '#e91e63'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const result = db.prepare(
      'INSERT INTO users (username, password, display_name, avatar_color) VALUES (?, ?, ?, ?)'
    ).run(username.toLowerCase(), hashedPassword, displayName, avatarColor);

    const user = {
      id: result.lastInsertRowid,
      username: username.toLowerCase(),
      displayName,
      avatarColor
    };

    req.session.user = user;
    res.json({ success: true, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Login ────────────────────────────────────────────────
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username.toLowerCase());
    if (!row) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (!bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = {
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      avatarColor: row.avatar_color
    };

    req.session.user = user;
    res.json({ success: true, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Logout ───────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ── Get current user ─────────────────────────────────────
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.json({ user: null });
  }
  res.json({ user: req.session.user });
});

module.exports = router;
