/**
 * Компонент для управления зданиями
 */
class BuildingsManager {
    constructor() {
        // Данные о зданиях
        this.buildings = {
            mainHouse: {
                level: 0,
                built: false,
                maxLevel: 3,
                displayName: 'Кошачье логово',
                description: 'Увеличивает максимальный уровень других зданий в поселении',
                energyCost: 5, // Стоимость энергии для улучшения
                upgradeCosts: [
                    { wood: 10, fish: 0, coins: 0 }, // Уровень 1
                    { wood: 25, fish: 15, coins: 5 }, // Уровень 2
                    { wood: 50, fish: 30, coins: 20 } // Уровень 3
                ]
            },
            warehouse: {
                level: 0,
                built: false,
                maxLevel: 3,
                displayName: 'Кошачий склад',
                description: 'Увеличивает хранилище ресурсов',
                energyCost: 8, // Стоимость энергии для улучшения
                upgradeCosts: [
                    { wood: 15, fish: 5, coins: 0 }, // Уровень 1
                    { wood: 30, fish: 15, coins: 10 }, // Уровень 2
                    { wood: 60, fish: 30, coins: 25 } // Уровень 3
                ]
            },
            cathouse: {
                level: 0,
                built: false,
                maxLevel: 3,
                displayName: 'Мурчальня',
                description: 'Позволяет заселить больше кошек в поселении',
                energyCost: 10, // Стоимость энергии для улучшения
                upgradeCosts: [
                    { wood: 30, fish: 20, coins: 15 }, // Уровень 1
                    { wood: 45, fish: 30, coins: 25 }, // Уровень 2
                    { wood: 70, fish: 50, coins: 40 } // Уровень 3
                ]
            },
            cart: {
                level: 0,
                built: false,
                maxLevel: 3,
                displayName: 'Кошачья повозка',
                description: 'Для продажи ресурсов и получения монет',
                energyCost: 7, // Стоимость энергии для улучшения
                upgradeCosts: [
                    { wood: 20, fish: 10, coins: 0 }, // Уровень 1
                    { wood: 40, fish: 20, coins: 15 }, // Уровень 2
                    { wood: 60, fish: 40, coins: 30 } // Уровень 3
                ]
            },
            farm: {
                level: 0,
                built: false,
                maxLevel: 3,
                displayName: 'Кошачья ферма',
                description: 'Коты сами добывают рыбу. Пассивный доход ресурсов',
                energyCost: 12, // Стоимость энергии для улучшения
                upgradeCosts: [
                    { wood: 35, fish: 15, coins: 10 }, // Уровень 1
                    { wood: 50, fish: 30, coins: 25 }, // Уровень 2
                    { wood: 75, fish: 50, coins: 45 } // Уровень 3
                ]
            },
            sawmill: {
                level: 0,
                built: false,
                maxLevel: 3,
                displayName: 'Кошачья лесопилка',
                description: 'Коты сами добывают дерево. Пассивный доход ресурсов',
                energyCost: 12, // Стоимость энергии для улучшения
                upgradeCosts: [
                    { wood: 15, fish: 35, coins: 10 }, // Уровень 1
                    { wood: 30, fish: 50, coins: 25 }, // Уровень 2
                    { wood: 50, fish: 75, coins: 45 } // Уровень 3
                ]
            }
        };

        // Элементы зданий в DOM
        this.elements = {
            mainHouse: document.getElementById('main-house'),
            warehouse: document.getElementById('warehouse'),
            cathouse: document.getElementById('cathouse'),
            cart: document.getElementById('cart'),
            farm: document.getElementById('farm'),
            sawmill: document.getElementById('sawmill')
        };

        // Элементы модального окна строительства
        this.buildingModal = {
            modal: document.getElementById('building-modal'),
            title: document.getElementById('building-title'),
            image: document.getElementById('building-image'),
            description: document.getElementById('building-description'),
            level: document.getElementById('building-level'),
            maxLevel: document.getElementById('building-max-level'),
            costWood: document.getElementById('building-cost-wood'),
            costFish: document.getElementById('building-cost-fish'),
            costCoins: document.getElementById('building-cost-coins'),
            actionButton: document.getElementById('building-action-btn'),
            closeButton: document.querySelector('#building-modal .close-modal')
        };

        // Текущее здание для модального окна
        this.currentBuilding = null;
        
        // Интервал для пассивного дохода
        this.passiveIncomeInterval = null;

        // Инициализация обработчиков событий
        this.initEventListeners();

        // Добавляем кнопку закрытия к модальному окну
        this.addCloseButton();
        
        // Запускаем пассивный доход
        this.startPassiveIncome();

        // Добавить необходимые классы для каждого здания сразу
        this.initBuildingClasses();

        // Обновляем отображение для установки правильных текстов на кнопках
        this.updateDisplay();
    }

