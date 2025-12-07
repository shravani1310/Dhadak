import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-card/40 backdrop-blur-md border border-white/10 rounded-xl ${hover ? 'hover:border-primary/50 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-2xl font-heading font-bold ${className}`}>{children}</h3>;
};
