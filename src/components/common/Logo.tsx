import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  withText = false 
}) => {
  const sizeMap = {
    xs: { box: 'w-6 h-6 rounded-md', font: 'text-[11px]' },
    sm: { box: 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg', font: 'text-xs sm:text-sm' },
    md: { box: 'w-10 h-10 rounded-xl', font: 'text-base font-bold' },
    lg: { box: 'w-12 h-12 rounded-2xl', font: 'text-xl font-bold' },
    xl: { box: 'w-16 h-16 rounded-3xl', font: 'text-2xl font-black' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* MT Icon badge */}
      <div 
        className={`${currentSize.box} relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/60 border border-emerald-500/25 flex items-center justify-center shadow-lg shadow-emerald-950/20 shrink-0 select-none overflow-hidden group`}
      >
        {/* Subtle inner radial gradient */}
        <div className="absolute inset-0 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />

        {/* Monogram MT text */}
        <div className="relative z-10 flex items-center font-mono tracking-tighter">
          <span className="text-white font-extrabold">M</span>
          <span className="text-emerald-400 font-extrabold">T</span>
          <span className="w-1 h-1 rounded-full bg-emerald-400 ml-0.5 mt-2 animate-pulse" />
        </div>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className="font-semibold text-xs sm:text-sm tracking-tight text-zinc-100">
            MoneyTracker
          </span>
          <p className="text-[10px] text-zinc-500 hidden sm:block">Shaxsiy moliya boshqaruvi</p>
        </div>
      )}
    </div>
  );
};
