
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Instructions } from './components/Instructions';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    // Simple client-side routing check
    // The extension opens: https://domain.com/report/<id>
    const path = window.location.pathname;
    const reportMatch = path.match(/^\/report\/([^/]+)/);

    if (reportMatch && reportMatch[1]) {
      setReportId(reportMatch[1]);
      setView('dashboard');
    }
  }, []);

  const handleShowReport = () => {
    setView('dashboard');
    setReportId(null); // Clear ID to show demo data/state if clicked from landing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    // Reset URL to root without reloading
    window.history.pushState({}, '', '/');
    setView('landing');
    setReportId(null);
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
          <Dashboard reportId={reportId} />
        )}
      </main>

      <Footer />
    </div>
  );
}
