// client/src/components/Icons.js
import React from 'react';

// Иконка "Домой"
export const HomeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

// Иконка "Карта" (поселение)
export const MapIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line>
    <line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>
);

// Иконка "Лапка" (кошки)
export const PawIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="5" r="2"></circle>
    <circle cx="17" cy="5" r="2"></circle>
    <circle cx="5" cy="12" r="2"></circle>
    <circle cx="19" cy="12" r="2"></circle>
    <path d="M8 14C7.52381 13.1947 6.75 12 6 10C4.5 12 5.76226 15.6292 7 17C8.16312 18.2739 10.3801 20 12 20C13.6199 20 15.8369 18.2739 17 17C18.2377 15.6292 19.5 12 18 10C17.25 12 16.4762 13.1947 16 14C15 16 13.3334 17 12 17C10.6666 17 9 16 8 14Z"></path>
  </svg>
);

// Иконка "Компас" (исследование)
export const CompassIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

// Иконка "Список" (задачи)
export const ChecklistIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// Иконка "Рыба" (ресурс)
export const FishIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10c-1 0-3.5 1-5 2s-2.5 2-3 2c-1.5 0-3-1.5-3-3s1.5-3 3-3c.5 0 1.5 1 3 2s4 2 5 2z"></path>
    <path d="M18 14c-1 0-3.5-1-5-2s-2.5-2-3-2c-1.5 0-3 1.5-3 3s1.5 3 3 3c.5 0 1.5-1 3-2s4-2 5-2z"></path>
    <path d="M20 7v10"></path>
    <path d="M20 7c1 1 2 3 2 5s-1 4-2 5"></path>
  </svg>
);

// Иконка "Клубок шерсти" (ресурс)
export const YarnIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 8c1.5 0 2.5.7 3.5 1.5 1 .8 2 1.5 3.5 1.5"></path>
    <path d="M20 12c-1.5 0-2.5.7-3.5 1.5-1 .8-2 1.5-3.5 1.5s-2.5-.7-3.5-1.5c-1-.8-2-1.5-3.5-1.5"></path>
    <path d="M4 8c1.5 0 2.5.7 3.5 1.5 1 .8 2 1.5 3.5 1.5"></path>
  </svg>
);

// Иконка "Энергия"
export const EnergyIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
  </svg>
);

// Иконка "Монета" (премиум-валюта)
export const CoinIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M14.8 9A2 2 0 0 0 13 8h-3a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9"></path>
    <path d="M12 6v2"></path>
    <path d="M12 16v2"></path>
  </svg>
);

// Иконка "Опыт"
export const ExpIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// Иконка "Уровень"
export const LevelIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

// Иконка "Рыбалка" (активность)
export const FishingIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4"></path>
    <path d="M12 4c3.5 0 6 3.5 6 7 0 1-1 2-4 3"></path>
    <path d="M7 14c-3-1-4-2-4-3 0-3.5 2.5-7 6-7 .3 0 .6 0 .9.1"></path>
    <line x1="12" y1="9" x2="12" y2="14"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

// Иконка "Охота" (активность)
export const HuntingIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="3"></circle>
    <line x1="12" y1="5" x2="12" y2="3"></line>
    <line x1="17" y1="7" x2="19" y2="5"></line>
    <line x1="19" y1="12" x2="21" y2="12"></line>
    <line x1="17" y1="17" x2="19" y2="19"></line>
    <line x1="12" y1="19" x2="12" y2="21"></line>
    <line x1="7" y1="17" x2="5" y2="19"></line>
    <line x1="5" y1="12" x2="3" y2="12"></line>
    <line x1="7" y1="7" x2="5" y2="5"></line>
  </svg>
);