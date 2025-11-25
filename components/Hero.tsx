
import React, { useState } from 'react';
import { TypingText } from './TypingText';
import { Button } from './Button';
import { ChevronDown, ArrowRight, Search } from 'lucide-react';
import { EXTENSION_DOWNLOAD_LINK } from '../config';

interface HeroProps {
  onShowReport: (id?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShowReport }) => {
  const [showInput, setShowInput] = useState(false);
  const [manualId, setManualId] = useState('');

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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      onShowReport(manualId.trim());
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Glow - matches the reference image feeling */}
      {/* Outer ambient glow - Reduced radius */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-brand-orange/20 rounded-full blur-[100px] pointer-events-none" />
      {/* Inner intense glow - Reduced radius */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] md:w-[250px] md:h-[250px] bg-brand-orange/30 rounded-full blur-[60px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-brand-cream drop-shadow-2xl">
          CloudBurst
        </h1>

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
          <Button variant="secondary" icon="dashboard" onClick={() => onShowReport()}>
            Show Demo Report
          </Button>
        </div>

        {/* Manual Report Entry */}
        <div className="h-16 mt-4 flex flex-col items-center justify-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {!showInput ? (
            <button 
              onClick={() => setShowInput(true)}
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
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-gray-500 hover:text-white transition-colors" onClick={scrollToInstructions}>
        <span className="text-xs mb-2 block text-center opacity-50">How to use</span>
        <ChevronDown size={24} />
      </div>
    </section>
  );
};
