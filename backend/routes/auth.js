const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Slows down password guessing: only failed attempts count,
// 10 of them per 15 minutes from one IP address.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many failed attempts. Please try again in 15 minutes.' }
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    // String() makes sure input is plain text, which blocks NoSQL injection
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ message: 'Name must be 2 to 60 characters.' });
    }
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters with letters and numbers.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // The password is never stored. Only its bcrypt hash is saved.
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    const user = await User.findOne({ email });
    const ok = user && (await bcrypt.compare(password, user.passwordHash));

    // Same message for wrong email and wrong password, so attackers learn nothing
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/auth/me  (needs a valid token)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;