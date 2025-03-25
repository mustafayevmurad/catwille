// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import './App.css';

// Импорт страниц
import HomePage from './pages/HomePage';
import VillagePage from './pages/VillagePage';
import CatsPage from './pages/CatsPage';
import ExplorePage from './pages/ExplorePage';
import TasksPage from './pages/TasksPage';
import CatProfilePage from './pages/CatProfilePage';

// Импорт компонентов
import Navbar from './components/Navbar';
import Loading from './components/Loading';

// Импорт утилит для взаимодействия с Telegram
import { useTelegram } from './hooks/useTelegram';

function App() {
  const [loading, setLoading] = useState(true);
  const { tg, user } = useTelegram();

  useEffect(() => {
    // Инициализация Telegram WebApp
    tg.ready();
    setLoading(false);
  }, [tg]);

  if (loading) {
    return <Loading />;
  }

  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/village" element={<VillagePage />} />
            <Route path="/cats" element={<CatsPage />} />
            <Route path="/cats/:catId" element={<CatProfilePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
          <Navbar />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;