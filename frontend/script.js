/* =========================================================
   CyberSafe – home page scripts
   1. "Would you fall for this message?" phishing demo
   2. Password strength checker (runs fully in the browser)
   ========================================================= */

/* ---------- 1. Phishing demo ---------- */

const messages = [
  {
    sender: 'VM-BKKYC',
    html:
      'Dear customer, your KYC has expired. ' +
      '<mark>Your account will be blocked today.</mark> ' +
      'Update now: <mark>http://kyc-update-bank.in.net/login</mark>',
    phishing: true,
    explain: 'This is phishing.',
    flags: [
      'Fake urgency: "blocked today" is meant to make you panic.',
      'The link is not your bank\'s real website, it only looks similar.',
      'Banks do not ask you to update KYC through a link in an SMS.'
    ]
  },
  {
    sender: 'AX-LOGIN',
    html:
      '123456 is your OTP to log in. Valid for 10 minutes. ' +
      '<mark class="good">Never share this code with anyone, including bank staff.</mark>',
    phishing: false,
    explain: 'This looks safe, as long as you just tried to log in.',
    flags: [
      'You started this action yourself, so the OTP is expected.',
      'There is no link and no request to reply or call.',
      'It warns you not to share the code. Never read it out to anyone.'
    ]
  },
  {
    sender: '+91 98XXXXXX21',
    html:
      'Congratulations! You won <mark>Rs 25,000 in the UPI lucky draw.</mark> ' +
      'Claim your prize: <mark>bit.ly/upi-win25</mark>',
    phishing: true,
    explain: 'This is phishing.',
    flags: [
      'You never entered a lucky draw, so there is no prize.',
      'A shortened link hides where it really takes you.',
      'You never enter a UPI PIN to receive money. A "claim" that asks for one is a scam.'
    ]
  }
];

const $ = (id) => document.getElementById(id);

const el = {
  sender: $('sender'),
  msg: $('msg'),
  bubble: $('bubble'),
  score: $('score'),
  answers: $('answers'),
  result: $('result'),
  verdict: $('verdict'),
  flags: $('flags'),
  next: $('next')
};

let index = 0;
let score = 0;
let answered = false;
let finished = false;

function updateScore() {
  el.score.textContent = score + ' of ' + messages.length + ' correct';
}

function playBubbleAnimation() {
  el.bubble.classList.remove('pop');
  void el.bubble.offsetWidth; // restart the animation
  el.bubble.classList.add('pop');
}

function showMessage() {
  const m = messages[index];
  answered = false;
  finished = false;

  el.sender.textContent = m.sender;
  el.msg.innerHTML = m.html;
  el.bubble.classList.remove('revealed');
  playBubbleAnimation();

  el.answers.hidden = false;
  el.result.hidden = true;
  updateScore();
}

function fillFlags(list, colourClass) {
  el.flags.innerHTML = '';
  el.flags.className = 'flags ' + colourClass;
  list.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    el.flags.appendChild(li);
  });
}

function showSummary() {
  finished = true;
  el.sender.textContent = 'Your result';

  const line =
    score === messages.length
      ? 'Sharp eyes. Scammers would struggle to fool you.'
      : 'Good start. The Phishing lesson shows how to catch the ones you missed.';

  el.msg.innerHTML = '<strong>' + score + ' of ' + messages.length + ' correct.</strong> ' + line;
  el.bubble.classList.remove('revealed');
  playBubbleAnimation();

  el.answers.hidden = true;
  el.verdict.textContent = '';
  el.verdict.className = 'verdict';
  el.flags.innerHTML = '';
  el.next.textContent = 'Play again';
  el.result.hidden = false;
}

el.answers.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-answer]');
  if (!button || answered) return;

  answered = true;
  const m = messages[index];
  const guessedPhish = button.dataset.answer === 'phish';
  const correct = guessedPhish === m.phishing;
  if (correct) score++;

  el.bubble.classList.add('revealed');
  el.verdict.className = 'verdict ' + (correct ? 'ok' : 'bad');
  el.verdict.textContent = (correct ? 'Correct. ' : 'Not quite. ') + m.explain;
  fillFlags(m.flags, m.phishing ? 'red' : 'green');

  el.next.textContent = index === messages.length - 1 ? 'See my score' : 'Next message';
  el.answers.hidden = true;
  el.result.hidden = false;
  updateScore();
});

el.next.addEventListener('click', () => {
  if (finished) {
    index = 0;
    score = 0;
    showMessage();
    return;
  }

  index++;
  if (index >= messages.length) {
    showSummary();
  } else {
    showMessage();
  }
});

showMessage();

/* ---------- 2. Password strength checker ---------- */

const pw = $('pw');
const pwToggle = $('pwToggle');
const meter = $('meter');
const meterLabel = $('meterLabel');
const checklistItems = document.querySelectorAll('#checklist li');
const bars = meter.querySelectorAll('span');

const rules = {
  len: (v) => v.length >= 12,
  case: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  num: (v) => /\d/.test(v),
  sym: (v) => /[^A-Za-z0-9]/.test(v)
};

