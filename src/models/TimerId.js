const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  timeLeft: { type: Number, required: true, default: 30 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TimeId', gameSchema);
