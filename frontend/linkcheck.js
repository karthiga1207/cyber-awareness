/* =========================================================
   CyberSafe – link checker
   Only reads the text of the link. It never opens the link.
   It gives hints, not a guarantee.
   ========================================================= */

const urlInput = document.getElementById('urlInput');
const urlCheck = document.getElementById('urlCheck');
const urlResult = document.getElementById('urlResult');

const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly', 'rb.gy', 'shorturl.at', 'ow.ly'];
const riskyEndings = ['xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'click', 'work', 'loan', 'icu', 'buzz', 'rest'];
const scamWords = ['login', 'verify', 'update', 'secure', 'account', 'kyc', 'otp', 'bank', 'wallet', 'refund', 'prize', 'reward', 'claim', 'gift', 'upi', 'suspend', 'blocked', 'password', 'confirm'];

const brands = {
  sbi: ['sbi.co.in', 'onlinesbi.sbi', 'onlinesbi.com'],
  hdfc: ['hdfcbank.com', 'hdfc.com'],
  icici: ['icicibank.com'],
  paytm: ['paytm.com'],
  phonepe: ['phonepe.com'],
  google: ['google.com', 'google.co.in', 'googleapis.com'],
  amazon: ['amazon.in', 'amazon.com', 'amazonaws.com'],
  paypal: ['paypal.com'],
  flipkart: ['flipkart.com'],
  microsoft: ['microsoft.com'],
  facebook: ['facebook.com'],
  instagram: ['instagram.com'],
  whatsapp: ['whatsapp.com']
};

function belongsTo(host, domain) {
  return host === domain || host.endsWith('.' + domain);
}

/* Returns a list of warning signs, or null if the text is not a link */
function analyse(text) {
  const findings = [];
  const add = (points, message) => findings.push({ points, text: message });

  if (/^(javascript|data|vbscript|file):/i.test(text)) {
    add(4, 'This is not a normal web link. It starts with a command word that can run code or open files on your device.');
    return findings;
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(text);
  let url;
  try {
    url = new URL(hasScheme ? text : 'https://' + text);
  } catch (err) {
    return null;
  }

  if (!/^https?:$/.test(url.protocol)) {
    add(3, 'This is not a normal web link (it starts with ' + url.protocol + ').');
    return findings;
  }

  const host = url.hostname.toLowerCase();
  if (!host.includes('.')) return null;

  if (hasScheme && url.protocol === 'http:') {
    add(2, 'It uses http, not https, so the connection is not encrypted.');
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    add(3, 'It uses a number address instead of a website name. Real companies almost never do this.');
  }
  if (shorteners.includes(host)) {
    add(2, 'It is a shortened link, so you cannot see where it really goes.');
  }
  if (url.username || url.password) {
    add(3, 'It contains an @ sign. Everything before the @ is ignored, so the real website is the part after it.');
  }
  if (host.includes('xn--')) {
    add(3, 'The address uses look-alike characters, a trick used to copy real websites.');
  }

  const ending = host.split('.').pop();
  if (riskyEndings.includes(ending)) {
    add(1, 'The ending ".' + ending + '" is cheap to register and often used in scam links.');
  }
  if (host.split('.').length >= 4) {
    add(2, 'It has many parts before the ending. Scammers stack words to make a fake address look real.');
  }
  if ((host.match(/-/g) || []).length >= 3) {
    add(1, 'It has many hyphens in the address.');
  }
  if (text.length > 75) {
    add(1, 'It is very long, which can hide the real address.');
  }

  const foundWords = scamWords.filter((w) => host.includes(w) || url.pathname.toLowerCase().includes(w));
  if (foundWords.length >= 2) {
    add(2, 'It has several words scammers like to use: ' + foundWords.slice(0, 4).join(', ') + '.');
  } else if (foundWords.length === 1) {
    add(1, 'It has the word "' + foundWords[0] + '". Check carefully that the website is genuine.');
  }

  const parts = host.split(/[.-]/);
  Object.keys(brands).forEach((brand) => {
    const mentioned = parts.some((p) => p.startsWith(brand));
    const official = brands[brand].some((d) => belongsTo(host, d));
    if (mentioned && !official) {
      add(3, 'It mentions "' + brand + '" but it is not the official ' + brand + ' website.');
    }
  });

  return findings;
}

function levelFor(findings) {
  const total = findings.reduce((sum, f) => sum + f.points, 0);
  if (total >= 4) return 'danger';
  if (total >= 1) return 'warn';
  return 'ok';
}

function showLinkResult() {
  const text = urlInput.value.trim();
  urlResult.hidden = false;
  urlResult.innerHTML = '';

  const verdict = document.createElement('p');
  const note = document.createElement('p');
  note.className = 'url-note';

  if (text === '') {
    verdict.className = 'url-verdict warn';
    verdict.textContent = 'Paste a link first.';
    urlResult.append(verdict);
    return;
  }

  const findings = analyse(text);

  if (findings === null) {
    verdict.className = 'url-verdict warn';
    verdict.textContent = 'That does not look like a link. Paste the full link, for example http://example.com/page.';
    urlResult.append(verdict);
    return;
  }

  const level = levelFor(findings);
  verdict.className = 'url-verdict ' + level;
  verdict.textContent =
    level === 'danger' ? 'Likely unsafe. Do not open this link.' :
    level === 'warn' ? 'Be careful. Check these signs before you open it.' :
    'No warning signs found.';
  urlResult.append(verdict);

  if (findings.length > 0) {
    const list = document.createElement('ul');
    list.className = 'url-findings';
    findings.forEach((f) => {
      const item = document.createElement('li');
      item.textContent = f.text; // textContent, so the pasted link can never run as code
      list.appendChild(item);
    });
    urlResult.append(list);
  }

  note.textContent =
    level === 'ok'
      ? 'This does not prove the link is safe. If the message rushed you or asked for an OTP or PIN, do not tap it.'
      : 'This check gives hints, not a guarantee. When in doubt, open the official app or website yourself.';
  urlResult.append(note);
}

urlCheck.addEventListener('click', showLinkResult);
urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') showLinkResult();
});