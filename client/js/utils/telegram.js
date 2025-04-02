/**
 * Утилита для работы с Telegram Web App
 */
class TelegramUtils {
    constructor() {
        this.webApp = window.Telegram?.WebApp;
        this.isAvailable = !!this.webApp;
        
        if (this.isAvailable) {
            console.log('Telegram WebApp is available');
            this.webApp.expand();
        } else {
            console.log('Telegram WebApp is not available, running in standalone mode');
        }
    }

    /**
     * Получает Telegram ID пользователя (если доступно)
     * @returns {string|null} - Telegram ID пользователя или null
     */
    getUserId() {
        if (!this.isAvailable) return null;
        
        try {
            return this.webApp.initDataUnsafe?.user?.id?.toString() || null;
        } catch (error) {
            console.error('Error getting Telegram user ID:', error);
            return null;
        }
    }

    /**
     * Получает имя пользователя из Telegram
     * @returns {string|null} - Имя пользователя или null
     */
    getUserName() {
        if (!this.isAvailable) return null;
        
        try {
            const user = this.webApp.initDataUnsafe?.user;
            if (!user) return null;
            
            // Пробуем получить имя в порядке предпочтения
            return user.username || 
                   `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
                   null;
        } catch (error) {
            console.error('Error getting Telegram user name:', error);
            return null;
        }
    }

    /**
     * Показывает всплывающее уведомление в Telegram
     * @param {string} message - Текст уведомления
     */
    showNotification(message) {
        if (!this.isAvailable) {
            console.log('Notification (non-Telegram):', message);
            return;
        }
        
        try {
            this.webApp.showPopup({
                title: 'Catwille',
                message: message,
                buttons: [{ type: 'ok' }]
            });
        } catch (error) {
            console.error('Error showing Telegram notification:', error);
        }
    }

    /**
     * Закрывает Telegram WebApp
     */
    close() {
        if (!this.isAvailable) {
            console.log('Cannot close Telegram WebApp (not available)');
            return;
        }
        
        try {
            this.webApp.close();
        } catch (error) {
            console.error('Error closing Telegram WebApp:', error);
        }
    }
} 