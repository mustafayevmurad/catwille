/**
 * Сервис для взаимодействия с API сервера
 */
class ApiService {
    constructor() {
        this.baseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api' 
            : 'https://catwille-server.onrender.com/api';
        this.isDemo = false; // Отключаем демо-режим для реального взаимодействия с API
        console.log('ApiService initialized with URL:', this.baseUrl);
    }

    /**
     * Базовый метод для отправки запросов
     * @param {string} endpoint - Конечная точка API
     * @param {Object} options - Опции запроса
     * @returns {Promise<Object>} - Ответ от сервера
     */
    async fetchApi(endpoint, options = {}) {
        console.log('ApiService.fetchApi called:', { endpoint, options });
        
        // В демо-режиме возвращаем заглушки данных
        if (this.isDemo) {
            console.log('Using demo mode, returning mock data');
            return this.getDemoResponse(endpoint, options);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            console.log('Falling back to demo mode due to error');
            return this.getDemoResponse(endpoint, options);
        }
    }

    /**
     * Получение демо-данных для разных эндпоинтов
     * @param {string} endpoint - Конечная точка API
     * @param {Object} options - Опции запроса
     * @returns {Object} - Демо-данные
     */
    getDemoResponse(endpoint, options) {
        console.log('Getting demo response for:', endpoint);
        
        // Базовые демо-данные
        const demoData = {
            success: true,
            user: {
                resources: {
                    wood: { amount: 0, limit: 100 },
                    fish: { amount: 0, limit: 100 },
                    coins: { amount: 0 },
                    energy: { amount: 100, limit: 100 },
                    catFood: { amount: 0, limit: 50 }
                },
                buildings: [],
                cats: [],
                tutorial: { completed: false }
            }
        };

        // Возвращаем соответствующие данные в зависимости от эндпоинта
        let response;
        switch (true) {
            case endpoint.includes('/users/auth'):
                response = { ...demoData, token: 'demo_token' };
                break;
            case endpoint.includes('/users/complete-tutorial'):
                response = { ...demoData, user: { ...demoData.user, tutorial: { completed: true } } };
                break;
            default:
                response = demoData;
        }
        
        console.log('Demo response:', response);
        return response;
    }

    /**
     * Аутентификация пользователя
     * @param {string} telegramId - ID пользователя в Telegram
     * @returns {Promise<Object>} - Данные пользователя
     */
    async authUser(telegramId) {
        return this.fetchApi('/users/auth', {
            method: 'POST',
            body: JSON.stringify({ telegramId })
        });
    }

    /**
     * Получение данных пользователя
     * @param {string} telegramId - ID пользователя в Telegram
     * @returns {Promise<Object>} - Данные пользователя
     */
    async getUser(telegramId) {
        return this.fetchApi(`/users/${telegramId}`);
    }

    /**
     * Добыча ресурса
     * @param {string} telegramId - ID пользователя в Telegram
     * @param {string} resourceType - Тип ресурса (wood, fish)
     * @param {number} amount - Количество (по умолчанию 1)
     * @returns {Promise} - Промис с результатом добычи
     */
    async harvestResource(telegramId, resourceType, amount = 1) {
        return this.fetchApi('/users/resource', {
            method: 'POST',
            body: JSON.stringify({
                telegramId,
                resourceType,
                amount
            })
        });
    }

    /**
     * Постройка или улучшение здания
     * @param {string} telegramId - ID пользователя в Telegram
     * @param {string} buildingType - Тип здания (mainHouse, market, guestHouse)
     * @returns {Promise} - Промис с результатом постройки
     */
    async buildOrUpgrade(telegramId, buildingType) {
        return this.fetchApi('/users/build', {
            method: 'POST',
            body: JSON.stringify({
                telegramId,
                buildingType
            })
        });
    }

    /**
     * Активация или деактивация кошки
     * @param {string} telegramId - ID пользователя в Telegram
     * @param {string} catId - ID кошки
     * @param {boolean} activate - Активировать (true) или деактивировать (false)
     * @returns {Promise} - Промис с результатом активации
     */
    async activateCat(telegramId, catId, activate) {
        return this.fetchApi('/users/activate-cat', {
            method: 'POST',
            body: JSON.stringify({
                telegramId,
                catId,
                activate
            })
        });
    }

    /**
     * Продажа ресурсов
     * @param {string} telegramId - ID пользователя в Telegram
     * @param {string} resourceType - Тип ресурса (wood, fish)
     * @param {number} amount - Количество для продажи
     * @returns {Promise} - Промис с результатом продажи
     */
    async sellResources(telegramId, resourceType, amount) {
        return this.fetchApi('/users/sell', {
            method: 'POST',
            body: JSON.stringify({
                telegramId,
                resourceType,
                amount
            })
        });
    }

    /**
     * Завершение туториала
     * @param {string} telegramId - ID пользователя в Telegram
     * @returns {Promise<Object>} - Обновленные данные пользователя
     */
    async completeTutorial(telegramId) {
        return this.fetchApi('/users/complete-tutorial', {
            method: 'POST',
            body: JSON.stringify({ telegramId })
        });
    }
}