    /**
     * Инициализирует правильные классы для каждого здания
     */
    initBuildingClasses() {
        for (const buildingType in this.buildings) {
            const element = this.elements[buildingType];
            if (element) {
                const buildingClass = buildingType.replace(/([A-Z])/g, '-$1').toLowerCase();
                
                // Ensure the building has both "building" and type-specific class
                element.classList.add('building');
                element.classList.add(buildingClass);
                
                // Add level class
                const level = this.buildings[buildingType].level;
                element.classList.add(`level-${level}`);
                
                // Debug - Check the computed style
                const computedStyle = window.getComputedStyle(element);
                console.log(`Building ${buildingType} background-image: ${computedStyle.backgroundImage}`);
                console.log(`Building ${buildingType} classes: ${element.className}`);
            }
        }
    }

    /**
     * Инициализация обработчиков событий
     */
    initEventListeners() {
        // Клики по зданиям для открытия соответствующих интерфейсов
        if (this.elements.mainHouse) {
            this.elements.mainHouse.addEventListener('click', () => {
                this.showHouseInterface();
            });
        }
        
        if (this.elements.warehouse) {
            this.elements.warehouse.addEventListener('click', () => {
                this.showWarehouseInterface();
            });
        }
        
        if (this.elements.cathouse) {
            this.elements.cathouse.addEventListener('click', () => {
                this.showCathouseInterface();
            });
        }
        
        if (this.elements.cart) {
            this.elements.cart.addEventListener('click', () => {
                this.showCartInterface();
            });
        }
        
        if (this.elements.farm) {
            this.elements.farm.addEventListener('click', () => {
                this.showFarmInterface();
            });
        }
        
        if (this.elements.sawmill) {
            this.elements.sawmill.addEventListener('click', () => {
                this.showSawmillInterface();
            });
        }
        
        // Обработчики для кнопок улучшения
        const upgradeHouseBtn = document.getElementById('upgrade-house');
        if (upgradeHouseBtn) {
            upgradeHouseBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.openBuildingModal('mainHouse');
            });
        }
        
        const upgradeWarehouseBtn = document.getElementById('upgrade-warehouse');
        if (upgradeWarehouseBtn) {
            upgradeWarehouseBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.openBuildingModal('warehouse');
            });
        }
        
        const upgradeCathouseBtn = document.getElementById('upgrade-cathouse');
        if (upgradeCathouseBtn) {
            upgradeCathouseBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.openBuildingModal('cathouse');
            });
        }
        
        const upgradeCartBtn = document.getElementById('upgrade-cart');
        if (upgradeCartBtn) {
            upgradeCartBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.openBuildingModal('cart');
            });
        }
        
        const upgradeFarmBtn = document.getElementById('upgrade-farm');
        if (upgradeFarmBtn) {
            upgradeFarmBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.openBuildingModal('farm');
            });
        }
        
        const upgradeSawmillBtn = document.getElementById('upgrade-sawmill');
        if (upgradeSawmillBtn) {
            upgradeSawmillBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.openBuildingModal('sawmill');
            });
        }

        // Закрытие модального окна
        if (this.buildingModal.closeButton) {
            this.buildingModal.closeButton.addEventListener('click', () => {
                this.closeBuildingModal();
            });
        }

        // Клик по кнопке действия (построить/улучшить)
        if (this.buildingModal.actionButton) {
            this.buildingModal.actionButton.addEventListener('click', () => {
                this.buildOrUpgrade();
            });
        }
    }

    /**
     * Обновление данных зданий
     * @param {Object} userData - Данные пользователя
     */
    updateBuildings(userData) {
        if (!userData || !userData.buildings) return;

        // Обновляем данные зданий из данных пользователя
        for (const buildingType in this.buildings) {
            if (userData.buildings[buildingType]) {
                this.buildings[buildingType].level = userData.buildings[buildingType].level;
                this.buildings[buildingType].built = userData.buildings[buildingType].built;
            }
        }

        // Обновляем отображение
        this.updateDisplay();
        
        // Перезапускаем пассивный доход
        this.startPassiveIncome();
    }

    /**
     * Обновление отображения зданий
     */
    updateDisplay() {
        console.log('Updating building display');
        for (const buildingType in this.buildings) {
            const element = this.elements[buildingType];
            const building = this.buildings[buildingType];
            
            if (element) {
                // Получаем класс на основе типа здания
                const buildingClass = buildingType.replace(/([A-Z])/g, '-$1').toLowerCase();
                console.log(`Building: ${buildingType}, element classes before: ${element.className}`);
                
                // Store the original class list to ensure we don't lose the building class
                const classList = [...element.classList];
                
                // Обновляем только класс уровня
                element.classList.remove('level-0', 'level-1', 'level-2', 'level-3');
                element.classList.add(`level-${building.level}`);
                
                // Убедимся, что класс building присутствует
                if (!element.classList.contains('building')) {
                    element.classList.add('building');
                }
                
                // Убедимся, что класс типа здания присутствует
                if (!element.classList.contains(buildingClass)) {
                    element.classList.add(buildingClass);
                }
                
                console.log(`Building: ${buildingType}, element classes after: ${element.className}`);
                
                // Можно добавить дополнительные стили для построенных зданий
                if (building.built) {
                    element.classList.add('built');
                } else {
                    element.classList.remove('built');
                }
                
                // Обновляем состояние кнопок улучшения
                const upgradeButton = document.getElementById(`upgrade-${buildingType.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
                if (upgradeButton) {
                    if (building.level >= building.maxLevel) {
                        upgradeButton.disabled = true;
                        upgradeButton.textContent = 'Max Level';
                    } else if (building.level === 0) {
                        upgradeButton.textContent = 'Build';
                    } else {
                        upgradeButton.disabled = false;
                        upgradeButton.textContent = 'Upgrade';
                    }
                }
            }
        }
        
        // Обновляем хранилище ресурсов, если склад построен
        if (this.buildings.warehouse.level > 0) {
            const storageCapacity = this.buildings.warehouse.level * 25 + 50; // 50 + 25 за уровень
            
            // Обновляем лимиты в интерфейсе и менеджере ресурсов
            const woodLimit = document.getElementById('wood-limit');
            const fishLimit = document.getElementById('fish-limit');
            
            if (woodLimit) woodLimit.textContent = storageCapacity;
            if (fishLimit) fishLimit.textContent = storageCapacity;
            
            // Обновляем лимиты в менеджере ресурсов
            if (window.resourcesManager) {
                window.resourcesManager.resources.wood.limit = storageCapacity;
                window.resourcesManager.resources.fish.limit = storageCapacity;
            }
        }
        
        // Применяем ограничение максимального уровня от главного дома
        const mainHouseLevel = this.buildings.mainHouse.level;
        if (mainHouseLevel > 0) {
            const maxBuildingLevel = mainHouseLevel;
            
            for (const buildingType in this.buildings) {
                if (buildingType !== 'mainHouse') {
                    const upgradeButton = document.getElementById(`upgrade-${buildingType.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
                    const building = this.buildings[buildingType];
                    
                    // Ограничиваем постройку/улучшение, если уровень здания достиг уровня главного дома
                    if (upgradeButton && building.level >= maxBuildingLevel) {
                        upgradeButton.disabled = true;
                        if (building.level < building.maxLevel) {
                            upgradeButton.textContent = 'Требуется улучшить логово';
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Запускает таймер для пассивного дохода
     */
    startPassiveIncome() {
        // Очищаем предыдущий интервал
        if (this.passiveIncomeInterval) {
            clearInterval(this.passiveIncomeInterval);
        }
        
        // Запускаем новый интервал, если построены ферма или лесопилка
        if (this.buildings.farm.level > 0 || this.buildings.sawmill.level > 0) {
            this.passiveIncomeInterval = setInterval(() => {
                this.generatePassiveIncome();
            }, 60000); // Пассивный доход каждую минуту
            
            // Сразу генерируем первый доход
            this.generatePassiveIncome();
        }
    }
    
    /**
     * Генерирует пассивный доход от зданий
     */
    generatePassiveIncome() {
        if (!window.resourcesManager) return;
        
        let woodIncome = 0;
        let fishIncome = 0;
        
        // Пассивный доход от лесопилки
        if (this.buildings.sawmill.level > 0) {
            woodIncome = this.buildings.sawmill.level * 2; // 2 дерева в минуту за уровень
        }
        
        // Пассивный доход от фермы
        if (this.buildings.farm.level > 0) {
            fishIncome = this.buildings.farm.level * 2; // 2 рыбы в минуту за уровень
        }
        
        // Добавляем ресурсы с учетом лимита хранилища
        if (woodIncome > 0) {
            const currentWood = window.resourcesManager.resources.wood.amount;
            const woodLimit = window.resourcesManager.resources.wood.limit;
            window.resourcesManager.resources.wood.amount = Math.min(currentWood + woodIncome, woodLimit);
        }
        
        if (fishIncome > 0) {
            const currentFish = window.resourcesManager.resources.fish.amount;
            const fishLimit = window.resourcesManager.resources.fish.limit;
            window.resourcesManager.resources.fish.amount = Math.min(currentFish + fishIncome, fishLimit);
        }
        
        // Обновляем отображение ресурсов
        if (woodIncome > 0 || fishIncome > 0) {
            window.resourcesManager.updateDisplay();
            
            // Показываем сообщение о полученных ресурсах
            const message = `Пассивный доход: +${woodIncome} дерева, +${fishIncome} рыбы`;
            if (window.mainScene && typeof window.mainScene.showMessage === 'function') {
                window.mainScene.showMessage(message);
            }
        }
    }

    /**
     * Открывает модальное окно строительства/улучшения
     * @param {string} buildingType - Тип здания
     */
    openBuildingModal(buildingType) {
        if (!buildingType || !this.buildings[buildingType]) return;

        const building = this.buildings[buildingType];
        this.currentBuilding = buildingType;

        // Заполняем информацию о здании
        this.buildingModal.title.textContent = building.displayName;
        
        // Set class and directly set the background image
        const buildingClass = buildingType.replace(/([A-Z])/g, '-$1').toLowerCase();
        this.buildingModal.image.className = `building-image ${buildingClass}-image level-${building.level}`;
        
        // Directly set the background image style for reliability
        if (buildingType === 'mainHouse') {
            this.buildingModal.image.style.backgroundImage = "url('assets/images/buildings/house.webp')";
        } else if (buildingType === 'warehouse') {
            this.buildingModal.image.style.backgroundImage = "url('assets/images/buildings/warehouse.webp')";
        } else if (buildingType === 'cathouse') {
            this.buildingModal.image.style.backgroundImage = "url('assets/images/buildings/cathouse.webp')";
        } else if (buildingType === 'cart') {
            this.buildingModal.image.style.backgroundImage = "url('assets/images/buildings/cart.webp')";
        } else if (buildingType === 'farm') {
            this.buildingModal.image.style.backgroundImage = "url('assets/images/buildings/farm.webp')";
        } else if (buildingType === 'sawmill') {
            this.buildingModal.image.style.backgroundImage = "url('assets/images/buildings/sawmill.webp')";
        }
        
        this.buildingModal.description.textContent = `${building.description}\nТребует энергии: ${building.energyCost}`;
        this.buildingModal.level.textContent = building.level;
        this.buildingModal.maxLevel.textContent = building.maxLevel;

        // Определяем, стоит ли показывать кнопку действия
        if (building.level >= building.maxLevel) {
            this.buildingModal.actionButton.disabled = true;
            this.buildingModal.actionButton.textContent = 'Максимальный уровень';
            this.buildingModal.costWood.parentElement.style.display = 'none';
            this.buildingModal.costFish.parentElement.style.display = 'none';
            this.buildingModal.costCoins.parentElement.style.display = 'none';
        } else {
            this.buildingModal.actionButton.disabled = false;
            
            // Определяем текст кнопки в зависимости от построено ли здание
            if (building.level === 0) {
                this.buildingModal.actionButton.textContent = 'Построить';
            } else {
                this.buildingModal.actionButton.textContent = 'Улучшить';
            }

            // Обновляем стоимость улучшения
            const cost = building.upgradeCosts[building.level];
            this.buildingModal.costWood.textContent = cost.wood;
            this.buildingModal.costFish.textContent = cost.fish;
            this.buildingModal.costCoins.textContent = cost.coins;

            // Показываем все стоимости
            this.buildingModal.costWood.parentElement.style.display = 'flex';
            this.buildingModal.costFish.parentElement.style.display = 'flex';
            this.buildingModal.costCoins.parentElement.style.display = 'flex';

            // Проверяем, достаточно ли ресурсов
            this.checkResources();
        }

        // Показываем модальное окно
        this.buildingModal.modal.style.display = 'flex';
    }

    /**
     * Закрывает модальное окно строительства/улучшения
     */
    closeBuildingModal() {
        this.buildingModal.modal.style.display = 'none';
        this.currentBuilding = null;
    }

    /**
     * Проверяет, достаточно ли ресурсов для строительства/улучшения
     */
    checkResources() {
        if (!this.currentBuilding || !window.resourcesManager) return;

        const building = this.buildings[this.currentBuilding];
        const cost = building.upgradeCosts[building.level];

        // Получаем текущие ресурсы пользователя
        const woodAmount = window.resourcesManager.resources.wood.amount;
        const fishAmount = window.resourcesManager.resources.fish.amount;
        const coinsAmount = window.resourcesManager.resources.coins.amount;
        const energyAmount = window.resourcesManager.resources.energy.amount;

        // Проверяем достаточность ресурсов и энергии
        const hasEnoughResources = 
            woodAmount >= cost.wood &&
            fishAmount >= cost.fish &&
            coinsAmount >= cost.coins &&
            energyAmount >= building.energyCost;

        // Обновляем состояние кнопки
        this.buildingModal.actionButton.disabled = !hasEnoughResources;

        // Подсвечиваем ресурсы, которых не хватает
        this.buildingModal.costWood.style.color = woodAmount >= cost.wood ? '#333' : '#ff0000';
        this.buildingModal.costFish.style.color = fishAmount >= cost.fish ? '#333' : '#ff0000';
        this.buildingModal.costCoins.style.color = coinsAmount >= cost.coins ? '#333' : '#ff0000';
    }

    /**
     * Выполняет постройку или улучшение здания
     */
    async buildOrUpgrade() {
        if (!this.currentBuilding) return;

        try {
            // Проверяем доступность resourcesManager
            if (!window.resourcesManager) {
                console.error('ResourcesManager не инициализирован');
                return;
            }

            // Отключаем кнопку на время операции
            this.buildingModal.actionButton.disabled = true;
            this.buildingModal.actionButton.textContent = 'Подождите...';

            const building = this.buildings[this.currentBuilding];
            const cost = building.upgradeCosts[building.level];

            // Проверяем достаточность ресурсов и энергии
            if (window.resourcesManager.resources.wood.amount < cost.wood ||
                window.resourcesManager.resources.fish.amount < cost.fish ||
                window.resourcesManager.resources.coins.amount < cost.coins ||
                window.resourcesManager.resources.energy.amount < building.energyCost) {
                console.error('Недостаточно ресурсов или энергии');
                this.buildingModal.actionButton.disabled = false;
                this.buildingModal.actionButton.textContent = building.level === 0 ? 'Построить' : 'Улучшить';
                return;
            }

            // Списываем ресурсы
            window.resourcesManager.resources.wood.amount -= cost.wood;
            window.resourcesManager.resources.fish.amount -= cost.fish;
            window.resourcesManager.resources.coins.amount -= cost.coins;
            window.resourcesManager.resources.energy.amount -= building.energyCost;

            // Обновляем отображение ресурсов
            window.resourcesManager.updateDisplay();

            // Повышаем уровень здания
            building.level += 1;
            building.built = true;

            // Проверяем, нужно ли добавить кошку
            if (window.catsManager) {
                let catToAdd = null;
                if (this.currentBuilding === 'mainHouse' && building.level === 1) {
                    catToAdd = 'builderHarry';
                } else if (this.currentBuilding === 'market' && building.level === 1) {
                    catToAdd = 'merchantFelix';
                } else if (this.currentBuilding === 'guestHouse' && building.level === 1) {
                    catToAdd = 'keeperOscar';
                } else if (this.currentBuilding === 'cathouse' && building.level === 1) {
                    catToAdd = 'mysticLuna'; // Дарим карточку кота при постройке Мурчальни
                }

                if (catToAdd && !window.catsManager.hasCat(catToAdd)) {
                    await window.catsManager.addNewCat(catToAdd);
                }
            }

            // Обновляем отображение зданий
            this.updateDisplay();

            // Обновляем отображение в модальном окне
            this.buildingModal.level.textContent = building.level;
            this.buildingModal.image.className = `building-image ${this.currentBuilding.replace(/([A-Z])/g, '-$1').toLowerCase()}-image level-${building.level}`;
            
            // Если достигнут максимальный уровень
            if (building.level >= building.maxLevel) {
                this.buildingModal.actionButton.disabled = true;
                this.buildingModal.actionButton.textContent = 'Максимальный уровень';
                this.buildingModal.costWood.parentElement.style.display = 'none';
                this.buildingModal.costFish.parentElement.style.display = 'none';
                this.buildingModal.costCoins.parentElement.style.display = 'none';
            } else {
                // Обновляем стоимость следующего улучшения
                const nextCost = building.upgradeCosts[building.level];
                this.buildingModal.costWood.textContent = nextCost.wood;
                this.buildingModal.costFish.textContent = nextCost.fish;
                this.buildingModal.costCoins.textContent = nextCost.coins;
                this.buildingModal.actionButton.textContent = 'Улучшить';
                this.checkResources(); // Проверяем достаточность ресурсов для следующего уровня
            }

            // Показываем сообщение об успехе
            console.log(`${building.displayName} улучшен до уровня ${building.level}`);
            
            // Уведомляем MainScene о модернизации здания
            if (window.mainScene && typeof window.mainScene.onBuildingUpgraded === 'function') {
                window.mainScene.onBuildingUpgraded(this.currentBuilding, building.level);
            }

        } catch (error) {
            console.error('Ошибка при улучшении здания:', error);
            this.buildingModal.actionButton.disabled = false;
            this.buildingModal.actionButton.textContent = this.buildings[this.currentBuilding].level === 0 ? 'Построить' : 'Улучшить';
        }
    }

    /**
     * Добавляет кнопку закрытия к модальному окну
     */
    addCloseButton() {
        if (!this.buildingModal.modal) {
            this.buildingModal.modal = document.getElementById('building-modal');
        }
        
        if (this.buildingModal.modal) {
            // Удаляем существующую кнопку закрытия, если она есть
            const existingButton = this.buildingModal.modal.querySelector('.close-button');
            if (existingButton) {
                existingButton.remove();
            }

            // Создаем новую кнопку закрытия
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerHTML = '×';
            closeButton.addEventListener('click', () => {
                this.buildingModal.modal.style.display = 'none';
            });

            // Добавляем кнопку в начало модального окна
            this.buildingModal.modal.insertBefore(closeButton, this.buildingModal.modal.firstChild);
        }
    }

    /**
     * Показывает интерфейс главного дома
     */
    showHouseInterface() {
        if (this.buildings.mainHouse.level === 0) {
            this.openBuildingModal('mainHouse');
            return;
        }
        
        const maxBuildingLevel = this.buildings.mainHouse.level;
        const message = `Кошачье логово уровня ${this.buildings.mainHouse.level} позволяет строить здания до ${maxBuildingLevel} уровня.`;
        
        if (window.mainScene && typeof window.mainScene.showMessage === 'function') {
            window.mainScene.showMessage(message);
        }
    }
    
    /**
     * Показывает интерфейс склада
     */
    showWarehouseInterface() {
        if (this.buildings.warehouse.level === 0) {
            this.openBuildingModal('warehouse');
            return;
        }
        
        const storageCapacity = this.buildings.warehouse.level * 25 + 50;
        const message = `Кошачий склад уровня ${this.buildings.warehouse.level} позволяет хранить до ${storageCapacity} единиц каждого ресурса.`;
        
        if (window.mainScene && typeof window.mainScene.showMessage === 'function') {
            window.mainScene.showMessage(message);
        }
    }
    
    /**
     * Показывает интерфейс мурчальни (гостевого дома)
     */
    showCathouseInterface() {
        if (this.buildings.cathouse.level === 0) {
            this.openBuildingModal('cathouse');
            return;
        }
        
        if (window.catsManager) {
            // Показываем большое окно с коллекцией карточек
            window.catsManager.showCatsPanel();
        } else {
            const message = `Мурчальня уровня ${this.buildings.cathouse.level} используется для хранения коллекционных карточек котов.`;
            
            if (window.mainScene && typeof window.mainScene.showMessage === 'function') {
                window.mainScene.showMessage(message);
            }
        }
    }
    
    /**
     * Показывает интерфейс повозки (рынка)
     */
    showCartInterface() {
        if (this.buildings.cart.level === 0) {
            this.openBuildingModal('cart');
            return;
        }
        
        if (window.mainScene && typeof window.mainScene.openTradeModal === 'function') {
            window.mainScene.openTradeModal();
        }
    }
    
    /**
     * Показывает интерфейс фермы
     */
    showFarmInterface() {
        if (this.buildings.farm.level === 0) {
            this.openBuildingModal('farm');
            return;
        }
        
        const fishPerMinute = this.buildings.farm.level * 2;
        const message = `Кошачья ферма уровня ${this.buildings.farm.level} приносит ${fishPerMinute} рыбы в минуту.`;
        
        if (window.mainScene && typeof window.mainScene.showMessage === 'function') {
            window.mainScene.showMessage(message);
        }
    }
    
    /**
     * Показывает интерфейс лесопилки
     */
    showSawmillInterface() {
        if (this.buildings.sawmill.level === 0) {
            this.openBuildingModal('sawmill');
            return;
        }
        
        const woodPerMinute = this.buildings.sawmill.level * 2;
        const message = `Кошачья лесопилка уровня ${this.buildings.sawmill.level} приносит ${woodPerMinute} дерева в минуту.`;
        
        if (window.mainScene && typeof window.mainScene.showMessage === 'function') {
            window.mainScene.showMessage(message);
        }
    }
}