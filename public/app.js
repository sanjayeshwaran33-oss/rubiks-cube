// ── State ────────────────────────────────────────────────
let currentUser = null;
let timerRunning = false;
let timerStart = 0;
let timerInterval = null;
let currentMoves = 0;

// ── DOM Refs ─────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const authModal = $('#auth-modal');
const authForm = $('#auth-form');
const authTitle = $('#auth-title');
const authDisplay = $('#auth-display');
const authUser = $('#auth-user');
const authPass = $('#auth-pass');
const authSubmit = $('#auth-submit');
const authToggle = $('#auth-toggle');
const authToggleText = $('#auth-toggle-text');
const authError = $('#auth-error');
const btnLogin = $('#btn-login');
const btnLogout = $('#btn-logout');
const userArea = $('#user-area');
const userInfo = $('#user-info');
const userName = $('#user-name');
const userAvatar = $('#user-avatar');
const timerDisplay = $('#timer-display');
const btnTimerStart = $('#btn-timer-start');
const btnTimerStop = $('#btn-timer-stop');
const timerResult = $('#timer-result');
const resultTime = $('#result-time');
const resultMoves = $('#result-moves');
const btnSaveSolve = $('#btn-save-solve');
const sidePanel = $('#side-panel');
const sideTitle = $('#side-title');
const sideContent = $('#side-content');
const btnCloseSide = $('#btn-close-side');
const btnLeaderboard = $('#btn-leaderboard');
const btnStats = $('#btn-stats');

let isSignUp = false;

// ── Auth ─────────────────────────────────────────────────
async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (data.user) { setUser(data.user); }
  } catch (e) { /* not logged in */ }
}

function setUser(user) {
  currentUser = user;
  userArea.classList.add('hidden');
  userInfo.classList.remove('hidden');
  userName.textContent = user.displayName;
  userAvatar.style.background = user.avatarColor;
  btnSaveSolve.classList.remove('hidden');
}

function clearUser() {
  currentUser = null;
  userArea.classList.remove('hidden');
  userInfo.classList.add('hidden');
  btnSaveSolve.classList.add('hidden');
}

btnLogin.addEventListener('click', () => {
  isSignUp = false;
  authTitle.textContent = 'Login';
  authSubmit.textContent = 'Login';
  authDisplay.classList.add('hidden');
  authToggleText.textContent = "Don't have an account?";
  authToggle.textContent = 'Sign Up';
  authError.classList.add('hidden');
  authModal.classList.remove('hidden');
});

authToggle.addEventListener('click', (e) => {
  e.preventDefault();
  isSignUp = !isSignUp;
  if (isSignUp) {
    authTitle.textContent = 'Sign Up';
    authSubmit.textContent = 'Create Account';
    authDisplay.classList.remove('hidden');
    authToggleText.textContent = 'Already have an account?';
    authToggle.textContent = 'Login';
  } else {
    authTitle.textContent = 'Login';
    authSubmit.textContent = 'Login';
    authDisplay.classList.add('hidden');
    authToggleText.textContent = "Don't have an account?";
    authToggle.textContent = 'Sign Up';
  }
  authError.classList.add('hidden');
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.classList.add('hidden');
  const url = isSignUp ? '/api/auth/register' : '/api/auth/login';
  const body = { username: authUser.value, password: authPass.value };
  if (isSignUp) body.displayName = authDisplay.value;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.error) {
      authError.textContent = data.error;
      authError.classList.remove('hidden');
      return;
    }
    setUser(data.user);
    authModal.classList.add('hidden');
    authForm.reset();
  } catch (err) {
    authError.textContent = 'Connection error';
    authError.classList.remove('hidden');
  }
});

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) authModal.classList.add('hidden');
});

btnLogout.addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  clearUser();
});

// ── Timer ────────────────────────────────────────────────
// Expose for cube.js to increment
window.rubiksMoveCount = 0;

btnTimerStart.addEventListener('click', () => {
  timerRunning = true;
  timerStart = performance.now();
  window.rubiksMoveCount = 0;
  timerResult.classList.add('hidden');
  btnTimerStart.classList.add('hidden');
  btnTimerStop.classList.remove('hidden');
  timerDisplay.style.color = '#00b894';
  updateTimer();
});

btnTimerStop.addEventListener('click', () => {
  timerRunning = false;
  clearInterval(timerInterval);
  btnTimerStop.classList.add('hidden');
  btnTimerStart.classList.remove('hidden');
  timerDisplay.style.color = '#fff';

  const elapsed = (performance.now() - timerStart) / 1000;
  currentMoves = window.rubiksMoveCount;
  resultTime.textContent = `⏱ ${formatTime(elapsed)}`;
  resultMoves.textContent = `${currentMoves} moves`;
  timerResult.classList.remove('hidden');

  timerResult.dataset.time = elapsed;
  timerResult.dataset.moves = currentMoves;
});