const commonWords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 'iloveyou'];
const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

function checkPassword() {
  const value = pw.value;
  let met = 0;

  checklistItems.forEach((item) => {
    const passed = rules[item.dataset.rule](value);
    item.classList.toggle('met', passed);
    if (passed) met++;
  });

  let level = 0;
  let note = '';

  if (value.length > 0) {
    level = Math.max(1, met);

    if (value.length < 8) {
      level = 1;
      note = ' Use at least 8 characters.';
    }

    const lower = value.toLowerCase();
    if (commonWords.some((word) => lower.includes(word))) {
      level = 1;
      note = ' It contains a very common word that attackers try first.';
    }
  }

  meter.dataset.level = level;
  bars.forEach((bar, i) => bar.classList.toggle('on', i < level));

  meterLabel.textContent =
    level === 0 ? 'Start typing to see your result.' : labels[level] + '.' + note;
}

pw.addEventListener('input', checkPassword);

pwToggle.addEventListener('click', () => {
  const showing = pw.type === 'text';
  pw.type = showing ? 'password' : 'text';
  pwToggle.textContent = showing ? 'Show' : 'Hide';
  pwToggle.setAttribute('aria-pressed', String(!showing));
});

  /* ---------- 3. Module navigation + lessons ---------- */

const views = {
  home: document.querySelectorAll('.hero, #modules'),
  threats: document.querySelectorAll('#threats'),
  how: document.querySelectorAll('#how'),
  quiz: document.querySelectorAll('#quiz'),
  account: document.querySelectorAll('#account'),
  tools: document.querySelectorAll('#tools'),
  help: document.querySelectorAll('#help')
};

/* Lesson page: created here, filled when a lesson is opened */
const lessonSection = document.createElement('section');
lessonSection.className = 'section wrap lesson';
lessonSection.hidden = true;
document.querySelector('main').appendChild(lessonSection);

/* Point every "Read the lesson" link to the lesson page */
document.querySelectorAll('a.read').forEach((link) => {
  const topic = new URL(link.href).searchParams.get('topic');
  link.setAttribute('href', '#lesson/' + topic);
});

/* Back link under the header */
const backBar = document.createElement('div');
backBar.className = 'wrap back-bar';
backBar.innerHTML = '<a class="back" href="#home">Back to home</a>';
document.querySelector('.site-header').after(backBar);
const backLink = backBar.querySelector('a');

const navLinks = document.querySelectorAll('.nav-links a');

function listHtml(items) {
  return '<ul class="lesson-list">' + items.map((t) => '<li>' + t + '</li>').join('') + '</ul>';
}

function renderLesson(key) {
  const l = lessons[key];
  const i = lessonOrder.indexOf(key);
  const nextKey = lessonOrder[(i + 1) % lessonOrder.length];

  lessonSection.innerHTML =
    '<div class="lesson-head">' +
      '<span class="lesson-tag">' + l.tag + '</span>' +
      '<h2>' + l.title + '</h2>' +
    '</div>' +
    '<div class="lesson-body">' +
      '<div class="lesson-block"><h3>What is it?</h3><p>' + l.what + '</p></div>' +
      '<div class="lesson-block example"><h3>Real-life example</h3><p>' + l.example + '</p></div>' +
      '<div class="lesson-block spot"><h3>How to spot it</h3>' + listHtml(l.signs) + '</div>' +
      '<div class="lesson-block protect"><h3>How to protect yourself</h3>' + listHtml(l.protect) + '</div>' +
      '<div class="lesson-block recover"><h3>If it happens to you</h3>' + listHtml(l.recover) + '</div>' +
      '<p class="remember">' + l.remember + '</p>' +
    '</div>' +
    '<div class="lesson-nav">' +
      '<a class="btn btn-ghost" href="#lesson/' + nextKey + '">Next lesson: ' + lessons[nextKey].title + '</a>' +
      '<a class="btn btn-primary" href="#quiz">Take the quiz</a>' +
    '</div>';
}

function showView() {
  const hash = location.hash.replace('#', '');
  let current = 'home';
  let lessonKey = null;

  if (hash.startsWith('lesson/') && lessons[hash.slice(7)]) {
    current = 'lesson';
    lessonKey = hash.slice(7);
  } else if (hash === 'login' || hash === 'register') {
    current = 'account';
  } else if (views[hash]) {
    current = hash;
  }

  Object.keys(views).forEach((key) => {
    views[key].forEach((section) => {
      section.hidden = key !== current;
    });
  });

  lessonSection.hidden = current !== 'lesson';
  if (lessonKey) renderLesson(lessonKey);

  backBar.hidden = current === 'home';
  backLink.textContent = current === 'lesson' ? 'Back to lessons' : 'Back to home';
  backLink.setAttribute('href', current === 'lesson' ? '#threats' : '#home');

  const activeName = current === 'lesson' ? 'threats' : current;
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + activeName);
  });

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', showView);
showView();