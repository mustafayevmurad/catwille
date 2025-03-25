// client/src/components/ui/Button.js
import React from 'react';

const Button = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors duration-200';
  
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${disabled ? disabledStyles : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;