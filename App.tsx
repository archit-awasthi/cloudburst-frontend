import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Instructions } from './components/Instructions';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  const handleShowReport = () => {
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-brand-cream selection:bg-brand-orange selection:text-white overflow-x-hidden">
      <Navbar onViewChange={handleBackToHome} currentView={view} />
      
      <main>
        {view === 'landing' ? (
          <>
            <Hero onShowReport={handleShowReport} />
            <Instructions />
          </>
        ) : (
          <Dashboard />
        )}
      </main>

      <Footer />
    </div>
  );
}