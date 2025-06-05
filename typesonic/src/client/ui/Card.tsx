import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`border rounded-md p-4 ${className}`}>
    {children}
  </div>
);
