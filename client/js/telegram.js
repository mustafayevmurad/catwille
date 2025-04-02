// Интеграция с Telegram WebApp

// Проверяем доступность Telegram WebApp
const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;

// Инициализация Telegram WebApp
function initTelegramWebApp() {
    if (!isTelegramWebApp) {
        console.warn('Telegram WebApp not available');
        return;
    }

    const webApp = window.Telegram.WebApp;
    
    // Настройка темы WebApp
    document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.backgroundColor || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', webApp.textColor || '#000000');
    document.documentElement.style.setProperty('--tg-theme-hint-color', webApp.hintColor || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', webApp.linkColor || '#2481cc');
    
    // Сообщаем Telegram, что WebApp готов
    webApp.ready();
    
    // Получаем данные о пользователе
    const user = webApp.initDataUnsafe?.user;
    if (user) {
        // Здесь можно сохранить данные пользователя для использования в игре
        window.gameUser = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            languageCode: user.language_code
        };
        
        // Устанавливаем имя пользователя в игре
        if (window.setPlayerName) {
            window.setPlayerName(user.first_name);
        }
    }
    
    // Добавляем кнопку "Закрыть" для WebApp
    webApp.BackButton.isVisible = true;
    webApp.BackButton.onClick(() => {
        // Можно добавить проверку сохранения прогресса перед закрытием
        webApp.close();
    });
}

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', initTelegramWebApp);

// Экспорт функций для работы с Telegram WebApp
window.telegramWebApp = {
    isAvailable: isTelegramWebApp,
    
    // Функция для отправки данных в бота
    sendData: function(data) {
        if (!isTelegramWebApp) return;
        
        window.Telegram.WebApp.sendData(JSON.stringify(data));
    },
    
    // Функция для закрытия WebApp
    close: function() {
        if (!isTelegramWebApp) return;
        
        window.Telegram.WebApp.close();
    },
    
    // Функция для расширения окна WebApp
    expand: function() {
        if (!isTelegramWebApp) return;
        
        window.Telegram.WebApp.expand();
    }
}; 