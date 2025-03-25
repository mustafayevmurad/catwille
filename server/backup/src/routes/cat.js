const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  catId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ссылка на модель User по имени
    required: true,
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  personality: {
    type: String,
    required: true,
  },
  skills: [{
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
  }],
  stats: {
    fishing: { type: Number, default: 1 },
    hunting: { type: Number, default: 1 },
    crafting: { type: Number, default: 1 },
    exploring: { type: Number, default: 1 },
  },
  experience: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  discoveredAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cat', catSchema);