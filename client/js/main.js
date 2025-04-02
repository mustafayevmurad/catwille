/**
 * Основной файл приложения
 * Инициализирует игру и настраивает основные компоненты
 */

// Import MainScene and MapView
import MainScene from './scenes/main.js';
import MapView from './components/mapView.js';

// Глобальные переменные для менеджеров
window.resourcesManager = null;
window.buildingsManager = null;
window.catsManager = null;
window.storage = null;
window.api = null;
window.mainScene = null;

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    initGame().catch(error => {
        console.error('Failed to initialize game:', error);
        showErrorMessage('Произошла ошибка при загрузке игры. Пожалуйста, перезагрузите страницу.');
    });
});

/**
 * Инициализация игры
 */
async function initGame() {
    try {
        // Показываем загрузочный экран
        console.log('Catwille: Загрузка игры...');
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }

        // Инициализируем базовые компоненты
        console.log('Initializing managers...');
        
        // Initialize API service
        window.api = new ApiService();
        console.log('API service initialized');
        
        // Initialize storage
        window.storage = new StorageManager();
        console.log('Storage manager initialized');
        
        // Initialize resource manager
        window.resourcesManager = new ResourcesManager();
        console.log('Resources manager initialized');
        
        // Initialize buildings manager
        window.buildingsManager = new BuildingsManager();
        console.log('Buildings manager initialized');
        
        // Initialize cats manager
        window.catsManager = new CatsManager();
        console.log('Cats manager initialized');
        
        // Initialize map managers
        window.regionMapManager = new RegionMapManager();
        console.log('Region map manager initialized');

        // Initialize main scene
        console.log('Creating main scene...');
        window.mainScene = new MainScene();
        console.log('Main scene created');

        // Запускаем демо-режим
        console.log('Starting demo mode...');
        const demoData = {
            resources: {
                wood: { amount: 0, limit: 50 },
                fish: { amount: 0, limit: 50 },
                coins: { amount: 0 },
                energy: { amount: 100, limit: 100, lastRegeneration: null, regenerationTime: 10 * 1000, regenerationAmount: 1, nextRegeneration: Date.now() + 10 * 1000 },
                catFood: { amount: 0, limit: 50 }
            },
            buildings: {
                mainHouse: { level: 0, built: false },
                warehouse: { level: 0, built: false },
                cathouse: { level: 0, built: false },
                cart: { level: 0, built: false },
                farm: { level: 0, built: false },
                sawmill: { level: 0, built: false }
            },
            cats: [
                { catId: 'builderHarry', active: true },
                { catId: 'fisherMarina', active: false },
                { catId: 'merchantFelix', active: true },
                { catId: 'keeperOscar', active: false },
                { catId: 'mysticLuna', active: false },
                { catId: 'shadowKing', active: false },
                { catId: 'goldenEmperor', active: false }
            ],
            tutorial: { completed: false }
        };

        // Обновляем данные в менеджерах
        console.log('Updating managers with demo data...');
        window.resourcesManager.updateResources(demoData.resources);
        window.buildingsManager.updateBuildings(demoData.buildings);
        window.catsManager.updateCats(demoData.cats);

        // Инициализируем обработчики событий
        console.log('Initializing event listeners...');
        window.mainScene.initEventListeners();

        // Даем небольшую задержку для инициализации компонентов
        console.log('Waiting for components to initialize...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Скрываем загрузочный экран и показываем игру
        console.log('Showing game container...');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (gameContainer) {
            gameContainer.style.display = 'flex';
        }
        console.log('Game initialization complete!');

    } catch (error) {
        console.error('Ошибка при инициализации игры:', error);
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        showErrorMessage('Произошла ошибка при загрузке игры. Пожалуйста, перезагрузите страницу.');
        throw error;
    }
}

/**
 * Показывает сообщение об ошибке
 * @param {string} message - Текст сообщения
 */
function showErrorMessage(message) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    
    if (errorContainer && errorMessage) {
        errorMessage.textContent = message;
        errorContainer.style.display = 'flex';
    } else {
        alert(message);
    }
}

/**
 * Обработчик событий клавиатуры для разработки
 */
document.addEventListener('keydown', function(event) {
    // Только в режиме разработки (localhost)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return;
    }
    
    // Секретная комбинация для сброса прогресса (Ctrl+Shift+R)
    if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        if (confirm('Вы уверены, что хотите сбросить игровой прогресс? Это действие нельзя отменить.')) {
            storage.clearAll();
            window.location.reload();
        }
    }
    
    // Быстрая добавка ресурсов для тестирования (Ctrl+Shift+A)
    if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        if (resourcesManager) {
            // Добавляем по 50 каждого ресурса для тестирования
            resourcesManager.resources.wood.amount += 50;
            resourcesManager.resources.fish.amount += 50;
            resourcesManager.resources.coins.amount += 50;
            resourcesManager.updateDisplay();
            console.log('Добавлены ресурсы для тестирования');
        }
    }
});