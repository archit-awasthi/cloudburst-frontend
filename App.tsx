
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Instructions } from './components/Instructions';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [reportId, setReportId] = useState<string | null>(null);

  const updateStateFromUrl = () => {
    const path = window.location.pathname;
    // Regex to match /report/some-id-here
    const reportMatch = path.match(/^\/report\/([^/]+)/);

    if (reportMatch && reportMatch[1]) {
      console.log("Route detected: Report ID", reportMatch[1]);
      setReportId(reportMatch[1]);
      setView('dashboard');
    } else if (path === '/' || path === '') {
      setReportId(null);
      setView('landing');
    } else {
      // Handle unknown routes by defaulting to landing, or could be 404
      setReportId(null);
      setView('landing');
    }
  };

  useEffect(() => {
    // Check initial load
    updateStateFromUrl();

    // Handle browser Back/Forward
    window.addEventListener('popstate', updateStateFromUrl);
    return () => window.removeEventListener('popstate', updateStateFromUrl);
  }, []);

  const handleShowReport = (id?: string) => {
    if (id) {
      setReportId(id);
      setView('dashboard');
      window.history.pushState({}, '', `/report/${id}`);
    } else {
      // Demo mode
      setReportId(null);
      setView('dashboard'); 
      window.history.pushState({}, '', '/demo');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/');
    updateStateFromUrl();
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
