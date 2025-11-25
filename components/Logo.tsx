import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="#FF8C42" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.132 20.177 10.244 17.819 10.034C17.657 6.657 14.812 4 11.5 4C8.48 4 5.824 6.188 5.14 9.06C2.268 9.537 0 11.96 0 15C0 18.314 2.686 21 6 21H17.5Z" />
    </svg>
  );
};