import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <div 
        className={`bg-current rounded-full animate-pulse ${sizeClasses[size]}`}
        style={{ animationDelay: '0ms' }}
      />
      <div 
        className={`bg-current rounded-full animate-pulse ${sizeClasses[size]}`}
        style={{ animationDelay: '150ms' }}
      />
      <div 
        className={`bg-current rounded-full animate-pulse ${sizeClasses[size]}`}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};

export default Loader; 