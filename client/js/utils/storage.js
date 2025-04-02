/**
 * Утилита для работы с локальным хранилищем
 */
class StorageManager {
    constructor() {
        this.storageKey = 'catwille_data';
    }

    /**
     * Сохраняет данные пользователя
     * @param {Object} userData - Данные для сохранения
     */
    saveUserData(userData) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            return false;
        }
    }

    /**
     * Получает данные пользователя
     * @returns {Object|null} Данные пользователя или null
     */
    getUserData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return null;
        }
    }

    /**
     * Очищает все сохраненные данные
     */
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Ошибка при очистке данных:', error);
            return false;
        }
    }

    /**
     * Получает ID пользователя Telegram
     * @returns {string|null} ID пользователя или null
     */
    getTelegramId() {
        const userData = this.getUserData();
        return userData ? userData.telegramId : null;
    }
}