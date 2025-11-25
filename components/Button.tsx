import React from 'react';
import { Download, LayoutDashboard } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: 'download' | 'dashboard';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base";
  
  const variants = {
    // Darker orange with a persistent glow that intensifies on hover
    primary: "bg-[#EA580C] text-white hover:bg-[#C2410C] shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_35px_rgba(234,88,12,0.7)] active:scale-95 border border-transparent",
    
    // Filled dark styling that complements the black/orange theme
    secondary: "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:text-white hover:border-zinc-500 hover:shadow-lg active:scale-95",
    
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
  };

  const IconComponent = icon === 'download' ? Download : icon === 'dashboard' ? LayoutDashboard : null;

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {IconComponent && <IconComponent size={18} />}
      {children}
    </button>
  );
};