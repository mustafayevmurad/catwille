/**
 * Главная сцена игры
 * Управляет основным игровым процессом, интерфейсом и взаимодействием с пользователем
 */
import MapView from '../components/mapView.js';

class MainScene {
    constructor() {
        // Состояние сцены
        this.initialized = false;
        this.tutorialCompleted = false;
        this.currentDialog = null;
        this.energyInterval = null;
        this.dialogStep = 0;

        // Привязываем метод к контексту
        this.handleOutsideClick = this.handleOutsideClick.bind(this);

        // Данные игрока
        this.playerData = {
            name: 'Игрок',
            level: 1,
            experience: 0,
            stars: 0,
            energy: 100,
            maxEnergy: 100,
            tutorialCompleted: false
        };

        // Очередь диалогов туториала
        this.tutorialQueue = ['INTRO', 'TUTORIAL_WOOD'];

        // Инициализация менеджеров
        this.cityMapManager = null;
        this.regionMapManager = null;

        // Данные диалогов
        this.dialogData = {
            INTRO: {
                character: 'Старый Том',
                characterImage: 'assets/images/cats/old_tom.png',
                text: 'Добро пожаловать в Catwille, путник! Раньше здесь был процветающий кошачий город, но после Великой Бури почти все разбежались... Я остался, чтобы хранить память о нашем поселении. Быть может, с твоей помощью мы сможем вернуть Catwille былое величие?'
            },
            TUTORIAL_WOOD: {
                character: 'Старый Том',
                characterImage: 'assets/images/cats/old_tom.png',
                text: 'Чтобы восстановить наш дом, нам понадобится дерево. Нажимай на дерево, чтобы собрать 1 единицу. Ресурсы ограничены, но со временем восстанавливаются!'
            },
            FIRST_CAT: {
                character: 'Старый Том',
                characterImage: 'assets/images/cats/old_tom.png',
                text: 'Смотри-ка! Первый кот уже вернулся! Это Гарри, он всегда был отличным строителем. Активируй его карточку, и он поможет тебе быстрее собирать дерево.'
            }
        };

        // Элементы интерфейса
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            loadingBar: document.getElementById('loading-bar'),
            gameContainer: document.getElementById('game-container'),
            playerName: document.getElementById('player-name'),
            playerStars: document.getElementById('player-stars'),
            energyBar: document.getElementById('energy-bar'),
            energyText: document.getElementById('energy-text'),
            dialogModal: document.getElementById('dialog-modal'),
            dialogCharacterName: document.getElementById('dialog-character-name'),
            dialogCharacterImage: document.getElementById('dialog-character-image'),
            dialogText: document.getElementById('dialog-text'),
            dialogContinueBtn: document.getElementById('dialog-continue-btn'),
            tradeModal: document.getElementById('trade-modal')
        };

