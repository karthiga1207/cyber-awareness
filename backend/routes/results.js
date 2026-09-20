const express = require('express');
const Result = require('../models/Result');
const requireAuth = require('../middleware/auth');

const router = express.Router();

const TOTAL_QUESTIONS = 12;
const TOPICS = ['phishing', 'upi-fraud', 'malware', 'password-attacks', 'ransomware', 'public-wifi'];

function levelFor(score) {
  if (score >= 10) return 'Aware';
  if (score >= 6) return 'Intermediate';
  return 'Beginner';
}

function publicResult(r) {
  return { id: r._id, score: r.score, total: r.total, level: r.level, weakTopics: r.weakTopics, date: r.createdAt };
}

// POST /api/results  (save the result of one quiz attempt)
router.post('/', requireAuth, async (req, res) => {
  try {
    const score = Number(req.body.score);
    const total = Number(req.body.total);

    if (!Number.isInteger(score) || !Number.isInteger(total) || total !== TOTAL_QUESTIONS || score < 0 || score > total) {
      return res.status(400).json({ message: 'Invalid result.' });
    }

    const weakTopics = Array.isArray(req.body.weakTopics)
      ? [...new Set(req.body.weakTopics.map(String).filter((t) => TOPICS.includes(t)))]
      : [];

    // The level is worked out here on the server, so it cannot be faked from the browser
    const result = await Result.create({
      user: req.user.id,
      score,
      total,
      level: levelFor(score),
      weakTopics
    });

    res.status(201).json({ result: publicResult(result) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/results/mine  (the last 10 results of the logged-in user)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.json({ results: results.map(publicResult) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;