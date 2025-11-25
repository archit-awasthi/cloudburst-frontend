
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
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const reportMatch = path.match(/^\/report\/([^/]+)/);

      if (reportMatch && reportMatch[1]) {
        setReportId(reportMatch[1]);
        setView('dashboard');
      } else {
        setReportId(null);
        setView('landing');
      }
    };

    // Check on initial load
    handleUrlChange();

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleShowReport = (id?: string) => {
    if (id) {
      setReportId(id);
      setView('dashboard');
      window.history.pushState({}, '', `/report/${id}`);
    } else {
      setReportId(null);
      setView('dashboard'); // Demo mode
      // Optional: change URL to /demo if you wanted, but keeping it at / or just rendering dashboard is fine
      // For clarity, we'll keep URL as is or set to /demo
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
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
