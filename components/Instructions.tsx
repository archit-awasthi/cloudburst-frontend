import React from 'react';
import { Download, FolderOpen, ToggleRight, Puzzle } from 'lucide-react';

export const Instructions: React.FC = () => {
  const steps = [
    {
      icon: <Download className="text-brand-orange" size={32} />,
      title: "Download & Unzip",
      description: "Download the CloudBurst extension package and extract the files to a folder on your computer."
    },
    {
      icon: <Puzzle className="text-brand-orange" size={32} />,
      title: "Open Extensions",
      description: "Go to chrome://extensions in your browser address bar and enable 'Developer mode' in the top right corner."
    },
    {
      icon: <FolderOpen className="text-brand-orange" size={32} />,
      title: "Load Unpacked",
      description: "Click the 'Load unpacked' button that appeared and select the folder you just extracted."
    },
    {
      icon: <ToggleRight className="text-brand-orange" size={32} />,
      title: "Analyze",
      description: "Pin the extension, open it, and wait for your local analysis to complete securely."
    }
  ];

  return (
    <section id="instructions" className="py-24 px-6 bg-brand-gray/30 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-cream">How it Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your data never leaves your device until you decide to generate a report. 
            We use a local browser extension to securely process your history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-black/40 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-brand-orange transition-colors">
                {index + 1}. {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};