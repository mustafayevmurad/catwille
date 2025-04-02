const mongoose = require('mongoose');
const { RESOURCES, BUILDINGS } = require('../config/constants');

const UserSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  stars: {
    type: Number,
    default: 0
  },
  resources: {
    wood: {
      amount: {
        type: Number,
        default: RESOURCES.WOOD.initialAmount
      },
      lastRegeneration: {
        type: Date,
        default: Date.now
      }
    },
    fish: {
      amount: {
        type: Number,
        default: RESOURCES.FISH.initialAmount
      },
      lastRegeneration: {
        type: Date,
        default: Date.now
      }
    },
    coins: {
      type: Number,
      default: RESOURCES.COINS.initialAmount
    },
    catFood: {
      type: Number,
      default: RESOURCES.CAT_FOOD.initialAmount
    }
  },
  buildings: {
    mainHouse: {
      level: {
        type: Number,
        default: BUILDINGS.MAIN_HOUSE.initialLevel
      },
      built: {
        type: Boolean,
        default: false
      }
    },
    market: {
      level: {
        type: Number,
        default: BUILDINGS.MARKET.initialLevel
      },
      built: {
        type: Boolean,
        default: false
      }
    },
    guestHouse: {
      level: {
        type: Number,
        default: BUILDINGS.GUEST_HOUSE.initialLevel
      },
      built: {
        type: Boolean,
        default: false
      }
    }
  },
  cats: [{
    catId: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    // Дополнительные свойства для кошек можно добавить здесь
  }],
  activeCats: {
    type: Number,
    default: 0
  },
  maxActiveCats: {
    type: Number,
    default: 3
  },
  storageLimit: {
    wood: {
      type: Number,
      default: 100
    },
    fish: {
      type: Number,
      default: 100
    },
    catFood: {
      type: Number,
      default: 50
    }
  },
  quests: [{
    questId: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    }
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  },
  lastExpedition: {
    type: Date,
    default: null
  },
  tutorialCompleted: {
    type: Boolean,
    default: false
  },
  // Дополнительные поля для игрока можно добавить здесь
}, {
  timestamps: true
});

// Обновление лимитов хранилища на основе уровня главного дома
UserSchema.methods.updateStorageLimits = function() {
  const mainHouseLevel = this.buildings.mainHouse.level;
  const storageBonus = BUILDINGS.MAIN_HOUSE.storageBonus[mainHouseLevel] / 100;
  
  this.storageLimit.wood = Math.floor(100 * (1 + storageBonus));
  this.storageLimit.fish = Math.floor(100 * (1 + storageBonus));
  this.storageLimit.catFood = Math.floor(50 * (1 + storageBonus));

  return this;
};

// Добавление опыта игроку
UserSchema.methods.addExperience = function(amount) {
  this.experience += amount;
  
  // Проверка на повышение уровня
  const expNeededForNextLevel = this.level * 100; // Упрощенная формула
  
  if (this.experience >= expNeededForNextLevel) {
    this.level += 1;
    this.experience -= expNeededForNextLevel;
  }

  return this;
};

// Регенерация ресурсов
UserSchema.methods.regenerateResources = function() {
  const now = new Date();
  
  // Регенерация дерева
  const woodRegenTime = RESOURCES.WOOD.regenerationTime;
  const woodLastRegen = this.resources.wood.lastRegeneration;
  const woodTimeDiff = now - woodLastRegen;
  
  if (woodTimeDiff >= woodRegenTime) {
    const regenCycles = Math.floor(woodTimeDiff / woodRegenTime);
    const woodToAdd = regenCycles * RESOURCES.WOOD.regenerationAmount;
    
    this.resources.wood.amount = Math.min(
      this.resources.wood.amount + woodToAdd,
      this.storageLimit.wood
    );
    this.resources.wood.lastRegeneration = new Date(
      woodLastRegen.getTime() + (regenCycles * woodRegenTime)
    );
  }
  
  // Регенерация рыбы
  const fishRegenTime = RESOURCES.FISH.regenerationTime;
  const fishLastRegen = this.resources.fish.lastRegeneration;
  const fishTimeDiff = now - fishLastRegen;
  
  if (fishTimeDiff >= fishRegenTime) {
    const regenCycles = Math.floor(fishTimeDiff / fishRegenTime);
    const fishToAdd = regenCycles * RESOURCES.FISH.regenerationAmount;
    
    this.resources.fish.amount = Math.min(
      this.resources.fish.amount + fishToAdd,
      this.storageLimit.fish
    );
    this.resources.fish.lastRegeneration = new Date(
      fishLastRegen.getTime() + (regenCycles * fishRegenTime)
    );
  }
  
  return this;
};

module.exports = mongoose.model('User', UserSchema);