// Константы игры

// Ресурсы
const RESOURCES = {
    WOOD: {
      name: 'wood',
      displayName: 'Дерево',
      regenerationTime: 30 * 60 * 1000, // 30 минут в миллисекундах
      regenerationAmount: 10,
      initialAmount: 50
    },
    FISH: {
      name: 'fish',
      displayName: 'Рыба',
      regenerationTime: 20 * 60 * 1000, // 20 минут в миллисекундах
      regenerationAmount: 10,
      initialAmount: 30
    },
    COINS: {
      name: 'coins',
      displayName: 'Монеты',
      initialAmount: 0
    },
    CAT_FOOD: {
      name: 'catFood',
      displayName: 'Кошачий корм',
      initialAmount: 0
    }
  };
  
  // Здания
  const BUILDINGS = {
    MAIN_HOUSE: {
      name: 'mainHouse',
      displayName: 'Главный дом',
      description: 'Увеличивает хранилище ресурсов',
      initialLevel: 0,
      maxLevel: 3,
      upgradeCosts: [
        { wood: 10, fish: 0, coins: 0 }, // Уровень 1
        { wood: 25, fish: 15, coins: 5 }, // Уровень 2
        { wood: 50, fish: 30, coins: 20 } // Уровень 3
      ],
      storageBonus: [0, 50, 100, 200] // Бонус к хранилищу в процентах (по уровням)
    },
    MARKET: {
      name: 'market',
      displayName: 'Ларек',
      description: 'Для продажи ресурсов и получения монет',
      initialLevel: 0,
      maxLevel: 3,
      upgradeCosts: [
        { wood: 20, fish: 10, coins: 0 }, // Уровень 1
        { wood: 40, fish: 20, coins: 15 }, // Уровень 2
        { wood: 60, fish: 40, coins: 30 } // Уровень 3
      ],
      tradeRates: [
        // Уровень 1
        { 
          wood: { amount: 5, price: 2 }, 
          fish: { amount: 5, price: 3 } 
        },
        // Уровень 2
        { 
          wood: { amount: 5, price: 3 }, 
          fish: { amount: 5, price: 4 } 
        },
        // Уровень 3
        { 
          wood: { amount: 5, price: 4 }, 
          fish: { amount: 5, price: 5 } 
        }
      ]
    },
    GUEST_HOUSE: {
      name: 'guestHouse',
      displayName: 'Гостевой домик',
      description: 'Хранит коллекцию карточек кошек',
      initialLevel: 0,
      maxLevel: 3,
      upgradeCosts: [
        { wood: 30, fish: 20, coins: 15 }, // Уровень 1
        { wood: 45, fish: 30, coins: 25 }, // Уровень 2
        { wood: 70, fish: 50, coins: 40 } // Уровень 3
      ],
      catSlots: [3, 5, 7, 10] // Количество доступных слотов для карточек кошек (по уровням)
    }
  };
  
  // Типы кошек
  const CAT_TYPES = {
    HARVESTER: 'harvester', // Добытчик
    BUILDER: 'builder', // Строитель
    TRADER: 'trader', // Торговец
    EXPLORER: 'explorer', // Исследователь
    KEEPER: 'keeper' // Хранитель
  };
  
  // Кошки
  const CATS = {
    BUILDER_HARRY: {
      id: 'builderHarry',
      name: 'Котик-строитель Гарри',
      description: 'Энергичный рыжий кот в строительной каске',
      rarity: 'common',
      stars: 1,
      imageUrl: 'cats/builder_harry.png',
      acquisition: {
        type: 'story',
        value: '1'
      }
    },
    FISHER_MARINA: {
      id: 'fisherMarina',
      name: 'Марина Рыбачка',
      description: 'Синеватая кошка с повязкой на голове и рыболовной удочкой',
      rarity: 'common',
      stars: 1,
      imageUrl: 'cats/fisher_marina.png',
      acquisition: {
        type: 'quest',
        value: '1'
      }
    },
    MERCHANT_FELIX: {
      id: 'merchantFelix',
      name: 'Купец Феликс',
      description: 'Толстый черный кот с жилеткой и монетой в лапе',
      rarity: 'uncommon',
      stars: 2,
      imageUrl: 'cats/merchant_felix.png',
      acquisition: {
        type: 'shop',
        cost: 1000,
        currency: 'coins'
      }
    },
    KEEPER_OSCAR: {
      id: 'keeperOscar',
      name: 'Хранитель Оскар',
      description: 'Педантичный серый кот с записной книжкой',
      rarity: 'uncommon',
      stars: 2,
      imageUrl: 'cats/keeper_oscar.png',
      acquisition: {
        type: 'shop',
        cost: 1000,
        currency: 'coins'
      }
    },
    // Добавляем тестовые карточки разных редкостей
    MYSTIC_LUNA: {
      id: 'mysticLuna',
      name: 'Мистическая Луна',
      description: 'Загадочная кошка с мерцающими глазами',
      rarity: 'rare',
      stars: 3,
      imageUrl: 'cats/mystic_luna.png',
      acquisition: {
        type: 'event',
        value: '1'
      }
    },
    SHADOW_KING: {
      id: 'shadowKing',
      name: 'Король Теней',
      description: 'Величественный черный кот с золотой короной',
      rarity: 'epic',
      stars: 4,
      imageUrl: 'cats/shadow_king.png',
      acquisition: {
        type: 'daily',
        value: '1'
      }
    },
    GOLDEN_EMPEROR: {
      id: 'goldenEmperor',
      name: 'Золотой Император',
      description: 'Величественный кот с золотой шубой и драгоценными камнями',
      rarity: 'legendary',
      stars: 5,
      imageUrl: 'cats/golden_emperor.png',
      acquisition: {
        type: 'quest',
        value: '1'
      }
    }
  };
  
  // Начальный сюжет и диалоги
  const STORY = {
    INTRO: {
      title: 'Добро пожаловать в Catwille',
      text: 'Добро пожаловать в Catwille, путник! Раньше здесь был процветающий кошачий город, но после Великой Бури почти все разбежались... Я остался, чтобы хранить память о нашем поселении. Быть может, с твоей помощью мы сможем вернуть Catwille былое величие? Если восстановить дома, я уверен - кошки начнут возвращаться!',
      character: 'Старый Том'
    },
    TUTORIAL_WOOD: {
      title: 'Сбор дерева',
      text: 'Чтобы восстановить наш дом, нам понадобится дерево. Нажимай на дерево, чтобы собрать 1 единицу. Ресурсы ограничены, но со временем восстанавливаются!',
      character: 'Старый Том'
    },
    HOUSE_REPAIRED: {
      title: 'Дом восстановлен!',
      text: 'Замечательно! Уже выглядит гораздо лучше!',
      character: 'Старый Том'
    },
    FIRST_CAT: {
      title: 'Первый кот вернулся!',
      text: 'Смотри-ка! Первый кот уже вернулся! Это Гарри, он всегда был отличным строителем. Активируй его карточку, и он поможет тебе быстрее собирать дерево.',
      character: 'Старый Том'
    }
  };
  
  module.exports = {
    RESOURCES,
    BUILDINGS,
    CAT_TYPES,
    CATS,
    STORY
  };