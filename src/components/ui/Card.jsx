import React from 'react';

const Card = ({ children, className = '', onClick, ...rest }) => {
  return (
    <div 
      className={`card ${onClick ? 'cursor-pointer transition-transform hover:scale-105' : ''} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...rest }) => {
  return (
    <div className={`p-4 border-b ${className}`} {...rest}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '', ...rest }) => {
  return (
    <div className={`p-4 ${className}`} {...rest}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...rest }) => {
  return (
    <div className={`p-4 border-t ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;