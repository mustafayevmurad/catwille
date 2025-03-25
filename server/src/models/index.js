const mongoose = require('mongoose');

// Схема для пользователя
const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  resources: {
    fish: { type: Number, default: 100 },
    yarnBalls: { type: Number, default: 10 },
    toys: { type: Number, default: 5 },
    treats: { type: Number, default: 5 },
    catCoins: { type: Number, default: 0 },
  },
  energy: {
    current: { type: Number, default: 100 },
    max: { type: Number, default: 100 },
    lastRefill: { type: Date, default: Date.now },
  },
  cats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat',
  }],
  buildings: [{
    buildingId: { type: String, required: true },
    level: { type: Number, default: 1 },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  }],
  dailyTasks: {
    lastReset: { type: Date, default: Date.now },
    tasks: [{
      taskId: { type: String },
      progress: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
    }],
  },
  settings: {
    notifications: { type: Boolean, default: true },
    soundEffects: { type: Boolean, default: true },
    music: { type: Boolean, default: true },
  },
});

// Схема для кошки
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
    ref: 'User',
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

// Создание моделей
const User = mongoose.model('User', userSchema);
const Cat = mongoose.model('Cat', catSchema);

// Экспорт моделей
module.exports = {
  User,
  Cat
};