const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
  catId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary']
  },
  stars: {
    type: Number,
    required: true,
    default: 1
  },
  imageUrl: {
    type: String,
    required: true
  },
  dialogue: {
    greeting: {
      type: String,
      default: 'Мяу! Рад познакомиться!'
    },
    activation: {
      type: String,
      default: 'Я готов помогать!'
    },
    deactivation: {
      type: String,
      default: 'Отдохну пока...'
    }
  },
  isStory: {
    type: Boolean,
    default: false
  },
  unlockCondition: {
    type: {
      type: String,
      enum: ['story', 'level', 'building', 'quest', 'expedition'],
      default: 'level'
    },
    value: {
      type: String,
      default: '1'
    }
  },
  acquisition: {
    type: {
      type: String,
      required: true,
      enum: ['daily', 'shop', 'quest', 'story', 'event']
    },
    cost: {
      type: Number,
      required: function() {
        return this.acquisition.type === 'shop';
      }
    },
    currency: {
      type: String,
      required: function() {
        return this.acquisition.type === 'shop';
      },
      enum: ['coins', 'catFood']
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cat', CatSchema);