// client/src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cats, setCats] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tg } = useTelegram();

  // Получение данных пользователя из API
  const fetchUserData = async (telegramId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user/${telegramId}`);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setCats(response.data.user.cats || []);
        setBuildings(response.data.user.buildings || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      
      // Если пользователь не найден, создаем нового
      if (error.response && error.response.status === 404) {
        await createUser(telegramId);
      } else {
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    }
  };

  // Создание нового пользователя
  const createUser = async (telegramId) => {
    try {
      const username = tg.initDataUnsafe?.user?.username || 'user';
      
      const response = await axios.post(`${API_URL}/user`, {
        telegramId,
        username
      });
      
      if (response.data && response.data.user) {
        // После создания пользователя получаем полные данные
        await fetchUserData(telegramId);
      }
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      setError('Не удалось создать пользователя. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  // Обновление ресурсов пользователя
  const updateResources = async (resources) => {
    if (!user) return;
    
    try {
      const response = await axios.patch(`${API_URL}/user/${user.id}/resources`, {
        resources
      });
      
      if (response.data && response.data.resources) {
        setUser(prev => ({
          ...prev,
          resources: response.data.resources
        }));
      }
    } catch (error) {
      console.error('Ошибка при обновлении ресурсов:', error);
    }
  };

  // Выполнение действия кошкой (рыбалка, охота и т.д.)
  const performAction = async (catId, action, locationId = null) => {
    if (!user) return;
    
    try {
      const response = await axios.post(`${API_URL}/game/action/${user.id}`, {
        catId,
        action,
        locationId
      });
      
      if (response.data) {
        // Обновляем состояние пользователя с новыми ресурсами
        setUser(prev => ({
          ...prev,
          resources: response.data.user.resources,
          energy: response.data.user.energy
        }));
        
        // Обновляем состояние кошки, если это та, что выполняла действие
        setCats(prev => 
          prev.map(cat => 
            cat._id === catId
              ? { ...cat, experience: response.data.cat.experience, level: response.data.cat.level }
              : cat
          )
        );
        
        return response.data.result;
      }
    } catch (error) {
      console.error('Ошибка при выполнении действия:', error);
      throw error;
    }
  };

  // Получение всех кошек пользователя
  const fetchCats = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${API_URL}/cat/user/${user.id}`);
      
      if (response.data && response.data.cats) {
        setCats(response.data.cats);
      }
    } catch (error) {
      console.error('Ошибка при получении кошек:', error);
    }
  };

  // Добавление новой кошки
  const addCat = async (catData) => {
    if (!user) return;
    
    try {
      const response = await axios.post(`${API_URL}/cat/user/${user.id}`, catData);
      
      if (response.data && response.data.cat) {
        setCats(prev => [...prev, response.data.cat]);
        return response.data.cat;
      }
    } catch (error) {
      console.error('Ошибка при добавлении кошки:', error);
      throw error;
    }
  };

  // Инициализация: получаем данные пользователя при загрузке
  useEffect(() => {
    if (tg && tg.initDataUnsafe?.user?.id) {
      const telegramId = tg.initDataUnsafe.user.id.toString();
      fetchUserData(telegramId);
    } else {
      // Для тестирования локально
      fetchUserData('test_user_123');
    }
  }, [tg]);

  return (
    <UserContext.Provider
      value={{
        user,
        cats,
        buildings,
        loading,
        error,
        fetchUserData,
        updateResources,
        performAction,
        fetchCats,
        addCat
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);