// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';

// Импорт страниц
import HomePage from './pages/HomePage';
import CatsPage from './pages/CatsPage';
import ExpeditionsPage from './pages/ExpeditionsPage';
import ExpeditionDetailsPage from './pages/ExpeditionDetailsPage';
import TasksPage from './pages/TasksPage';

const App = () => {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cats" element={<CatsPage />} />
          <Route path="/expeditions" element={<ExpeditionsPage />} />
          <Route path="/expeditions/:expeditionId" element={<ExpeditionDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
};

export default App;