function updateTimer() {
  if (!timerRunning) return;
  const elapsed = (performance.now() - timerStart) / 1000;
  timerDisplay.textContent = formatTime(elapsed);
  timerInterval = requestAnimationFrame(updateTimer);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(2);
  return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : secs;
}

// ── Save Solve ───────────────────────────────────────────
btnSaveSolve.addEventListener('click', async () => {
  if (!currentUser) return;
  const time = parseFloat(timerResult.dataset.time);
  const moves = parseInt(timerResult.dataset.moves);

  try {
    const res = await fetch('/api/game/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solveTime: time, moves })
    });
    const data = await res.json();
    if (data.success) {
      btnSaveSolve.textContent = '✓ Saved!';
      btnSaveSolve.disabled = true;
      setTimeout(() => {
        btnSaveSolve.textContent = 'Save Solve';
        btnSaveSolve.disabled = false;
      }, 2000);
    }
  } catch (e) { console.error(e); }
});

// ── Side Panel ───────────────────────────────────────────
btnCloseSide.addEventListener('click', () => sidePanel.classList.add('hidden'));

btnLeaderboard.addEventListener('click', async () => {
  sideTitle.textContent = '🏆 Leaderboard';
  sideContent.innerHTML = '<p class="no-data">Loading...</p>';
  sidePanel.classList.remove('hidden');

  try {
    const res = await fetch('/api/game/leaderboard');
    const data = await res.json();
    if (!data.leaderboard.length) {
      sideContent.innerHTML = '<p class="no-data">No solves yet. Be the first!</p>';
      return;
    }
    sideContent.innerHTML = data.leaderboard.map((row, i) => {
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      return `<div class="lb-row fade-in">
        <span class="lb-rank ${rankClass}">#${i + 1}</span>
        <span class="lb-avatar" style="background:${row.avatar_color}"></span>
        <span class="lb-name">${esc(row.display_name)}</span>
        <span class="lb-time">${formatTime(row.best_time)}</span>
      </div>`;
    }).join('');
  } catch (e) {
    sideContent.innerHTML = '<p class="no-data">Failed to load</p>';
  }
});

btnStats.addEventListener('click', async () => {
  if (!currentUser) {
    sideTitle.textContent = '📊 My Stats';
    sideContent.innerHTML = '<p class="no-data">Login to track your solves</p>';
    sidePanel.classList.remove('hidden');
    return;
  }
  sideTitle.textContent = '📊 My Stats';
  sideContent.innerHTML = '<p class="no-data">Loading...</p>';
  sidePanel.classList.remove('hidden');

  try {
    const res = await fetch('/api/game/stats');
    const data = await res.json();
    const s = data.stats;
    let html = '<div class="stat-grid fade-in">';
    html += statCard('Best', s.bestTime ? formatTime(s.bestTime) : '—');
    html += statCard('Average', s.avgTime ? formatTime(s.avgTime) : '—');
    html += statCard('Ao5', s.ao5 ? formatTime(s.ao5) : '—');
    html += statCard('Ao12', s.ao12 ? formatTime(s.ao12) : '—');
    html += statCard('Total Solves', s.totalSolves || 0);
    html += statCard('Avg Moves', s.avgMoves ? Math.round(s.avgMoves) : '—');
    html += '</div>';

    if (data.recentSolves.length) {
      html += '<h3 style="margin:16px 0 8px;font-size:14px;color:var(--text-dim)">Recent Solves</h3>';
      html += data.recentSolves.map(s => `
        <div class="solve-row">
          <span class="solve-time">${formatTime(s.solve_time)}</span>
          <span>${s.moves} moves</span>
          <span class="solve-date">${new Date(s.solved_at).toLocaleDateString()}</span>
        </div>`).join('');
    }
    sideContent.innerHTML = html;
  } catch (e) {
    sideContent.innerHTML = '<p class="no-data">Failed to load</p>';
  }
});

function statCard(label, value) {
  return `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`;
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ── Keys Panel Toggle ────────────────────────────────────
const keysPanel = document.getElementById('keys-panel');
const btnKeys = document.getElementById('btn-keys');
btnKeys.addEventListener('click', () => keysPanel.classList.toggle('hidden'));

// ── Init ─────────────────────────────────────────────────
checkAuth();
