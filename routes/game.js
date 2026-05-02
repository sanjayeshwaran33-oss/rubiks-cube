const express = require('express');
const db = require('../database');
const router = express.Router();

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Login required' });
  }
  next();
}

// ── Save a solve ─────────────────────────────────────────
router.post('/solve', requireAuth, (req, res) => {
  try {
    const { solveTime, moves, scramble } = req.body;
    const userId = req.session.user.id;

    if (!solveTime || !moves) {
      return res.status(400).json({ error: 'Solve time and moves required' });
    }

    db.prepare(
      'INSERT INTO solves (user_id, solve_time, moves, scramble) VALUES (?, ?, ?, ?)'
    ).run(userId, solveTime, moves, scramble || '');

    // Update user stats
    const stats = db.prepare(
      'SELECT COUNT(*) as total, MIN(solve_time) as best FROM solves WHERE user_id = ?'
    ).get(userId);

    db.prepare(
      'UPDATE users SET total_solves = ?, best_time = ? WHERE id = ?'
    ).run(stats.total, stats.best, userId);

    res.json({
      success: true,
      stats: {
        totalSolves: stats.total,
        bestTime: stats.best
      }
    });
  } catch (err) {
    console.error('Save solve error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Get personal stats ───────────────────────────────────
router.get('/stats', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.id;

    const stats = db.prepare(`
      SELECT 
        COUNT(*) as totalSolves,
        MIN(solve_time) as bestTime,
        AVG(solve_time) as avgTime,
        MAX(solve_time) as worstTime,
        AVG(moves) as avgMoves
      FROM solves WHERE user_id = ?
    `).get(userId);

    // Recent solves
    const recentSolves = db.prepare(`
      SELECT solve_time, moves, solved_at 
      FROM solves 
      WHERE user_id = ? 
      ORDER BY solved_at DESC 
      LIMIT 20
    `).all(userId);

    // Last 5 average (ao5)
    const last5 = db.prepare(`
      SELECT solve_time FROM solves 
      WHERE user_id = ? 
      ORDER BY solved_at DESC 
      LIMIT 5
    `).all(userId);

    let ao5 = null;
    if (last5.length === 5) {
      ao5 = last5.reduce((sum, s) => sum + s.solve_time, 0) / 5;
    }

    // Last 12 average (ao12)
    const last12 = db.prepare(`
      SELECT solve_time FROM solves 
      WHERE user_id = ? 
      ORDER BY solved_at DESC 
      LIMIT 12
    `).all(userId);

    let ao12 = null;
    if (last12.length === 12) {
      ao12 = last12.reduce((sum, s) => sum + s.solve_time, 0) / 12;
    }

    res.json({
      stats: {
        ...stats,
        ao5,
        ao12
      },
      recentSolves
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Leaderboard ──────────────────────────────────────────
router.get('/leaderboard', (req, res) => {
  try {
    const leaderboard = db.prepare(`
      SELECT 
        u.display_name,
        u.avatar_color,
        u.best_time,
        u.total_solves,
        (SELECT AVG(s.solve_time) FROM solves s WHERE s.user_id = u.id) as avg_time
      FROM users u
      WHERE u.best_time IS NOT NULL
      ORDER BY u.best_time ASC
      LIMIT 50
    `).all();

    res.json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Save cube state ──────────────────────────────────────
router.post('/save-state', requireAuth, (req, res) => {
  try {
    const { stateData, name } = req.body;
    const userId = req.session.user.id;

    db.prepare(
      'INSERT INTO saved_states (user_id, state_data, name) VALUES (?, ?, ?)'
    ).run(userId, JSON.stringify(stateData), name || 'Untitled');

    res.json({ success: true });
  } catch (err) {
    console.error('Save state error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Load saved states ────────────────────────────────────
router.get('/saved-states', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.id;
    const states = db.prepare(
      'SELECT id, name, saved_at FROM saved_states WHERE user_id = ? ORDER BY saved_at DESC LIMIT 10'
    ).all(userId);

    res.json({ states });
  } catch (err) {
    console.error('Load states error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/saved-states/:id', requireAuth, (req, res) => {
  try {
    const userId = req.session.user.id;
    const state = db.prepare(
      'SELECT * FROM saved_states WHERE id = ? AND user_id = ?'
    ).get(req.params.id, userId);

    if (!state) return res.status(404).json({ error: 'Not found' });
    res.json({ state: { ...state, state_data: JSON.parse(state.state_data) } });
  } catch (err) {
    console.error('Load state error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