        // Инициализация обработчиков событий
        this.initEventListeners();
    }

    /**
     * Инициализация обработчиков событий
     */
    initEventListeners() {
        // Обработчики для кнопок меню
        const catsBtn = document.getElementById('cats-btn');
        const mapBtn = document.getElementById('map-btn');
        const tasksBtn = document.getElementById('tasks-btn');

        if (catsBtn) {
            catsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openShopModal();
            });
        }
        
        if (mapBtn) {
            mapBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                console.log('Map button clicked in main game');
                
                // Save global reference to this instance
                window.mainScene = this;
                
                // Check if we have a MapView instance
                if (!window.mapView) {
                    console.log('Creating new MapView');
                    window.mapView = new MapView();
                } else {
                    console.log('Using existing MapView instance');
                }
                
                // Show the map
                window.mapView.show();
            });
        }

        if (tasksBtn) {
            tasksBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openQuestsModal();
            });
        }

        // Обработчик для кнопки продолжения диалога
        if (this.elements.dialogContinueBtn) {
            this.elements.dialogContinueBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.continueDialog();
            });
        }

        // Обработчики для модальных окон
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    /**
     * Показывает основную игровую область и полностью сбрасывает все стили
     */
    showGameArea() {
        console.log('MainScene.showGameArea called - completely resetting styles');
        
        // First, show and reset the game area and its components
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.style.display = 'flex';
            gameArea.style.visibility = 'visible';
            gameArea.style.position = 'relative';
        }
        
        // Make sure buildings container is visible
        const buildingsContainer = document.querySelector('.buildings-container');
        if (buildingsContainer) {
            buildingsContainer.style.display = 'block';
            buildingsContainer.style.visibility = 'visible';
        }
        
        // Reset all building rows to original styles
        const buildingsRows = document.querySelectorAll('.buildings-row');
        if (buildingsRows) {
            buildingsRows.forEach(row => {
                row.style.display = 'flex';
                row.style.visibility = 'visible';
            });
        }
        
        // Keep top bar always visible with high z-index
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            topBar.style.display = 'flex';
            topBar.style.zIndex = '1000';
            topBar.style.position = 'fixed';
        }
        
        const energyContainer = document.querySelector('.energy-container');
        if (energyContainer) {
            energyContainer.style.display = 'flex';
            energyContainer.style.zIndex = '1000';
            energyContainer.style.position = 'fixed';
        }
        
        const bottomMenu = document.querySelector('.bottom-menu');
        if (bottomMenu) {
            bottomMenu.style.display = 'grid';
            bottomMenu.style.visibility = 'visible';
            bottomMenu.style.position = 'fixed';
        }
        
        // Reset the map button specifically
        const mapBtn = bottomMenu?.querySelector('#map-btn');
        if (mapBtn) {
            mapBtn.style.position = 'absolute';
            mapBtn.style.top = '-20px';
            mapBtn.style.left = '50%';
            mapBtn.style.transform = 'translateX(-50%)';
            
            const icon = mapBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-map-marked-alt';
            }
            
            const span = mapBtn.querySelector('span');
            if (span) {
                span.textContent = 'Map';
            }
        }
        
        // Finally, hide both map containers
        const regionMapContainer = document.getElementById('region-map-container');
        if (regionMapContainer) {
            regionMapContainer.style.display = 'none';
            regionMapContainer.style.visibility = 'hidden';
            regionMapContainer.style.zIndex = '-1';
        }
        
        const cityMapContainer = document.getElementById('city-map-container');
        if (cityMapContainer) {
            cityMapContainer.style.display = 'none';
            cityMapContainer.style.visibility = 'hidden';
            cityMapContainer.style.zIndex = '-1';
        }
        
        // Restore original forest and pond styles if they exist
        const forest = document.getElementById('forest');
        if (forest) {
            if (window.originalForestStyles) {
                console.log('Restoring original forest styles from window storage');
                Object.assign(forest.style, window.originalForestStyles);
                // Make forest visible since we're showing the game area
                forest.style.display = 'block';
                forest.style.visibility = 'visible';
            } else {
                // Default style
                forest.style.display = 'block';
                forest.style.visibility = 'visible';
            }
        }
        
        const pond = document.getElementById('pond');
        if (pond) {
            if (window.originalPondStyles) {
                console.log('Restoring original pond styles from window storage');
                Object.assign(pond.style, window.originalPondStyles);
                // Make pond visible since we're showing the game area
                pond.style.display = 'block';
                pond.style.visibility = 'visible';
            } else {
                // Default style
                pond.style.display = 'block';
                pond.style.visibility = 'visible';
            }
        }
        
        // Reset the main container last
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.display = 'flex';
            gameContainer.style.visibility = 'visible';
        }
        
        console.log('Game area displayed with reset styles');
    }
    
    /**
     * Открывает модальное окно магазина
     */
    openShopModal() {
        // Создаем модальное окно для магазина
        const shopModal = document.createElement('div');
        shopModal.className = 'modal';
        shopModal.id = 'shop-modal';
        
        shopModal.innerHTML = `
            <div class="modal-content shop-modal">
                <div class="modal-header">
                    <h3>Магазин</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="shop-info">
                    <div class="shop-character">
                        <div class="character-image trader-image"></div>
                        <div class="character-name">Купец Феликс</div>
                    </div>
                    <div class="shop-message">
                        <p>Мяу-приветствую! Здесь ты сможешь улучшить своё поселение.</p>
                    </div>
                    <div class="shop-items">
                        <div class="shop-item">
                            <div class="shop-item-image potion-image"></div>
                            <div class="shop-item-info">
                                <h4>Зелье энергии</h4>
                                <p>+20 к энергии</p>
                                <div class="shop-item-price">
                                    <span>10</span>
                                    <div class="resource-icon coins-icon small"></div>
                                </div>
                            </div>
                            <button class="btn-small">Купить</button>
                        </div>
                        <div class="shop-item">
                            <div class="shop-item-image cat-food-image"></div>
                            <div class="shop-item-info">
                                <h4>Корм для кошек</h4>
                                <p>+5 корма для кошек</p>
                                <div class="shop-item-price">
                                    <span>5</span>
                                    <div class="resource-icon coins-icon small"></div>
                                </div>
                            </div>
                            <button class="btn-small">Купить</button>
                        </div>
                        <div class="shop-item">
                            <div class="shop-item-image decoration-image"></div>
                            <div class="shop-item-info">
                                <h4>Украшение</h4>
                                <p>Красивый шарик для котов</p>
                                <div class="shop-item-price">
                                    <span>15</span>
                                    <div class="resource-icon coins-icon small"></div>
                                </div>
                            </div>
                            <button class="btn-small">Купить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем стили для магазина
        const style = document.createElement('style');
        style.textContent = `
            .shop-modal {
                max-width: 380px;
            }
            
            .shop-info {
                padding: 15px;
            }
            
            .shop-character {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .trader-image {
                width: 50px;
                height: 50px;
                background-color: #f0f0f0;
                border-radius: 50%;
            }
            
            .character-name {
                font-weight: bold;
                color: #333;
            }
            
            .shop-message {
                background: #f5f5f5;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-size: 14px;
            }
            
            .shop-items {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .shop-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .shop-item-image {
                width: 40px;
                height: 40px;
                background-color: #e0e0e0;
                border-radius: 6px;
            }
            
            .shop-item-info {
                flex: 1;
            }
            
            .shop-item-info h4 {
                margin: 0 0 3px 0;
                font-size: 14px;
            }
            
            .shop-item-info p {
                margin: 0 0 5px 0;
                font-size: 12px;
                color: #666;
            }
            
            .shop-item-price {
                display: flex;
                align-items: center;
                gap: 4px;
                font-weight: bold;
                color: #4CAF50;
            }
            
            .potion-image {
                background-color: #E1F5FE;
            }
            
            .cat-food-image {
                background-color: #FFF3E0;
            }
            
            .decoration-image {
                background-color: #F3E5F5;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(shopModal);
        
        // Добавляем обработчик для закрытия
        const closeButton = shopModal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                shopModal.remove();
            });
        }
        
        // Показываем модальное окно
        shopModal.style.display = 'flex';
    }

    /**
     * Переключает отображение панели с кошками
     */
    toggleCatsPanel() {
        const catsPanel = document.querySelector('.cats-panel');
        if (!catsPanel) return;

        const isVisible = catsPanel.style.display === 'block';
        
        // Если панель была скрыта, показываем её
        if (!isVisible) {
            catsPanel.style.display = 'block';
            // Обновляем информацию о кошках
            if (window.catsManager) {
                window.catsManager.updateDisplay();
            }

            // Добавляем обработчик для закрытия по клику вне панели
            document.addEventListener('mousedown', this.handleOutsideClick);
        } else {
            catsPanel.style.display = 'none';
            // Удаляем обработчик при закрытии панели
            document.removeEventListener('mousedown', this.handleOutsideClick);
        }
    }

    /**
     * Открывает модальное окно торговли
     */
    openTradeModal() {
        // Проверяем, построен ли ларек
        if (window.buildingsManager && window.buildingsManager.buildings.market.level === 0) {
            this.showMessage('Сначала нужно построить ларек!');
            return;
        }
        
        // Показываем модальное окно
        if (this.elements.tradeModal) {
            // Обновляем содержимое модального окна
            this.elements.tradeModal.innerHTML = `
                <div class="modal-content trade-modal">
                    <div class="modal-header">
                        <h3>Обмен ресурсов</h3>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="trade-info">
                        <div class="trade-sections">
                            <div class="trade-section">
                                <h4>Продать ресурсы</h4>
                                <div class="trade-options-compact">
                                    <div class="trade-option-compact">
                                        <div class="trade-option-header">
                                            <div class="resource-icon wood-icon small"></div>
                                            <span>5 дерева → 2</span>
                                            <div class="resource-icon coins-icon small"></div>
                                        </div>
                                        <div class="trade-option-controls">
                                            <button class="quantity-btn" id="wood-quantity-minus">-</button>
                                            <span id="wood-quantity">1</span>
                                            <button class="quantity-btn" id="wood-quantity-plus">+</button>
                                            <button id="wood-sell-btn" class="btn-small">Продать</button>
                                        </div>
                                    </div>
                                    
                                    <div class="trade-option-compact">
                                        <div class="trade-option-header">
                                            <div class="resource-icon fish-icon small"></div>
                                            <span>5 рыбы → 3</span>
                                            <div class="resource-icon coins-icon small"></div>
                                        </div>
                                        <div class="trade-option-controls">
                                            <button class="quantity-btn" id="fish-quantity-minus">-</button>
                                            <span id="fish-quantity">1</span>
                                            <button class="quantity-btn" id="fish-quantity-plus">+</button>
                                            <button id="fish-sell-btn" class="btn-small">Продать</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="trade-section">
                                <h4>Купить ресурсы</h4>
                                <div class="trade-options-compact">
                                    <div class="trade-option-compact">
                                        <div class="trade-option-header">
                                            <div class="resource-icon coins-icon small"></div>
                                            <span>1 монета → 3</span>
                                            <div class="resource-icon wood-icon small"></div>
                                        </div>
                                        <div class="trade-option-controls">
                                            <button class="quantity-btn" id="wood-buy-quantity-minus">-</button>
                                            <span id="wood-buy-quantity">1</span>
                                            <button class="quantity-btn" id="wood-buy-quantity-plus">+</button>
                                            <button id="wood-buy-btn" class="btn-small">Купить</button>
                                        </div>
                                    </div>
                                    
                                    <div class="trade-option-compact">
                                        <div class="trade-option-header">
                                            <div class="resource-icon coins-icon small"></div>
                                            <span>1 монета → 2</span>
                                            <div class="resource-icon fish-icon small"></div>
                                        </div>
                                        <div class="trade-option-controls">
                                            <button class="quantity-btn" id="fish-buy-quantity-minus">-</button>
                                            <span id="fish-buy-quantity">1</span>
                                            <button class="quantity-btn" id="fish-buy-quantity-plus">+</button>
                                            <button id="fish-buy-btn" class="btn-small">Купить</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Добавляем стили для компактного отображения
            const style = document.createElement('style');
            style.textContent = `
                .trade-modal {
                    max-width: 360px;
                }
                
                .trade-sections {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .trade-section {
                    background: #f9f9f9;
                    border-radius: 8px;
                    padding: 10px;
                }
                
                .trade-section h4 {
                    margin: 0 0 10px 0;
                    color: #4CAF50;
                    font-size: 14px;
                    text-align: center;
                }
                
                .trade-options-compact {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .trade-option-compact {
                    background: #fff;
                    border-radius: 6px;
                    padding: 8px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                
                .trade-option-header {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                
                .trade-option-controls {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .quantity-btn {
                    width: 22px;
                    height: 22px;
                    font-size: 14px;
                    padding: 0;
                    line-height: 1;
                }
                
                .btn-small {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-left: auto;
                }
                
                .btn-small:hover {
                    background: #45a049;
                }
            `;
            document.head.appendChild(style);
            
            this.elements.tradeModal.style.display = 'flex';
            
            // Добавляем обработчики событий для кнопок продажи и покупки
            this.addTradeEventListeners();
        }
    }
    
    /**
     * Добавляет обработчики событий для торговли
     */
    addTradeEventListeners() {
        // Кнопки изменения количества для продажи дерева
        const woodQuantityMinus = document.getElementById('wood-quantity-minus');
        const woodQuantityPlus = document.getElementById('wood-quantity-plus');
        const woodQuantity = document.getElementById('wood-quantity');
        
        if (woodQuantityMinus && woodQuantityPlus && woodQuantity) {
            woodQuantityMinus.addEventListener('click', () => {
                let qty = parseInt(woodQuantity.textContent);
                if (qty > 1) {
                    qty--;
                    woodQuantity.textContent = qty;
                }
            });
            
            woodQuantityPlus.addEventListener('click', () => {
                let qty = parseInt(woodQuantity.textContent);
                qty++;
                woodQuantity.textContent = qty;
            });
        }
        
        // Кнопки изменения количества для продажи рыбы
        const fishQuantityMinus = document.getElementById('fish-quantity-minus');
        const fishQuantityPlus = document.getElementById('fish-quantity-plus');
        const fishQuantity = document.getElementById('fish-quantity');
        
        if (fishQuantityMinus && fishQuantityPlus && fishQuantity) {
            fishQuantityMinus.addEventListener('click', () => {
                let qty = parseInt(fishQuantity.textContent);
                if (qty > 1) {
                    qty--;
                    fishQuantity.textContent = qty;
                }
            });
            
            fishQuantityPlus.addEventListener('click', () => {
                let qty = parseInt(fishQuantity.textContent);
                qty++;
                fishQuantity.textContent = qty;
            });
        }
        
        // Кнопки изменения количества для покупки дерева
        const woodBuyQuantityMinus = document.getElementById('wood-buy-quantity-minus');
        const woodBuyQuantityPlus = document.getElementById('wood-buy-quantity-plus');
        const woodBuyQuantity = document.getElementById('wood-buy-quantity');
        
        if (woodBuyQuantityMinus && woodBuyQuantityPlus && woodBuyQuantity) {
            woodBuyQuantityMinus.addEventListener('click', () => {
                let qty = parseInt(woodBuyQuantity.textContent);
                if (qty > 1) {
                    qty--;
                    woodBuyQuantity.textContent = qty;
                }
            });
            
            woodBuyQuantityPlus.addEventListener('click', () => {
                let qty = parseInt(woodBuyQuantity.textContent);
                qty++;
                woodBuyQuantity.textContent = qty;
            });
        }
        
        // Кнопки изменения количества для покупки рыбы
        const fishBuyQuantityMinus = document.getElementById('fish-buy-quantity-minus');
        const fishBuyQuantityPlus = document.getElementById('fish-buy-quantity-plus');
        const fishBuyQuantity = document.getElementById('fish-buy-quantity');
        
        if (fishBuyQuantityMinus && fishBuyQuantityPlus && fishBuyQuantity) {
            fishBuyQuantityMinus.addEventListener('click', () => {
                let qty = parseInt(fishBuyQuantity.textContent);
                if (qty > 1) {
                    qty--;
                    fishBuyQuantity.textContent = qty;
                }
            });
            
            fishBuyQuantityPlus.addEventListener('click', () => {
                let qty = parseInt(fishBuyQuantity.textContent);
                qty++;
                fishBuyQuantity.textContent = qty;
            });
        }
        
        // Кнопка продажи дерева
        const woodSellBtn = document.getElementById('wood-sell-btn');
        if (woodSellBtn) {
            woodSellBtn.addEventListener('click', () => {
                this.sellWoodForCoins();
            });
        }
        
        // Кнопка продажи рыбы
        const fishSellBtn = document.getElementById('fish-sell-btn');
        if (fishSellBtn) {
            fishSellBtn.addEventListener('click', () => {
                this.sellFishForCoins();
            });
        }
        
        // Кнопка покупки дерева
        const woodBuyBtn = document.getElementById('wood-buy-btn');
        if (woodBuyBtn) {
            woodBuyBtn.addEventListener('click', () => {
                this.buyWoodWithCoins();
            });
        }
        
        // Кнопка покупки рыбы
        const fishBuyBtn = document.getElementById('fish-buy-btn');
        if (fishBuyBtn) {
            fishBuyBtn.addEventListener('click', () => {
                this.buyFishWithCoins();
            });
        }
    }
    
    /**
     * Продажа дерева за монеты
     */
    sellWoodForCoins() {
        if (!window.resourcesManager) {
            this.showMessage('Ошибка: не найден менеджер ресурсов');
            return;
        }
        
        const woodPerTrade = 5; // Дерева за 1 операцию
        const coinsPerTrade = 2; // Монет за 1 операцию
        
        const quantityElement = document.getElementById('wood-quantity');
        const quantity = parseInt(quantityElement?.textContent || '1');
        
        const woodNeeded = woodPerTrade * quantity;
        const coinsToAdd = coinsPerTrade * quantity;
        
        if (window.resourcesManager.resources.wood.amount < woodNeeded) {
            this.showMessage(`Недостаточно дерева! Нужно ${woodNeeded}`);
            return;
        }
        
        // Обновляем ресурсы
        window.resourcesManager.resources.wood.amount -= woodNeeded;
        window.resourcesManager.resources.coins.amount += coinsToAdd;
        window.resourcesManager.updateDisplay();
        
        this.showMessage(`Продано ${woodNeeded} дерева за ${coinsToAdd} монет`);
    }
    
    /**
     * Продажа рыбы за монеты
     */
    sellFishForCoins() {
        if (!window.resourcesManager) {
            this.showMessage('Ошибка: не найден менеджер ресурсов');
            return;
        }
        
        const fishPerTrade = 5; // Рыбы за 1 операцию
        const coinsPerTrade = 3; // Монет за 1 операцию
        
        const quantityElement = document.getElementById('fish-quantity');
        const quantity = parseInt(quantityElement?.textContent || '1');
        
        const fishNeeded = fishPerTrade * quantity;
        const coinsToAdd = coinsPerTrade * quantity;
        
        if (window.resourcesManager.resources.fish.amount < fishNeeded) {
            this.showMessage(`Недостаточно рыбы! Нужно ${fishNeeded}`);
            return;
        }
        
        // Обновляем ресурсы
        window.resourcesManager.resources.fish.amount -= fishNeeded;
        window.resourcesManager.resources.coins.amount += coinsToAdd;
        window.resourcesManager.updateDisplay();
        
        this.showMessage(`Продано ${fishNeeded} рыбы за ${coinsToAdd} монет`);
    }
    
    /**
     * Покупка дерева за монеты
     */
    buyWoodWithCoins() {
        if (!window.resourcesManager) {
            this.showMessage('Ошибка: не найден менеджер ресурсов');
            return;
        }
        
        const coinsPerTrade = 1; // Монет за 1 операцию
        const woodPerTrade = 3; // Дерева за 1 операцию
        
        const quantityElement = document.getElementById('wood-buy-quantity');
        const quantity = parseInt(quantityElement?.textContent || '1');
        
        const coinsNeeded = coinsPerTrade * quantity;
        const woodToAdd = woodPerTrade * quantity;
        
        if (window.resourcesManager.resources.coins.amount < coinsNeeded) {
            this.showMessage(`Недостаточно монет! Нужно ${coinsNeeded}`);
            return;
        }
        
        // Проверяем, не превысит ли количество дерева лимит хранилища
        if (window.resourcesManager.resources.wood.amount + woodToAdd > window.resourcesManager.resources.wood.limit) {
            this.showMessage('Недостаточно места в хранилище!');
            return;
        }
        
        // Обновляем ресурсы
        window.resourcesManager.resources.coins.amount -= coinsNeeded;
        window.resourcesManager.resources.wood.amount += woodToAdd;
        window.resourcesManager.updateDisplay();
        
        this.showMessage(`Куплено ${woodToAdd} дерева за ${coinsNeeded} монет`);
    }
    
    /**
     * Покупка рыбы за монеты
     */
    buyFishWithCoins() {
        if (!window.resourcesManager) {
            this.showMessage('Ошибка: не найден менеджер ресурсов');
            return;
        }
        
        const coinsPerTrade = 1; // Монет за 1 операцию
        const fishPerTrade = 2; // Рыбы за 1 операцию
        
        const quantityElement = document.getElementById('fish-buy-quantity');
        const quantity = parseInt(quantityElement?.textContent || '1');
        
        const coinsNeeded = coinsPerTrade * quantity;
        const fishToAdd = fishPerTrade * quantity;
        
        if (window.resourcesManager.resources.coins.amount < coinsNeeded) {
            this.showMessage(`Недостаточно монет! Нужно ${coinsNeeded}`);
            return;
        }
        
        // Проверяем, не превысит ли количество рыбы лимит хранилища
        if (window.resourcesManager.resources.fish.amount + fishToAdd > window.resourcesManager.resources.fish.limit) {
            this.showMessage('Недостаточно места в хранилище!');
            return;
        }
        
        // Обновляем ресурсы
        window.resourcesManager.resources.coins.amount -= coinsNeeded;
        window.resourcesManager.resources.fish.amount += fishToAdd;
        window.resourcesManager.updateDisplay();
        
        this.showMessage(`Куплено ${fishToAdd} рыбы за ${coinsNeeded} монет`);
    }

    /**
     * Открывает модальное окно заданий
     */
    openQuestsModal() {
        // Remove existing modal if it exists
        const existingModal = document.getElementById('quests-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create a new modal each time
        const modal = document.createElement('div');
        modal.id = 'quests-modal';
        modal.className = 'modal';
        
        // Determine which quests are completed
        const houseCompleted = window.buildingsManager?.buildings?.mainHouse?.level > 0;
        const marketCompleted = window.buildingsManager?.buildings?.market?.level > 0;
        const guestHouseCompleted = window.buildingsManager?.buildings?.guestHouse?.level > 0;
        const resourcesCompleted = 
            window.resourcesManager?.resources?.wood?.amount >= 100 && 
            window.resourcesManager?.resources?.fish?.amount >= 100;
        
        // Create HTML with completed status already set
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Задания</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="quest-list">
                        <div class="quest-item ${houseCompleted ? 'completed' : ''}" id="quest-build-house">
                            <div class="quest-info">
                                <h3>Дом</h3>
                                <p>Построй свой первый дом</p>
                                <div class="quest-reward">Награда: 50 монет</div>
                            </div>
                            <button class="grab-reward" data-reward="50" style="${houseCompleted ? 'display: block' : 'display: none'}">Забрать награду</button>
                        </div>
                        <div class="quest-item ${marketCompleted ? 'completed' : ''}" id="quest-build-market">
                            <div class="quest-info">
                                <h3>Рынок</h3>
                                <p>Построй рынок для торговли</p>
                                <div class="quest-reward">Награда: 100 монет</div>
                            </div>
                            <button class="grab-reward" data-reward="100" style="${marketCompleted ? 'display: block' : 'display: none'}">Забрать награду</button>
                        </div>
                        <div class="quest-item ${guestHouseCompleted ? 'completed' : ''}" id="quest-build-guest-house">
                            <div class="quest-info">
                                <h3>Гостевой дом</h3>
                                <p>Построй гостевой дом для котов</p>
                                <div class="quest-reward">Награда: 150 монет</div>
                            </div>
                            <button class="grab-reward" data-reward="150" style="${guestHouseCompleted ? 'display: block' : 'display: none'}">Забрать награду</button>
                        </div>
                        <div class="quest-item ${resourcesCompleted ? 'completed' : ''}" id="quest-collect-resources">
                            <div class="quest-info">
                                <h3>Ресурсы</h3>
                                <p>Собери 100 дерева и 100 рыбы</p>
                                <div class="quest-reward">Награда: 200 монет</div>
                            </div>
                            <button class="grab-reward" data-reward="200" style="${resourcesCompleted ? 'display: block' : 'display: none'}">Забрать награду</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .quest-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
            }
            .quest-item {
                background: #f5f5f5;
                border-radius: 8px;
                padding: 12px;
                border-left: 4px solid #4CAF50;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            }
            .quest-item.completed {
                background: #E8F5E9;
                border-left-color: #2E7D32;
            }
            .quest-item.claimed {
                opacity: 0.6;
            }
            .quest-info {
                flex: 1;
                min-width: 0;
            }
            .quest-item h3 {
                margin: 0 0 4px 0;
                color: #333;
                font-size: 14px;
            }
            .quest-item p {
                margin: 0 0 4px 0;
                color: #666;
                font-size: 12px;
            }
            .quest-reward {
                color: #4CAF50;
                font-weight: bold;
                font-size: 12px;
            }
            .grab-reward {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                white-space: nowrap;
                font-size: 12px;
                min-width: 120px;
            }
            .grab-reward:hover {
                background: #45a049;
            }
            .grab-reward:disabled {
                background: #cccccc;
                cursor: not-allowed;
            }
            .modal-content {
                width: 90%;
                max-width: 400px;
                max-height: 80vh;
                overflow-y: auto;
            }
            /* Override any conflicting styles */
            .quest-item.completed .grab-reward {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);

        // Add close button handler
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Add reward claim handlers
        const grabButtons = modal.querySelectorAll('.grab-reward');
        grabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const reward = parseInt(button.dataset.reward);
                const questItem = button.closest('.quest-item');
                
                if (window.resourcesManager) {
                    // Add coins to the player
                    window.resourcesManager.resources.coins.amount += reward;
                    window.resourcesManager.updateDisplay();
                    
                    // Mark quest as claimed
                    questItem.classList.add('claimed');
                    button.style.display = 'none';
                    
                    // Show success message
                    this.showMessage(`Получено ${reward} монет!`);
                }
            });
        });

        // Add to document and show
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Log information for debugging
        console.log('Quest completion status:');
        console.log('House completed:', houseCompleted);
        console.log('Market completed:', marketCompleted);
        console.log('Guest House completed:', guestHouseCompleted);
        console.log('Resources completed:', resourcesCompleted);
    }

    /**
     * Открывает модальное окно лидерборда
     */
    openLeaderboardModal() {
        this.showMessage('Лидерборд будет доступен в следующем обновлении!');
    }

    /**
     * Инициализация игры
     */
    async initialize() {
        console.log('Инициализация главной сцены...');
        
        try {
            // Set global reference to this instance
            window.mainScene = this;
            console.log('Set global mainScene reference');
            
            // Показываем загрузочный экран
            this.showLoadingScreen(0);
            
            // Проверка авторизации в Telegram
            this.showLoadingScreen(20);
            await this.checkTelegramAuth();
            
            // Загрузка данных пользователя
            this.showLoadingScreen(40);
            await this.loadUserData();
            
            // Обновляем интерфейс игрока с загруженными данными
            this.updatePlayerInterface();
            
            // Инициализация ресурсов и построек
            this.showLoadingScreen(60);
            this.initializeGameComponents();
            
            // Проверка статуса туториала
            this.showLoadingScreen(80);
            await this.checkTutorialStatus();
            
            // Завершение загрузки
            this.showLoadingScreen(100);
            
            // Скрываем загрузочный экран и показываем игру
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showGameContainer();
                
                // Если туториал не завершен, показываем первый диалог
                if (!this.tutorialCompleted && this.tutorialQueue.length > 0) {
                    this.showDialog(this.tutorialQueue[0]);
                }
                
                // Запускаем интервал восстановления энергии
                this.startEnergyRegeneration();
            }, 500);
            
            this.initialized = true;
            console.log('Инициализация завершена');
        } catch (error) {
            console.error('Ошибка при инициализации:', error);
            this.showMessage('Произошла ошибка при загрузке игры');
        }
    }

    /**
     * Запуск восстановления энергии
     */
    startEnergyRegeneration() {
        // Очищаем предыдущий интервал, если есть
        if (this.energyInterval) {
            clearInterval(this.energyInterval);
        }
        
        // Запускаем новый интервал восстановления энергии
        this.energyInterval = setInterval(() => {
            if (this.playerData.energy < this.playerData.maxEnergy) {
                this.playerData.energy += 1;
                this.updateEnergyBar();
            }
        }, 10000); // Восстанавливаем 1 энергию каждые 10 секунд
    }

    /**
     * Обновление полосы энергии
     */
    updateEnergyBar() {
        if (this.elements.energyBar) {
            const percentage = (this.playerData.energy / this.playerData.maxEnergy) * 100;
            this.elements.energyBar.style.width = `${percentage}%`;
            
            // Dynamic coloring based on energy level
            if (percentage <= 20) {
                // Red for low energy
                this.elements.energyBar.style.background = 'linear-gradient(to right, #f44336, #ff5252)';
            } else if (percentage <= 50) {
                // Orange/Yellow for medium energy
                this.elements.energyBar.style.background = 'linear-gradient(to right, #FFA000, #FFC107)';
            } else {
                // Green for high energy
                this.elements.energyBar.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)';
            }
        }
        
        if (this.elements.energyText) {
            this.elements.energyText.textContent = `${this.playerData.energy}/${this.playerData.maxEnergy}`;
            
            // Highlight text if energy is low
            if (percentage <= 20) {
                this.elements.energyText.style.color = '#f44336';
            } else {
                this.elements.energyText.style.color = '#333';
            }
        }
    }

    /**
     * Показывает загрузочный экран с прогрессом
     * @param {number} progress - Процент загрузки (0-100)
     */
    showLoadingScreen(progress) {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.style.display = 'flex';
        }
        if (this.elements.loadingBar) {
            this.elements.loadingBar.style.width = `${progress}%`;
        }
    }

    /**
     * Скрывает загрузочный экран
     */
    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.style.display = 'none';
        }
    }

    /**
     * Показывает игровой контейнер
     */
    showGameContainer() {
        if (this.elements.gameContainer) {
            this.elements.gameContainer.style.display = 'flex';
            
            // Обновляем интерфейс игрока при показе игрового контейнера
            this.updatePlayerInterface();
        }
    }

    /**
     * Проверка авторизации в Telegram
     */
    async checkTelegramAuth() {
        // Проверяем, запущено ли приложение в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            console.log('Приложение запущено в Telegram WebApp');
            
            // Инициализируем Telegram WebApp
            const webApp = window.Telegram.WebApp;
            webApp.expand();
            
            // Получаем данные пользователя
            const user = webApp.initDataUnsafe.user;
            
            if (user && user.id) {
                console.log('Пользователь Telegram авторизован:', user.id);
                
                // Сохраняем ID пользователя
                storage.saveTelegramId(user.id.toString());
                
                // Отправляем данные на сервер для аутентификации
                try {
                    const userData = {
                        telegramId: user.id.toString(),
                        username: user.username || '',
                        firstName: user.first_name || '',
                        lastName: user.last_name || ''
                    };
                    
                    await api.authUser(userData);
                } catch (error) {
                    console.error('Ошибка при аутентификации пользователя:', error);
                    // В случае ошибки, пробуем получить сохраненный ID
                }
            } else {
                console.log('Данные пользователя отсутствуют');
                this.useDemoAccount();
            }
        } else {
            console.log('Приложение запущено вне Telegram WebApp');
            this.useDemoAccount();
        }
    }

    /**
     * Использовать демо-аккаунт для тестирования
     */
    useDemoAccount() {
        console.log('Используем демо-аккаунт для тестирования');
        
        // Генерируем уникальный ID для демо-аккаунта
        const demoId = 'demo_' + Date.now().toString();
        storage.saveTelegramId(demoId);
        
        // Регистрируем демо-аккаунт на сервере
        api.authUser({
            telegramId: demoId,
            username: 'demo_user',
            firstName: 'Demo',
            lastName: 'User'
        }).catch(error => {
            console.error('Ошибка при регистрации демо-аккаунта:', error);
        });
    }

    /**
     * Загрузка данных пользователя с сервера
     */
    async loadUserData() {
        const telegramId = storage.getTelegramId();
        if (!telegramId) {
            console.error('Telegram ID не найден');
            return;
        }
        
        try {
            const response = await api.getUser(telegramId);
            
            if (response && response.user) {
                // Сохраняем данные пользователя
                storage.saveUserData(response.user);
                
                // Обновляем локальные данные
                this.playerData.level = response.user.level || 1;
                this.playerData.experience = response.user.experience || 0;
                this.playerData.tutorialCompleted = response.user.tutorialCompleted || false;
                this.playerData.stars = response.user.stars || 0;
                this.playerData.energy = response.user.energy || 100;
                this.playerData.maxEnergy = response.user.maxEnergy || 100;
                
                // Если у пользователя есть имя, обновляем его
                if (response.user.username) {
                    this.playerData.name = response.user.username;
                } else if (response.user.firstName) {
                    this.playerData.name = response.user.firstName;
                }
                
                console.log('Данные пользователя загружены:', response.user);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
            
            // В случае ошибки, пробуем использовать локальные данные
            const userData = storage.getUserData();
            if (userData) {
                this.playerData.level = userData.level || 1;
                this.playerData.experience = userData.experience || 0;
                this.playerData.tutorialCompleted = userData.tutorialCompleted || false;
                this.playerData.stars = userData.stars || 0;
                this.playerData.energy = userData.energy || 100;
                this.playerData.maxEnergy = userData.maxEnergy || 100;
                
                if (userData.username) {
                    this.playerData.name = userData.username;
                } else if (userData.firstName) {
                    this.playerData.name = userData.firstName;
                }
            }
        }
    }

    /**
     * Инициализация игровых компонентов
     */
    async initializeGameComponents() {
        try {
            // Clear any existing map managers
            if (window.regionMapManager) {
                // Try to remove any existing DOM elements from the old manager
                try {
                    const oldContainer = document.getElementById('region-map-container');
                    if (oldContainer) {
                        oldContainer.remove();
                    }
                } catch (error) {
                    console.error('Error cleaning up old region map:', error);
                }
            }
            
            if (this.cityMapManager) {
                // Try to remove any existing DOM elements from the old manager
                try {
                    const oldContainer = document.getElementById('city-map-container');
                    if (oldContainer) {
                        oldContainer.remove();
                    }
                } catch (error) {
                    console.error('Error cleaning up old city map:', error);
                }
            }
            
            // Initialize fresh managers
            this.cityMapManager = new CityMapManager();
            window.regionMapManager = new RegionMapManager();
            this.regionMapManager = window.regionMapManager;
            
            // Initialize event listeners for managers
            if (this.cityMapManager) {
                this.cityMapManager.initEventListeners();
            }
            
            if (this.regionMapManager) {
                this.regionMapManager.initEventListeners();
            }
            
            // Update manager states
            if (this.playerData) {
                if (this.cityMapManager) {
                    this.cityMapManager.updateBuildingsState(this.playerData);
                }
                
                if (this.regionMapManager && typeof this.regionMapManager.updateRegionsState === 'function') {
                    this.regionMapManager.updateRegionsState(this.playerData);
                }
            }
            
            console.log('Game components initialized successfully');
        } catch (error) {
            console.error('Error initializing game components:', error);
            throw error;
        }
    }

    /**
     * Обновление интерфейса игрока (имя, звезды, энергия)
     */
    updatePlayerInterface() {
        // Обновляем имя игрока
        if (this.elements.playerName) {
            this.elements.playerName.textContent = this.playerData.name;
        }
        
        // Обновляем звезды - получаем из менеджера кошек только если есть Мурчальня
        if (this.elements.playerStars) {
            let starCount = 0;
            
            // Проверяем, построена ли Мурчальня (cathouse)
            const cathouseBuilt = window.buildingsManager && 
                                  window.buildingsManager.buildings && 
                                  window.buildingsManager.buildings.cathouse && 
                                  window.buildingsManager.buildings.cathouse.level > 0;
            
            // Получаем звезды только если построена Мурчальня
            if (cathouseBuilt && window.catsManager && typeof window.catsManager.getTotalStars === 'function') {
                starCount = window.catsManager.getTotalStars();
            } else {
                // Если Мурчальня не построена, звезд 0
                starCount = 0;
            }
            
            // Обновляем отображение
            this.elements.playerStars.textContent = starCount;
            
            // Также обновляем данные игрока
            this.playerData.stars = starCount;
        }
        
        // Обновляем энергию
        this.updateEnergyBar();
    }

    /**
     * Проверка статуса туториала
     */
    async checkTutorialStatus() {
        // Получаем статус из хранилища
        this.tutorialCompleted = storage.getTutorialStatus();
        
        // Также проверяем статус в данных пользователя
        if (this.playerData.tutorialCompleted) {
            this.tutorialCompleted = true;
        }
        
        console.log('Статус туториала:', this.tutorialCompleted ? 'завершен' : 'не завершен');
    }

    /**
     * Показывает диалоговое окно
     * @param {string} dialogId - Идентификатор диалога
     */
    showDialog(dialogId) {
        if (!dialogId || !this.dialogData[dialogId]) {
            console.error('Диалог не найден:', dialogId);
            return;
        }
        
        const dialog = this.dialogData[dialogId];
        this.currentDialog = dialogId;
        
        // Заполняем информацию о диалоге
        if (this.elements.dialogCharacterName) {
            this.elements.dialogCharacterName.textContent = dialog.character;
        }
        if (this.elements.dialogCharacterImage) {
            this.elements.dialogCharacterImage.style.backgroundImage = `url('${dialog.characterImage}')`;
        }
        if (this.elements.dialogText) {
            this.elements.dialogText.textContent = dialog.text;
        }
        
        // Показываем модальное окно
        if (this.elements.dialogModal) {
            this.elements.dialogModal.style.display = 'flex';
        }
        
        // Сохраняем состояние диалога
        storage.saveDialogState({ currentDialog: dialogId });
    }

    /**
     * Продолжение диалога (переход к следующему)
     */
    continueDialog() {
        // Закрываем текущий диалог
        if (this.elements.dialogModal) {
            this.elements.dialogModal.style.display = 'none';
        }
        
        // Убираем текущий диалог из очереди туториала
        if (!this.tutorialCompleted && this.currentDialog) {
            const index = this.tutorialQueue.indexOf(this.currentDialog);
            if (index !== -1) {
                this.tutorialQueue.splice(index, 1);
            }
        }
        
        // Если очередь туториала пуста, завершаем туториал
        if (!this.tutorialCompleted && this.tutorialQueue.length === 0) {
            this.completeTutorial();
        } else if (!this.tutorialCompleted && this.tutorialQueue.length > 0) {
            // Показываем следующий диалог
            setTimeout(() => {
                this.showDialog(this.tutorialQueue[0]);
            }, 500);
        }
        
        this.currentDialog = null;
        storage.saveDialogState(null);
    }

    /**
     * Завершение туториала
     */
    async completeTutorial() {
        try {
            console.log('Завершение туториала');
            
            const telegramId = storage.getTelegramId();
            if (!telegramId) {
                console.error('Telegram ID не найден');
                return;
            }
            
            // Отправляем запрос на сервер
            await api.completeTutorial(telegramId);
            
            // Обновляем локальный статус
            this.tutorialCompleted = true;
            storage.saveTutorialStatus(true);
            
            console.log('Туториал завершен');
        } catch (error) {
            console.error('Ошибка при завершении туториала:', error);
        }
    }

    /**
     * Обновление прогресса игрока
     * @param {Object} userData - Данные пользователя
     */
    updatePlayerProgress(userData) {
        if (!userData) return;
        
        // Обновляем данные игрока
        if (userData.level !== undefined) {
            this.playerData.level = userData.level;
        }
        
        if (userData.experience !== undefined) {
            this.playerData.experience = userData.experience;
        }
        
        if (userData.stars !== undefined) {
            this.playerData.stars = userData.stars;
        }
        
        if (userData.energy !== undefined) {
            this.playerData.energy = userData.energy;
        }
        
        if (userData.maxEnergy !== undefined) {
            this.playerData.maxEnergy = userData.maxEnergy;
        }
        
        // Обновляем интерфейс игрока
        this.updatePlayerInterface();
    }

    /**
     * Проверка определенных условий для прогресса сюжета
     */
    checkStoryProgression() {
        // Проверяем, завершен ли туториал
        if (!this.tutorialCompleted) return;
        
        // Получаем текущие уровни зданий
        const mainHouseLevel = buildingsManager ? buildingsManager.buildings.mainHouse.level : 0;
        const marketLevel = buildingsManager ? buildingsManager.buildings.market.level : 0;
        const guestHouseLevel = buildingsManager ? buildingsManager.buildings.guestHouse.level : 0;
        
        // Проверка условий для показа диалогов по сюжету
        if (mainHouseLevel === 1 && this.hasCatById('builderHarry') === false) {
            // Показываем диалог о первом коте
            this.showDialog('FIRST_CAT');
        } else if (mainHouseLevel === 1 && this.hasCatById('builderHarry') && marketLevel === 0) {
            // Показываем диалог о постройке ларька
            this.showDialog('MARKET_QUEST');
        } else if (marketLevel === 1 && guestHouseLevel === 0) {
            // Показываем диалог о постройке гостевого домика
            this.showDialog('GUEST_HOUSE_QUEST');
        } else if (guestHouseLevel === 1) {
            // Завершение первой фазы
            this.showDialog('PHASE_1_COMPLETE');
        }
    }

    /**
     * Проверка наличия кошки у игрока по ID
     * @param {string} catId - ID кошки
     * @returns {boolean} - Есть ли кошка у игрока
     */
    hasCatById(catId) {
        return catsManager ? catsManager.hasCat(catId) : false;
    }

    /**
     * Показывает сообщение пользователю
     * @param {string} message - Текст сообщения
     */
    showMessage(message) {
        if (!message) return;
        
        // Ищем существующий элемент или создаем новый
        let messageElement = document.getElementById('game-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'game-message';
            messageElement.className = 'game-message';
            document.body.appendChild(messageElement);
            
            // Добавляем стили для сообщений
            const style = document.createElement('style');
            style.textContent = `
                .game-message {
                    position: fixed;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    max-width: 80%;
                    text-align: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
                    opacity: 0;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Устанавливаем сообщение и показываем его
        messageElement.textContent = message;
        messageElement.style.animation = 'none';
        void messageElement.offsetWidth; // Перезагружаем анимацию
        messageElement.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
        messageElement.style.opacity = '1';
        
        // Скрываем сообщение через 3 секунды
        setTimeout(() => {
            messageElement.style.opacity = '0';
        }, 3000);
    }

    /**
     * Обработчик клика вне панели кошек
     * @param {Event} event - Событие клика
     */
    handleOutsideClick(event) {
        const catsPanel = document.querySelector('.cats-panel');
        const catsBtn = document.getElementById('cats-btn');
        
        // Проверяем, что панель существует и видима
        if (!catsPanel || catsPanel.style.display !== 'block') return;
        
        // Если клик был вне панели и не по кнопке открытия
        if (!catsPanel.contains(event.target) && !catsBtn.contains(event.target)) {
            this.toggleCatsPanel();
            event.stopPropagation();
        }
    }

    /**
     * Обработчик обновления здания
     * @param {string} buildingId - ID здания
     * @param {number} level - Новый уровень здания
     */
    onBuildingUpgraded(buildingId, level) {
        console.log(`Здание ${buildingId} улучшено до уровня ${level}`);
        
        // Если обновлена Мурчальня, обновляем интерфейс с звездами
        if (buildingId === 'cathouse') {
            this.updatePlayerInterface();
        }
        
        // Обновляем лимиты ресурсов
        if (window.resourcesManager) {
            window.resourcesManager.updateResourceLimits();
        }
    }
}

// Export the MainScene class
export default MainScene;