/**
 * Компонент для управления ресурсами
 */
class ResourcesManager {
    constructor() {
        this.resources = {
            wood: {
                amount: 0,
                limit: 50,
                lastRegeneration: null,
                regenerationTime: 30 * 60 * 1000, // 30 минут в миллисекундах
                regenerationAmount: 10
            },
            fish: {
                amount: 0,
                limit: 50,
                lastRegeneration: null,
                regenerationTime: 20 * 60 * 1000, // 20 минут в миллисекундах
                regenerationAmount: 10
            },
            coins: {
                amount: 0,
                limit: 1000
            },
            energy: {
                amount: 100,
                limit: 100,
                lastRegeneration: null,
                regenerationTime: 10 * 1000, // 10 секунд в миллисекундах
                regenerationAmount: 1,
                nextRegeneration: Date.now() + 10 * 1000 // Устанавливаем следующую регенерацию
            },
            catFood: {
                amount: 0,
                limit: 50
            }
        };

        // Элементы DOM для отображения ресурсов
        this.elements = {
            wood: {
                amount: document.getElementById('wood-amount'),
                limit: document.getElementById('wood-limit')
            },
            fish: {
                amount: document.getElementById('fish-amount'),
                limit: document.getElementById('fish-limit')
            },
            coins: {
                amount: document.getElementById('coins-amount')
            },
            energy: {
                amount: document.getElementById('energy-text'),
                timer: document.getElementById('energy-timer')
            },
            catFood: {
                amount: document.getElementById('cat-food-amount'),
                limit: document.getElementById('cat-food-limit')
            }
        };

        // Таймеры регенерации
        this.timers = {
            wood: document.getElementById('wood-timer'),
            fish: document.getElementById('fish-timer')
        };

        // Интервалы обновления таймеров
        this.updateIntervals = {
            wood: null,
            fish: null,
            energy: null
        };
        
        // Запускаем регенерацию энергии сразу после инициализации
        this.startEnergyRegeneration();

        // Добавляем кнопку закрытия к модальному окну торговли
        this.addCloseButton();
        
        // Инициализация обработчиков событий для торговли
        this.initTradeEventListeners();
    }

