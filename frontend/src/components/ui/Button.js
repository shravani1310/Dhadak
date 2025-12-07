import React from 'react';

export const Button = ({ children, className = '', variant = 'primary', size = 'md', onClick, disabled, type = 'button', ...props }) => {
  const baseStyles = 'font-bold tracking-wide transition-all duration-300 rounded-full inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:scale-105 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    secondary: 'bg-secondary text-secondary-foreground hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-foreground hover:bg-muted',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
