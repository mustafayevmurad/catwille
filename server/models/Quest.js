const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
  questId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['story', 'daily', 'achievement']
  },
  requirements: [{
    type: {
      type: String,
      required: true,
      enum: ['collect', 'build', 'upgrade', 'activate', 'expedition']
    },
    target: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  rewards: {
    experience: {
      type: Number,
      default: 0
    },
    resources: {
      wood: {
        type: Number,
        default: 0
      },
      fish: {
        type: Number,
        default: 0
      },
      coins: {
        type: Number,
        default: 0
      },
      catFood: {
        type: Number,
        default: 0
      }
    },
    cats: [{
      type: String
    }],
    stars: {
      type: Number,
      default: 0
    }
  },
  order: {
    type: Number,
    default: 0
  },
  prerequisiteQuests: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  dialogue: {
    start: {
      character: String,
      text: String
    },
    complete: {
      character: String,
      text: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quest', QuestSchema);