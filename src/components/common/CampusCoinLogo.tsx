import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const CampusCoinLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#0c2550] via-[#0f2e69] to-[#1a4494] p-1.5 flex items-center justify-center shadow-md shadow-blue-950/20 border border-blue-400/20`}>
        {/* Custom emblem: stylized coin with graduation mortarboard silhouette & HIT geometric accent */}
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <circle cx="16" cy="16" r="14" stroke="#F59E0B" strokeWidth="2.2" strokeDasharray="3 1" />
          <circle cx="16" cy="16" r="10.5" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.4" />
          <path
            d="M16 8L7 13L16 18L25 13L16 8Z"
            fill="#F59E0B"
          />
          <path
            d="M10 15V20.5C10 22.5 12.7 24 16 24C19.3 24 22 22.5 22 20.5V15"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M24 13.5V20"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-[#0a1f44] ${textSizes[size]}`}>
            Campus<span className="text-[#d97706]">Coin</span>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100/90 text-[#0f2e69] border border-blue-200">
            HIT PILOT
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 font-medium tracking-normal mt-0.5">
            Student Financial Wellness
          </span>
        )}
      </div>
    </div>
  );
};
