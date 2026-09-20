/* =========================================================
   CyberSafe – log in, sign up and session
   Talks to the backend at API (change it if your port differs)
   ========================================================= */

const API = 'http://localhost:5000/api';

const accountSection = document.getElementById('account');
const navCta = document.querySelector('.nav-cta');

/* ---------- Session (kept in the browser) ---------- */

function getSession() {
  try {
    const raw = localStorage.getItem('cybersafe_session');
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function saveSession(data) {
  localStorage.setItem('cybersafe_session', JSON.stringify({ token: data.token, user: data.user }));
}

function clearSession() {
  localStorage.removeItem('cybersafe_session');
}

/* ---------- Header buttons: Log in / Sign up, or Hi + Log out ---------- */

function renderNav() {
  const session = getSession();
  navCta.innerHTML = '';

  if (session) {
    const hello = document.createElement('span');
    hello.className = 'nav-hello';
    hello.textContent = 'Hi, ' + session.user.name; // textContent keeps names from running as code

    const logout = document.createElement('button');
    logout.className = 'btn btn-ghost logout';
    logout.type = 'button';
    logout.textContent = 'Log out';
    logout.addEventListener('click', () => {
      clearSession();
      renderNav();
      location.hash = '#home';
    });

    navCta.append(hello, logout);
  } else {
    navCta.innerHTML =
      '<a class="btn btn-ghost" href="#login">Log in</a>' +
      '<a class="btn btn-primary" href="#register">Sign up</a>';
  }
}

/* If the saved token has expired, log the user out */
async function verifySession() {
  const session = getSession();
  if (!session) return;

  try {
    const res = await fetch(API + '/auth/me', {
      headers: { Authorization: 'Bearer ' + session.token }
    });
    if (res.status === 401) clearSession();
  } catch (err) {
    /* server is offline: keep the session for now */
  }
  renderNav();
}

/* ---------- Log in / Sign up form ---------- */

function renderForm(mode) {
  const isLogin = mode === 'login';

  accountSection.innerHTML =
    '<div class="auth-card">' +
      '<h2>' + (isLogin ? 'Log in' : 'Create your account') + '</h2>' +
      '<p class="auth-sub">' +
        (isLogin ? 'Welcome back. Log in to save your quiz results.' : 'Sign up to save your quiz scores and track your progress.') +
      '</p>' +
      '<form id="authForm" novalidate>' +
        (isLogin ? '' : '<label for="fName">Name</label><input id="fName" type="text" autocomplete="name" maxlength="60">') +
        '<label for="fEmail">Email</label>' +
        '<input id="fEmail" type="email" autocomplete="email">' +
        '<label for="fPass">Password</label>' +
        '<input id="fPass" type="password" autocomplete="' + (isLogin ? 'current-password' : 'new-password') + '">' +
        (isLogin ? '' : '<p class="hint">At least 8 characters, with letters and numbers.</p>') +
        '<p class="form-error" id="formError" role="alert" hidden></p>' +
        '<button class="btn btn-primary btn-block" type="submit" id="authSubmit">' + (isLogin ? 'Log in' : 'Sign up') + '</button>' +
      '</form>' +
      '<p class="auth-switch">' +
        (isLogin ? 'New here? <a href="#register">Create an account</a>' : 'Already have an account? <a href="#login">Log in</a>') +
      '</p>' +
    '</div>';

  document.getElementById('authForm').addEventListener('submit', (event) => submitForm(event, mode));
}

async function submitForm(event, mode) {
  event.preventDefault();

  const errorBox = document.getElementById('formError');
  const button = document.getElementById('authSubmit');

  const body = {
    email: document.getElementById('fEmail').value,
    password: document.getElementById('fPass').value
  };
  if (mode === 'register') body.name = document.getElementById('fName').value;

  errorBox.hidden = true;
  button.disabled = true;

  try {
    const res = await fetch(API + '/auth/' + mode, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || 'Something went wrong.';
      errorBox.hidden = false;
      return;
    }

    saveSession(data);
    renderNav();
    location.hash = '#home';
  } catch (err) {
    errorBox.textContent = 'Cannot reach the server. Make sure the backend is running.';
    errorBox.hidden = false;
  } finally {
    button.disabled = false;
  }
}

function showAccount() {
  const hash = location.hash.replace('#', '');
  if (hash === 'login' || hash === 'register') renderForm(hash);
}

window.addEventListener('hashchange', showAccount);
showAccount();
renderNav();
verifySession();