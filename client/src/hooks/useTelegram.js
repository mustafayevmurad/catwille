// client/src/hooks/useTelegram.js
import { useEffect } from 'react';

const useTelegram = () => {
  const tg = window.Telegram?.WebApp;
  
  useEffect(() => {
    if (tg) {
      // Сообщаем Telegram, что приложение готово
      tg.ready();
      
      // Настраиваем внешний вид WebApp
      tg.expand();
      
      // Опционально можно изменить цвет верхней панели
      tg.setHeaderColor('#3390EC');
    }
  }, [tg]);
  
  // Получение информации о пользователе
  const getUser = () => {
    if (!tg) return null;
    
    return {
      id: tg.initDataUnsafe?.user?.id,
      firstName: tg.initDataUnsafe?.user?.first_name,
      lastName: tg.initDataUnsafe?.user?.last_name,
      username: tg.initDataUnsafe?.user?.username,
      languageCode: tg.initDataUnsafe?.user?.language_code,
    };
  };
  
  // Закрытие WebApp
  const close = () => {
    if (tg) {
      tg.close();
    }
  };
  
  // Показать всплывающее сообщение
  const showAlert = (message) => {
    if (tg) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };
  
  // Проверка наличия доступа к платежам
  const canPay = () => {
    return tg && tg.isVersionAtLeast('6.1') && !tg.isExpanded;
  };
  
  return {
    tg,
    getUser,
    close,
    showAlert,
    canPay
  };
};

export default useTelegram;