const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Aware'], required: true },
    weakTopics: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);