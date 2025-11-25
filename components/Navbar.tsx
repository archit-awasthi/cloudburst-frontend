
import React from 'react';
import { Logo } from './Logo';

interface NavbarProps {
  onViewChange: () => void;
  currentView: 'landing' | 'dashboard';
}

export const Navbar: React.FC<NavbarProps> = ({ onViewChange, currentView }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-6 px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo - wrapped in pointer-events-auto to ensure clickability */}
        <div className="pointer-events-auto">
          <button 
            onClick={onViewChange} 
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="Go to home"
          >
            <Logo className="w-8 h-8 text-brand-orange drop-shadow-[0_0_8px_rgba(255,140,66,0.5)] transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold tracking-tighter text-brand-cream group-hover:opacity-80 transition-opacity">
              CloudBurst
            </span>
          </button>
        </div>
        
        {/* Right side actions */}
        <div className="pointer-events-auto">
          {currentView === 'dashboard' && (
             <button 
               onClick={onViewChange}
               className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full border border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
             >
               Back to Home
             </button>
          )}
        </div>
      </div>
    </nav>
  );
};