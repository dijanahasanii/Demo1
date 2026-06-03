const TOKEN_KEY = 'securebank_demo_token';

const loginPanel = document.getElementById('login-panel');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const statusEl = document.getElementById('status');

function showError(message) {
  loginError.textContent = message;
  loginError.hidden = !message;
}

function setLoggedIn(user) {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  document.getElementById('profile-user').textContent = user.username;
  document.getElementById('profile-role').textContent = user.role;
  document.getElementById('profile-id').textContent = String(user.id);
}

function setLoggedOut() {
  localStorage.removeItem(TOKEN_KEY);
  loginPanel.hidden = false;
  dashboard.hidden = true;
  showError('');
}

async function fetchMe(token) {
  const res = await fetch('/api/users/me', {
    headers: { Authorization: 'Bearer ' + token },
  });
  if (!res.ok) throw new Error('Session expired');
  return res.json();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  showError('');
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      showError(data.error || 'Login failed');
      return;
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    setLoggedIn(data.user);
  } catch (err) {
    showError('Could not reach API. Is the server running?');
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  setLoggedOut();
});

async function init() {
  try {
    const info = await fetch('/api/info');
    if (info.ok) {
      statusEl.textContent = 'API online';
      statusEl.className = 'ok';
    }
  } catch (err) {
    statusEl.textContent = 'API offline';
    statusEl.className = 'err';
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return;

  try {
    const user = await fetchMe(token);
    setLoggedIn(user);
  } catch (err) {
    setLoggedOut();
  }
}

init();
