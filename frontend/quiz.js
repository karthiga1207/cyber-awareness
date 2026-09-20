/* =========================================================
   CyberSafe – quiz
   12 questions (2 per topic). Add or edit questions below.
   "topic" must match a lesson key, "answer" is the index
   (starting from 0) of the correct option.
   ========================================================= */

const quizQuestions = [
  {
    topic: 'phishing',
    q: `You get an SMS saying your bank account will be blocked today unless you update your KYC through a link. What should you do?`,
    options: [
      `Tap the link and update your KYC quickly`,
      `Reply with your account number to confirm`,
      `Ignore the link and check with your bank through its official app or number`,
      `Forward the message to friends along with the link`
    ],
    answer: 2,
    why: `Real banks do not ask you to update KYC through a link in an SMS. Use the official app, or the number printed on your card.`
  },
  {
    topic: 'phishing',
    q: `Which of these is the strongest sign that an email is phishing?`,
    options: [
      `It greets you by your full name`,
      `It pushes you to act within an hour and asks for your password through a link`,
      `It comes from a company you have used before`,
      `It has the company's logo`
    ],
    answer: 1,
    why: `Urgency, plus a request for your password through a link, is the classic phishing pattern. Logos and names are easy to copy.`
  },
  {
    topic: 'upi-fraud',
    q: `When do you need to enter your UPI PIN?`,
    options: [
      `To receive money from a buyer`,
      `To check who sent a collect request`,
      `To claim a refund`,
      `Only when you are sending money`
    ],
    answer: 3,
    why: `Your PIN is only for sending money. If anyone asks for it to receive money, it is a scam.`
  },
  {
    topic: 'upi-fraud',
    q: `A "buyer" for your old phone sends a collect request and asks you to approve it to receive the advance. What is happening?`,
    options: [
      `It is a scam: approving the request sends money out of your account`,
      `It is the normal way to receive an advance`,
      `It is a bank verification step`,
      `It is a cashback offer`
    ],
    answer: 0,
    why: `A collect request takes money out of your account. Entering your PIN approves the payment.`
  },
  {
    topic: 'malware',
    q: `Which is the safest place to get an app for your phone?`,
    options: [
      `A link shared in a WhatsApp group`,
      `The official app store`,
      `A website offering a free cracked version`,
      `A pop-up ad that says your phone is slow`
    ],
    answer: 1,
    why: `Official stores check apps before they are listed. Shared links, cracked versions and pop-up ads are common ways to spread malware.`
  },
  {
    topic: 'malware',
    q: `Your laptop suddenly becomes slow, shows pop-up ads and has programs you do not remember installing. What is the best first step?`,
    options: [
      `Ignore it, it will settle down`,
      `Share your passwords with the "support" pop-up`,
      `Disconnect from the internet and run a full antivirus scan`,
      `Install the free cleaner advertised in the pop-up`
    ],
    answer: 2,
    why: `These are signs of malware. Disconnect first, then scan. "Free cleaner" pop-ups are often malware themselves.`
  },
  {
    topic: 'password-attacks',
    q: `Which password is the hardest to break?`,
    options: [
      `Rahul@123`,
      `Password2026`,
      `qwerty12345`,
      `chai-lamp-river-orange-83`
    ],
    answer: 3,
    why: `A long passphrase of random words is far harder to guess than a short password with a symbol. Names and simple patterns are tried first.`
  },
  {
    topic: 'password-attacks',
    q: `You use the same password on a shopping site and on your email. The shopping site is breached. What is the risk?`,
    options: [
      `Attackers may try the same password on your email and other sites`,
      `Nothing, one site has nothing to do with the other`,
      `Only your shopping account is at risk`,
      `Your email will change its password automatically`
    ],
    answer: 0,
    why: `Attackers reuse leaked passwords on other sites. This is why every important account needs its own password.`
  },
  {
    topic: 'ransomware',
    q: `What is the best protection against losing your files to ransomware?`,
    options: [
      `Pay the ransom quickly`,
      `Regular backups stored separately from your computer`,
      `Rename your important files`,
      `Turn off system updates`
    ],
    answer: 1,
    why: `With a separate backup you can restore your files without paying anyone.`
  },
  {
    topic: 'ransomware',
    q: `Your files are locked and a message demands payment. What should you do first?`,
    options: [
      `Pay straight away to get the files back`,
      `Restart the computer again and again`,
      `Email the attacker to negotiate`,
      `Disconnect from the network, do not pay, and restore from a backup`
    ],
    answer: 3,
    why: `Disconnecting stops it spreading. Paying does not guarantee you get your files back, and it encourages attackers.`
  },
  {
    topic: 'public-wifi',
    q: `You are at a railway station and need to make a UPI payment. A network called "Free_Station_WiFi" is available. What is the best choice?`,
    options: [
      `Connect to it and make the payment`,
      `Use your own mobile data for the payment`,
      `Connect, pay, and change your password later`,
      `Ask a stranger to share their phone hotspot`
    ],
    answer: 1,
    why: `Public Wi-Fi can be fake or watched. Use your own mobile data for payments.`
  },
  {
    topic: 'public-wifi',
    q: `Which of these is a warning sign on a public Wi-Fi network?`,
    options: [
      `Staff told you the exact network name`,
      `The website shows the HTTPS padlock`,
      `The Wi-Fi login page asks for your bank details or an OTP`,
      `The network needs a password from the staff`
    ],
    answer: 2,
    why: `A Wi-Fi login page has no reason to ask for bank details or an OTP. Leave that network.`
  }
];

