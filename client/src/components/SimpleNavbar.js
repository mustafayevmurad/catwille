// client/src/components/SimpleNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const SimpleNavbar = () => {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      background: 'white',
      padding: '10px',
      boxShadow: '0 -2px 5px rgba(0,0,0,0.1)'
    }}>
      <Link to="/">Главная</Link>
      <Link to="/cats">Кошки</Link>
      <Link to="/explore">Исследовать</Link>
      <Link to="/village">Поселение</Link>
      <Link to="/tasks">Задачи</Link>
    </nav>
  );
};

export default SimpleNavbar;