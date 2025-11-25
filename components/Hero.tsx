
import React from 'react';
import { TypingText } from './TypingText';
import { Button } from './Button';
import { ChevronDown } from 'lucide-react';
import { EXTENSION_DOWNLOAD_LINK } from '../config';

interface HeroProps {
  onShowReport: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShowReport }) => {
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
      // Fallback behavior or alert if needed
      alert("Download link coming soon.");
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
          <Button variant="secondary" icon="dashboard" onClick={onShowReport}>
            Show My Report
          </Button>
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
