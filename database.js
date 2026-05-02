const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'rubikscube.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// ── Create Tables ────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_color TEXT DEFAULT '#ff6b6b',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_solves INTEGER DEFAULT 0,
    best_time REAL DEFAULT NULL
  );

  CREATE TABLE IF NOT EXISTS solves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    solve_time REAL NOT NULL,
    moves INTEGER NOT NULL,
    scramble TEXT,
    solved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS saved_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    state_data TEXT NOT NULL,
    name TEXT DEFAULT 'Untitled',
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_solves_user ON solves(user_id);
  CREATE INDEX IF NOT EXISTS idx_solves_time ON solves(solve_time);
  CREATE INDEX IF NOT EXISTS idx_saved_states_user ON saved_states(user_id);
`);

console.log('  ✅ Database initialized (rubikscube.db)');

module.exports = db;