    /**
     * Инициализация обработчиков событий для торговли
     */
    initTradeEventListeners() {
        // Обработчики для кнопок торговли
        const woodSellBtn = document.getElementById('wood-sell-btn');
        if (woodSellBtn) {
            woodSellBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.sellResource('wood');
            });
        }

        const fishSellBtn = document.getElementById('fish-sell-btn');
        if (fishSellBtn) {
            fishSellBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.sellResource('fish');
            });
        }

        // Обработчики для кнопок изменения количества
        ['wood', 'fish'].forEach(resource => {
            const minusBtn = document.getElementById(`${resource}-quantity-minus`);
            const plusBtn = document.getElementById(`${resource}-quantity-plus`);
            
            if (minusBtn) {
                minusBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    this.changeTradeQuantity(resource, -1);
                });
            }
            
            if (plusBtn) {
                plusBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    this.changeTradeQuantity(resource, 1);
                });
            }
        });
    }

    /**
     * Обновление данных ресурсов
     * @param {Object} userData - Данные пользователя
     */
    updateResources(userData) {
        if (!userData || !userData.resources) return;

        // Обновляем ресурсы из данных пользователя
        if (userData.resources.wood) {
            this.resources.wood.amount = userData.resources.wood.amount || 0;
            this.resources.wood.lastRegeneration = userData.resources.wood.lastRegeneration ? new Date(userData.resources.wood.lastRegeneration) : new Date();
        }

        if (userData.resources.fish) {
            this.resources.fish.amount = userData.resources.fish.amount || 0;
            this.resources.fish.lastRegeneration = userData.resources.fish.lastRegeneration ? new Date(userData.resources.fish.lastRegeneration) : new Date();
        }

        if (userData.resources.coins) {
            this.resources.coins.amount = userData.resources.coins.amount || 0;
        }

        // Initialize energy with default values if not provided
        if (userData.resources.energy) {
            this.resources.energy = {
                ...this.resources.energy,
                amount: userData.resources.energy.amount ?? 100,
                limit: userData.resources.energy.limit ?? 100,
                lastRegeneration: userData.resources.energy.lastRegeneration ? new Date(userData.resources.energy.lastRegeneration) : new Date(),
                nextRegeneration: Date.now() + (this.resources.energy.regenerationTime || 10000)
            };
        }

        if (userData.resources.catFood) {
            this.resources.catFood.amount = userData.resources.catFood.amount || 0;
        }

        // Обновляем лимиты хранилища
        if (userData.storageLimit) {
            if (userData.storageLimit.wood) this.resources.wood.limit = userData.storageLimit.wood;
            if (userData.storageLimit.fish) this.resources.fish.limit = userData.storageLimit.fish;
            if (userData.storageLimit.catFood) this.resources.catFood.limit = userData.storageLimit.catFood;
        }

        // Обновляем отображение
        this.updateDisplay();
    }

    /**
     * Обновление отображения ресурсов
     */
    updateDisplay() {
        // Обновляем текст с количеством ресурсов
        if (this.elements.wood.amount) {
            this.elements.wood.amount.textContent = Math.floor(this.resources.wood.amount);
        }
        if (this.elements.wood.limit) {
            this.elements.wood.limit.textContent = this.resources.wood.limit;
        }

        if (this.elements.fish.amount) {
            this.elements.fish.amount.textContent = Math.floor(this.resources.fish.amount);
        }
        if (this.elements.fish.limit) {
            this.elements.fish.limit.textContent = this.resources.fish.limit;
        }

        if (this.elements.coins.amount) {
            this.elements.coins.amount.textContent = Math.floor(this.resources.coins.amount);
        }

        // Обновляем энергетическую полосу
        const energyBar = document.getElementById('energy-bar');
        if (energyBar) {
            const energyPercentage = (this.resources.energy.amount / this.resources.energy.limit) * 100;
            energyBar.style.width = `${energyPercentage}%`;
        }

        // Обновляем текст энергии
        const energyText = document.getElementById('energy-text');
        if (energyText) {
            energyText.textContent = `${Math.floor(this.resources.energy.amount)}/${this.resources.energy.limit}`;
        }

        if (this.elements.catFood.amount) {
            this.elements.catFood.amount.textContent = Math.floor(this.resources.catFood.amount);
        }
        if (this.elements.catFood.limit) {
            this.elements.catFood.limit.textContent = this.resources.catFood.limit;
        }

        // Если энергия не полная, показываем и обновляем таймер
        if (this.resources.energy.amount < this.resources.energy.limit) {
            const timeLeft = Math.max(0, this.resources.energy.nextRegeneration - Date.now());
            this.updateEnergyTimer(timeLeft);
        }
    }

    /**
     * Запуск регенерации энергии
     */
    startEnergyRegeneration() {
        // Останавливаем предыдущий таймер
        if (this.updateIntervals.energy) {
            clearInterval(this.updateIntervals.energy);
        }

        // Устанавливаем время следующей регенерации
        if (this.resources.energy.amount < this.resources.energy.limit) {
            this.resources.energy.nextRegeneration = Date.now() + this.resources.energy.regenerationTime;
            
            // Показываем таймер сразу
            const timeLeft = this.resources.energy.regenerationTime;
            this.updateEnergyTimer(timeLeft);
        }

        // Запускаем новый таймер
        this.updateIntervals.energy = setInterval(() => {
            const now = Date.now();
            
            if (this.resources.energy.amount < this.resources.energy.limit) {
                const timeLeft = Math.max(0, this.resources.energy.nextRegeneration - now);
                this.updateEnergyTimer(timeLeft);

                if (timeLeft <= 0) {
                    // Добавляем энергию
                    this.resources.energy.amount = Math.min(
                        this.resources.energy.amount + this.resources.energy.regenerationAmount,
                        this.resources.energy.limit
                    );
                    
                    // Устанавливаем следующее время регенерации
                    if (this.resources.energy.amount < this.resources.energy.limit) {
                        this.resources.energy.nextRegeneration = now + this.resources.energy.regenerationTime;
                        this.updateEnergyTimer(this.resources.energy.regenerationTime);
                    } else {
                        this.updateEnergyTimer(0);
                    }
                    
                    // Обновляем отображение
                    this.updateDisplay();
                }
            } else {
                this.updateEnergyTimer(0);
            }
        }, 100); // Обновляем каждые 100мс для плавности
    }

    /**
     * Добавляет кнопку закрытия к модальному окну торговли
     */
    addCloseButton() {
        if (!this.tradeModal) {
            this.tradeModal = document.getElementById('trade-modal');
        }
        
        if (this.tradeModal) {
            // Удаляем существующую кнопку закрытия, если она есть
            const existingButton = this.tradeModal.querySelector('.close-button');
            if (existingButton) {
                existingButton.remove();
            }

            // Создаем новую кнопку закрытия
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerHTML = '×';
            closeButton.addEventListener('click', () => {
                this.tradeModal.style.display = 'none';
            });

            // Добавляем кнопку в начало модального окна
            this.tradeModal.insertBefore(closeButton, this.tradeModal.firstChild);
        }
    }

    /**
     * Добавляет указанное количество ресурса
     * @param {string} resourceType - Тип ресурса ('wood', 'fish', 'coins' и т.д.)
     * @param {number} amount - Количество для добавления
     * @param {boolean} showAnimation - Показывать ли анимацию (по умолчанию true)
     */
    addResource(resourceType, amount, showAnimation = true) {
        if (!this.resources[resourceType]) return;
        
        // Проверяем лимит для ресурсов с ограничением
        if (this.resources[resourceType].limit) {
            const newAmount = this.resources[resourceType].amount + amount;
            this.resources[resourceType].amount = Math.min(newAmount, this.resources[resourceType].limit);
        } else {
            this.resources[resourceType].amount += amount;
        }
        
        // Обновляем отображение
        this.updateDisplay();
        
        // Показываем анимацию, если нужно
        if (showAnimation) {
            this.showResourceCollectedAnimation(resourceType, amount);
        }
    }

    /**
     * Тратит указанное количество ресурса
     * @param {string} resourceType - Тип ресурса ('wood', 'fish', 'coins' и т.д.)
     * @param {number} amount - Количество для траты
     * @returns {boolean} - Успешно ли потрачен ресурс
     */
    spendResource(resourceType, amount) {
        if (!this.resources[resourceType] || this.resources[resourceType].amount < amount) {
            return false;
        }
        
        this.resources[resourceType].amount -= amount;
        this.updateDisplay();
        return true;
    }
    
    /**
     * Продает ресурс за монеты
     * @param {string} resourceType - Тип продаваемого ресурса
     */
    sellResource(resourceType) {
        // Получаем текущее количество из элемента интерфейса
        const quantityElement = document.getElementById(`${resourceType}-quantity`);
        if (!quantityElement) return;
        
        const quantity = parseInt(quantityElement.textContent);
        if (isNaN(quantity) || quantity <= 0) return;
        
        // Получаем цену и количество из элементов интерфейса
        const sellAmountElement = document.getElementById(`${resourceType}-sell-amount`);
        const sellPriceElement = document.getElementById(`${resourceType}-sell-price`);
        
        if (!sellAmountElement || !sellPriceElement) return;
        
        const sellAmount = parseInt(sellAmountElement.textContent);
        const sellPrice = parseInt(sellPriceElement.textContent);
        
        if (isNaN(sellAmount) || isNaN(sellPrice)) return;
        
        // Проверяем достаточно ли ресурсов
        const totalAmount = sellAmount * quantity;
        if (this.resources[resourceType].amount < totalAmount) {
            const message = `Недостаточно ${resourceType === 'wood' ? 'дерева' : 'рыбы'} для продажи`;
            this.showResourceMessage(resourceType, message, '#ff6666');
            return;
        }
        
        // Продаем ресурс и получаем монеты
        this.resources[resourceType].amount -= totalAmount;
        this.resources.coins.amount += sellPrice * quantity;
        
        // Обновляем отображение
        this.updateDisplay();
        
        // Показываем сообщение
        const message = `Продано ${totalAmount} ${resourceType === 'wood' ? 'дерева' : 'рыбы'} за ${sellPrice * quantity} монет`;
        this.showResourceMessage(resourceType, message, '#66ff66');
    }
    
    /**
     * Изменяет количество ресурса для продажи/покупки
     * @param {string} resourceType - Тип ресурса
     * @param {number} delta - Изменение (1 или -1)
     */
    changeTradeQuantity(resourceType, delta) {
        const quantityElement = document.getElementById(`${resourceType}-quantity`);
        if (!quantityElement) return;
        
        let quantity = parseInt(quantityElement.textContent);
        if (isNaN(quantity)) quantity = 1;
        
        quantity += delta;
        
        // Ограничиваем минимум в 1
        if (quantity < 1) quantity = 1;
        
        // Ограничиваем максимум (например, 10)
        if (quantity > 10) quantity = 10;
        
        quantityElement.textContent = quantity;
    }

    /**
     * Обновляет отображение таймера энергии
     * @param {number} timeLeft - Оставшееся время в миллисекундах
     */
    updateEnergyTimer(timeLeft) {
        const timerElement = document.getElementById('energy-timer');
        if (!timerElement) return;

        if (timeLeft > 0 && this.resources.energy.amount < this.resources.energy.limit) {
            const seconds = Math.ceil(timeLeft / 1000);
            timerElement.textContent = `Next +1 in ${seconds}s`;
            timerElement.style.display = 'block';
            timerElement.style.visibility = 'visible';
            timerElement.style.opacity = '1';
        } else if (this.resources.energy.amount >= this.resources.energy.limit) {
            timerElement.textContent = 'Energy Full!';
            timerElement.style.display = 'block';
            timerElement.style.visibility = 'visible';
            timerElement.style.opacity = '1';
        } else {
            timerElement.style.display = 'none';
        }
    }

    /**
     * Показывает анимацию добычи ресурса
     * @param {string} resourceType - Тип ресурса (wood, fish)
     * @param {number} amount - Количество добытого ресурса
     */
    showResourceCollectedAnimation(resourceType, amount) {
        const source = this.sources[resourceType];
        const gameArea = document.querySelector('.game-area');
        if (!source || !gameArea) return;

        try {
            // Создаем элемент для анимации
            const animElement = document.createElement('div');
            animElement.className = 'resource-collected';
            animElement.textContent = `+${amount}`;

            // Получаем позицию источника относительно game-area
            const sourceRect = source.getBoundingClientRect();
            const gameAreaRect = gameArea.getBoundingClientRect();

            // Размещаем элемент рядом с источником
            animElement.style.position = 'absolute';
            animElement.style.left = `${sourceRect.left - gameAreaRect.left + sourceRect.width / 2}px`;
            animElement.style.top = `${sourceRect.top - gameAreaRect.top}px`;

            // Добавляем элемент в DOM
            gameArea.appendChild(animElement);

            // Удаляем элемент после завершения анимации
            setTimeout(() => {
                if (animElement.parentNode) {
                    animElement.parentNode.removeChild(animElement);
                }
            }, 800);
        } catch (error) {
            console.error('Ошибка при показе анимации:', error);
        }
    }

    /**
     * Показывает сообщение рядом с ресурсом
     * @param {string} resourceType - Тип ресурса (wood, fish)
     * @param {string} message - Текст сообщения
     * @param {string} color - Цвет текста
     */
    showResourceMessage(resourceType, message, color = '#ffffff') {
        const source = this.sources[resourceType];
        const gameArea = document.querySelector('.game-area');
        if (!source || !gameArea) return;

        try {
            // Создаем элемент для сообщения
            const messageElement = document.createElement('div');
            messageElement.className = 'resource-message';
            messageElement.textContent = message;
            messageElement.style.color = color;

            // Получаем позицию источника относительно game-area
            const sourceRect = source.getBoundingClientRect();
            const gameAreaRect = gameArea.getBoundingClientRect();

            // Размещаем элемент рядом с источником
            messageElement.style.position = 'absolute';
            messageElement.style.left = `${sourceRect.left - gameAreaRect.left + sourceRect.width / 2}px`;
            messageElement.style.top = `${sourceRect.top - gameAreaRect.top - 20}px`;

            // Добавляем элемент в DOM
            gameArea.appendChild(messageElement);

            // Удаляем элемент после таймаута
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 1500);
        } catch (error) {
            console.error('Ошибка при показе сообщения:', error);
        }
    }
}