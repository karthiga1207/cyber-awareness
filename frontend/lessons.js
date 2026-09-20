/* =========================================================
   CyberSafe – lesson content
   Add or edit a lesson here. The key must match the
   topic name used in the links (e.g. #lesson/phishing).
   ========================================================= */

const lessonOrder = ['phishing', 'upi-fraud', 'malware', 'password-attacks', 'ransomware', 'public-wifi'];

const lessons = {

  'phishing': {
    title: 'Phishing',
    tag: 'Email, SMS and calls',
    what: `Phishing is when an attacker pretends to be someone you trust, such as your bank, a delivery company or your college office, to make you share private information or click a harmful link. It arrives by email, SMS, WhatsApp or a phone call.`,
    example: `You get an SMS: "Your account will be blocked today. Update KYC now: http://bank-kyc-update.xyz". The link opens a page that looks exactly like your bank's login. You enter your username, password and OTP, and the attacker uses them to move money out of your account.`,
    signs: [
      `It creates panic or a deadline: "blocked today", "act within 1 hour".`,
      `The link or sender address is slightly wrong: extra words, spelling changes or odd endings like .xyz.`,
      `It asks for your OTP, PIN, password or card details.`,
      `It starts with "Dear customer" instead of your name.`,
      `It has spelling mistakes or an attachment you were not expecting.`
    ],
    protect: [
      `Do not tap links in unexpected messages. Open your bank's app or type the website address yourself.`,
      `Never share an OTP, PIN or CVV with anyone. Real banks never ask for them.`,
      `Check the full sender address, not just the display name.`,
      `If unsure, call the official number printed on your card or on the official website.`,
      `Turn on two-step verification for your important accounts.`
    ],
    recover: [
      `Change the password of the affected account immediately.`,
      `Call your bank to block the card or account if money is at risk.`,
      `Report it on the helpline 1930 or at cybercrime.gov.in.`
    ],
    remember: `Stop. Do not click. Check through the official app or number.`
  },

  'upi-fraud': {
    title: 'UPI and online fraud',
    tag: 'Payments',
    what: `UPI fraud happens when a scammer tricks you into approving a payment or sharing your UPI PIN. The most important rule: you enter your UPI PIN only to send money, never to receive it.`,
    example: `You put an old phone up for sale online. A "buyer" says they will pay in advance, then sends you a collect request and says, "Just enter your PIN to receive the money." The moment you enter the PIN, money leaves your account instead of arriving.`,
    signs: [
      `Anyone asks you to enter your PIN to receive money.`,
      `A collect request arrives from someone you do not know.`,
      `You are asked to install a screen-sharing app such as AnyDesk or TeamViewer.`,
      `You found a "customer care" number through a search result or a pop-up.`,
      `You are pushed to act quickly, or told to scan a QR code to receive a refund.`
    ],
    protect: [
      `Never enter your UPI PIN to receive money.`,
      `Read the payee name and amount on the screen before you approve any payment.`,
      `Decline collect requests from people you do not know.`,
      `Get customer care numbers only from the official app or website.`,
      `Never install a screen-sharing app because a stranger asked you to.`
    ],
    recover: [
      `Call 1930 immediately. The sooner you report, the better the chance of stopping the money.`,
      `Inform your bank and ask them to block further transactions.`,
      `File a complaint at cybercrime.gov.in and keep screenshots as proof.`
    ],
    remember: `Your PIN is only for paying. Never for receiving.`
  },

  'malware': {
    title: 'Malware',
    tag: 'Apps and files',
    what: `Malware is harmful software made to steal your data, spy on you or damage your device. Viruses, spyware, trojans and adware are all kinds of malware. It usually gets in when you install something you should not have.`,
    example: `A student downloads a "free" cracked copy of a paid video editor from a random website. The installer works, but it also installs spyware that records keystrokes and sends saved passwords to the attacker.`,
    signs: [
      `Your device suddenly becomes slow or hot.`,
      `Pop-up ads appear even when no browser is open.`,
      `Apps you never installed show up.`,
      `Battery drains fast or mobile data usage jumps.`,
      `Your browser homepage changes on its own, or your antivirus turns itself off.`
    ],
    protect: [
      `Install apps only from official stores and official websites.`,
      `Avoid cracked software and pirated apps or movies.`,
      `Keep your phone, computer and apps updated.`,
      `Use Windows Security or a trusted antivirus and scan regularly.`,
      `Do not open attachments you were not expecting, and check the permissions an app asks for.`
    ],
    recover: [
      `Disconnect the device from the internet.`,
      `Run a full antivirus scan and uninstall anything you do not recognise.`,
      `Change your passwords, but do it from a clean device.`
    ],
    remember: `If a paid app is offered free on an unknown site, your data is the price.`
  },

  'password-attacks': {
    title: 'Password attacks',
    tag: 'Accounts',
    what: `A password attack is an attempt to get into your account. Attackers may try thousands of guesses (brute force), try common words (dictionary attack), or reuse passwords leaked from other websites (credential stuffing).`,
    example: `Someone uses the same password, "Rahul@123", on a shopping site and on their email. The shopping site is breached and the password leaks. Attackers try the same email and password on other sites, and the email account opens.`,
    signs: [
      `Login alerts from a device or place you do not recognise.`,
      `Password reset emails that you did not request.`,
      `Friends receive strange messages from your account.`,
      `You are suddenly logged out, or your password stops working.`
    ],
    protect: [
      `Use a long password of 12 or more characters. A passphrase of several random words works well.`,
      `Use a different password for every important account.`,
      `Use a password manager so you do not have to remember them all.`,
      `Turn on two-step verification wherever it is offered.`,
      `Avoid your name, birth year or phone number in passwords, and never share them.`
    ],
    recover: [
      `Change the password right away and log out of all other devices.`,
      `Turn on two-step verification.`,
      `Check that your recovery email and phone number have not been changed.`
    ],
    remember: `One account, one password. Longer beats complicated. Try the password checker in Tools.`
  },

  'ransomware': {
    title: 'Ransomware',
    tag: 'Devices',
    what: `Ransomware is malware that locks or encrypts your files and demands money to unlock them. It often arrives through a phishing email attachment or a fake download.`,
    example: `An employee opens an email attachment named "Invoice.docm". Within minutes the files on the computer and the shared drive get strange extensions, and a message appears demanding payment to get them back.`,
    signs: [
      `Your files will not open and have strange new extensions.`,
      `A ransom note appears on the screen or the desktop.`,
      `The screen is locked with a payment demand.`,
      `It started right after you opened an attachment or ran a download.`
    ],
    protect: [
      `Keep regular backups on an external drive or in the cloud. Disconnect the drive after backing up.`,
      `Keep your system and apps updated.`,
      `Do not enable macros in documents from unknown senders.`,
      `Do not open attachments you were not expecting.`,
      `Use security software and keep it switched on.`
    ],
    recover: [
      `Disconnect from the network straight away so it cannot spread.`,
      `Do not pay. There is no guarantee you will get your files back, and it encourages attackers.`,
      `Restore your files from a backup and report the attack at cybercrime.gov.in.`
    ],
    remember: `A good backup turns a disaster into an inconvenience.`
  },

  'public-wifi': {
    title: 'Public Wi-Fi risks',
    tag: 'Networks',
    what: `Public Wi-Fi in cafés, railway stations, malls and campuses is often open, and shared with many strangers. Attackers can watch unprotected traffic or set up a fake hotspot with a familiar name.`,
    example: `At a railway station you connect to a network called "Free_Station_WiFi". It was actually set up by an attacker. When you log in to a website, the attacker captures the details you type.`,
    signs: [
      `A network with no password, or a name that is slightly different from the real one.`,
      `A login page that asks for unusual details such as bank information or an OTP.`,
      `Browser warnings about an unsafe connection or a bad certificate.`,
      `Your phone connects to unknown networks automatically.`
    ],
    protect: [
      `Avoid banking, UPI and shopping on public Wi-Fi. Use your mobile data instead.`,
      `Ask staff for the exact network name before you connect.`,
      `Check that the website uses HTTPS (the padlock in the address bar).`,
      `Turn off auto-connect and file sharing.`,
      `Use a trusted VPN if you must use public Wi-Fi, and log out when you are done.`
    ],
    recover: [
      `Forget the network on your device.`,
      `Change the passwords of accounts you used on it.`,
      `Check your bank account for transactions you do not recognise.`
    ],
    remember: `Public Wi-Fi is for browsing. Do payments on your own data.`
  }

};