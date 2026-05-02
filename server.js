const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./database');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'rubiks-cube-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// ── Auth middleware helper ────────────────────────────────
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ── API Routes ───────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// ── Serve the app ────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🎲 Rubik's Cube App running at:`);
  console.log(`  ➜  Local:  http://localhost:${PORT}`);
  console.log(`  ➜  Network: http://${getLocalIP()}:${PORT}\n`);
});

function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0';
}
