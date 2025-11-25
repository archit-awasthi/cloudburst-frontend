import React from 'react';

interface NavbarProps {
  onViewChange: () => void;
  currentView: 'landing' | 'dashboard';
}

export const Navbar: React.FC<NavbarProps> = ({ onViewChange, currentView }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          onClick={onViewChange} 
          className="text-2xl font-bold tracking-tighter text-brand-cream cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity"
        >
          CloudBurst
        </div>
        
        <div className="pointer-events-auto">
          {currentView === 'dashboard' && (
             <button 
               onClick={onViewChange}
               className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
             >
               Back to Home
             </button>
          )}
        </div>
      </div>
    </nav>
  );
};