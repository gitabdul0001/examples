import { ReactNode } from 'react';
import Header from './Header';

interface PageProps {
  children: ReactNode;
  className?: string;
}

export default function Page({ children, className = '' }: PageProps) {
  return (
    <div className={`h-screen flex flex-col bg-gray-100 ${className}`}>
      <Header />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
