import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5 bg-black">
      <p>&copy; {new Date().getFullYear()} CloudBurst. Stay in control.</p>
    </footer>
  );
};