const levels = [
  {
    name: 'Beginner',
    min: 0,
    range: '0 to 5 correct',
    text: `You know the basics, but a convincing message can still fool you. Go through the lessons, then try the quiz again.`
  },
  {
    name: 'Intermediate',
    min: 6,
    range: '6 to 9 correct',
    text: `You spot most common scams. Revisit the topics below to close the gaps.`
  },
  {
    name: 'Aware',
    min: 10,
    range: '10 to 12 correct',
    text: `You recognise threats quickly and know how to respond. Keep it up, and help your friends and family stay safe too.`
  }
];

 const quizSection = document.getElementById('quiz');

let order = [];
let qIndex = 0;
let correctCount = 0;
let missed = {};
let locked = false;

function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Saved results (needs the backend and a login) ---------- */

async function loadHistory() {
  const session = getSession();
  if (!session) return null;

  try {
    const res = await fetch(API + '/results/mine', {
      headers: { Authorization: 'Bearer ' + session.token }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results;
  } catch (err) {
    return null;
  }
}

async function saveResult(score, total, weakTopics) {
  const session = getSession();
  if (!session) return 'guest';

  try {
    const res = await fetch(API + '/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session.token
      },
      body: JSON.stringify({ score, total, weakTopics })
    });
    return res.ok ? 'saved' : 'failed';
  } catch (err) {
    return 'failed';
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function fillHistory() {
  const box = document.getElementById('history');
  if (!box) return;

  if (!getSession()) {
    box.innerHTML = '<p class="history-note"><a href="#login">Log in</a> to save your results and see your progress here.</p>';
    return;
  }

  const results = await loadHistory();
  const boxNow = document.getElementById('history');
  if (!boxNow || !results || results.length === 0) return;

  const title = document.createElement('h3');
  title.textContent = 'Your previous results';

  const list = document.createElement('ul');
  list.className = 'history-list';

  results.forEach((r) => {
    const item = document.createElement('li');

    const date = document.createElement('span');
    date.textContent = formatDate(r.date);

    const level = document.createElement('strong');
    level.textContent = r.level;

    const score = document.createElement('span');
    score.textContent = r.score + ' of ' + r.total;

    item.append(date, level, score);
    list.appendChild(item);
  });

  boxNow.append(title, list);
}

/* ---------- Quiz screens ---------- */

function renderStart() {
  quizSection.innerHTML =
    '<div class="quiz-card">' +
      '<h2>Find your cyber awareness level</h2>' +
      '<p class="quiz-intro">' + quizQuestions.length + ' questions across the six threats. After every answer you see the reason, and at the end you get your level.</p>' +
      '<ul class="level-list">' +
        levels.map((l) => '<li><strong>' + l.name + '</strong><span>' + l.range + '</span></li>').join('') +
      '</ul>' +
      '<button class="btn btn-primary btn-lg" type="button" data-action="start">Start the quiz</button>' +
      '<div class="history" id="history"></div>' +
    '</div>';

  fillHistory();
}

function startQuiz() {
  order = shuffle(quizQuestions.map((_, i) => i));
  qIndex = 0;
  correctCount = 0;
  missed = {};
  renderQuestion();
}

function renderQuestion() {
  const q = quizQuestions[order[qIndex]];
  locked = false;

  quizSection.innerHTML =
    '<div class="quiz-card">' +
      '<div class="quiz-progress">' +
        '<span>Question ' + (qIndex + 1) + ' of ' + order.length + '</span>' +
        '<span class="quiz-topic">' + lessons[q.topic].title + '</span>' +
      '</div>' +
      '<div class="quiz-bar"><span style="width:' + (qIndex / order.length * 100) + '%"></span></div>' +
      '<h2 class="quiz-q">' + q.q + '</h2>' +
      '<div class="quiz-options">' +
        q.options.map((o, i) => '<button class="quiz-option" type="button" data-option="' + i + '">' + o + '</button>').join('') +
      '</div>' +
      '<div class="quiz-feedback" id="quizFeedback" aria-live="polite" hidden></div>' +
    '</div>';
}

function answerQuestion(choice) {
  if (locked) return;
  locked = true;

  const q = quizQuestions[order[qIndex]];
  const right = choice === q.answer;

  quizSection.querySelectorAll('.quiz-option').forEach((button, i) => {
    button.disabled = true;
    if (i === q.answer) button.classList.add('correct');
    else if (i === choice) button.classList.add('wrong');
  });

  if (right) {
    correctCount++;
  } else {
    missed[q.topic] = (missed[q.topic] || 0) + 1;
  }

  const feedback = document.getElementById('quizFeedback');
  feedback.hidden = false;
  feedback.innerHTML =
    '<p class="quiz-verdict ' + (right ? 'ok' : 'bad') + '">' + (right ? 'Correct.' : 'Not quite.') + '</p>' +
    '<p>' + q.why + '</p>' +
    '<button class="btn btn-primary" type="button" data-action="next">' +
      (qIndex === order.length - 1 ? 'See my result' : 'Next question') +
    '</button>';
  feedback.querySelector('button').focus();
}

function renderResult() {
  const level = levels.slice().reverse().find((l) => correctCount >= l.min);
  const weak = Object.keys(missed);

  quizSection.innerHTML =
    '<div class="quiz-card quiz-result">' +
      '<p class="quiz-topic">Your cyber awareness level</p>' +
      '<h2 class="level-name">' + level.name + '</h2>' +
      '<p class="quiz-score">' + correctCount + ' of ' + order.length + ' correct</p>' +
      '<p>' + level.text + '</p>' +
      '<p class="save-status" id="saveStatus">Saving your result...</p>' +
      (weak.length
        ? '<h3>Worth revisiting</h3><ul class="revisit">' +
            weak.map((k) => '<li><a href="#lesson/' + k + '">' + lessons[k].title + '</a><span>' + missed[k] + ' missed</span></li>').join('') +
          '</ul>'
        : '<p class="quiz-verdict ok">No mistakes. Well done.</p>') +
      '<div class="lesson-nav">' +
        '<button class="btn btn-primary" type="button" data-action="start">Retake the quiz</button>' +
        '<a class="btn btn-ghost" href="#threats">Back to lessons</a>' +
      '</div>' +
    '</div>';

  saveResult(correctCount, order.length, weak).then((status) => {
    const line = document.getElementById('saveStatus');
    if (!line) return;

    if (status === 'saved') {
      line.textContent = 'Result saved to your account.';
    } else if (status === 'guest') {
      line.innerHTML = '<a href="#login">Log in</a> to save your results.';
    } else {
      line.textContent = 'Could not save this result. Check that the backend is running.';
    }
  });
}

function nextQuestion() {
  qIndex++;
  if (qIndex >= order.length) {
    renderResult();
  } else {
    renderQuestion();
  }
  window.scrollTo(0, 0);
}

quizSection.addEventListener('click', (event) => {
  const option = event.target.closest('[data-option]');
  if (option) {
    answerQuestion(Number(option.dataset.option));
    return;
  }

  const action = event.target.closest('[data-action]');
  if (!action) return;

  if (action.dataset.action === 'start') startQuiz();
  if (action.dataset.action === 'next') nextQuestion();
});

window.addEventListener('hashchange', () => {
  if (location.hash === '#quiz') renderStart();
});

if (location.hash === '#quiz') renderStart();