
import React, { useState } from 'react';
import { TypingText } from './TypingText';
import { Button } from './Button';
import { ChevronDown, ArrowRight, Search } from 'lucide-react';
import { EXTENSION_DOWNLOAD_LINK } from '../config';

interface HeroProps {
  onShowReport: (id?: string) => void;
}

const ExtensionArrow = ({ visible }: { visible: boolean }) => (
  <div 
    className={`absolute top-6 right-8 md:right-24 z-20 hidden md:flex flex-col items-center pointer-events-none transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
  >
     <div className="relative flex flex-col items-center">
       <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-6 animate-bounce" style={{ animationDuration: '3s' }}>
          <path 
            d="M 20 80 Q 40 30 90 10" 
            stroke="#FF8C42" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeDasharray="6 4"
            markerEnd="url(#arrowhead)"
            className="opacity-80"
          />
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#FF8C42" />
            </marker>
          </defs>
       </svg>
       <span className="mt-2 text-brand-orange/90 text-sm font-medium tracking-wide whitespace-nowrap drop-shadow-md">
         Extension lives here
       </span>
     </div>
  </div>
);

export const Hero: React.FC<HeroProps> = ({ onShowReport }) => {
  const [showInput, setShowInput] = useState(false);
  const [manualId, setManualId] = useState('');
  const [showArrow, setShowArrow] = useState(false);

  const scrollToInstructions = () => {
    const instructionsElement = document.getElementById('instructions');
    if (instructionsElement) {
      instructionsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownload = () => {
    if (EXTENSION_DOWNLOAD_LINK && (EXTENSION_DOWNLOAD_LINK as string) !== '#') {
      window.open(EXTENSION_DOWNLOAD_LINK, '_blank');
    } else {
      console.warn("Download link not set in config.ts");
      alert("Download link coming soon.");
    }
  };

  const handleViewReportClick = () => {
    setShowInput(true);
    // Show arrow hint
    setShowArrow(true);
    // Hide arrow after 4 seconds
    setTimeout(() => {
      setShowArrow(false);
    }, 4000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      onShowReport(manualId.trim());
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-orange/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] md:w-[250px] md:h-[250px] bg-brand-orange/30 rounded-full blur-[60px] pointer-events-none" />

      {/* Visual cue for extension location - Conditional Visibility */}
      <ExtensionArrow visible={showArrow} />

      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-brand-cream drop-shadow-2xl">
            Devops Burst
          </h1>
        </div>

        {/* Typing Subtitle */}
        <div className="h-8 md:h-12 text-xl md:text-2xl min-w-[280px]">
          <TypingText 
            phrases={[
              "Stay in control.",
              "Find your time leakage."
            ]}
            typingSpeed={80}
            deletingSpeed={50}
            pauseDuration={1500}
          />
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 animate-fade-in">
          <Button variant="primary" icon="download" onClick={handleDownload}>
            Download Extension
          </Button>
          <Button variant="secondary" icon="dashboard" onClick={handleViewReportClick}>
            View My Report
          </Button>
        </div>

        {/* Manual Report Entry */}
        <div className="h-16 mt-4 flex flex-col items-center justify-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {!showInput ? (
            <button 
              onClick={handleViewReportClick}
              className="text-sm text-gray-500 hover:text-brand-orange transition-colors flex items-center gap-1 group"
            >
              Have a Report ID? 
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <form onSubmit={handleManualSubmit} className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 focus-within:border-brand-orange/50 transition-colors">
              <div className="pl-3 text-gray-500">
                <Search size={14} />
              </div>
              <input 
                type="text" 
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="Enter Report ID..."
                className="bg-transparent border-none outline-none text-sm text-brand-cream placeholder-gray-600 w-32 md:w-40"
                autoFocus
              />
              <button 
                type="submit"
                className="bg-brand-orange text-white rounded-full p-1.5 hover:bg-orange-600 transition-colors"
                disabled={!manualId.trim()}
              >
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-10 left-[48%] -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer text-white transition-opacity hover:opacity-100 opacity-90" 
        onClick={scrollToInstructions}
      >
        <span className="text-xs mb-2 font-medium tracking-wide">How to use</span>
        <ChevronDown size={24} />
      </div>
    </section>
  );
};
