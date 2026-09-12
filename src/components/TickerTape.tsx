import React from 'react';
import { Sparkles, Zap, Code, ShieldCheck, Flame, Layers } from 'lucide-react';

export const TickerTape: React.FC = () => {
  const tickerItems = [
    { text: 'CREATIVE FRONTEND ARCHITECTURE', icon: Sparkles },
    { text: 'NEO-BRUTALIST BENTO DESIGN', icon: Layers },
    { text: 'REACT 19 & NEXT.JS SPECIALIST', icon: Code },
    { text: 'WEBGL & SHADER MICRO-INTERACTIONS', icon: Flame },
    { text: '100% LIGHTHOUSE PERFORMANCE', icon: Zap },
    { text: 'WCAG AAA ACCESSIBILITY', icon: ShieldCheck },
    { text: 'DESIGN SYSTEM TOKENIZATION', icon: Layers },
    { text: 'HIGH-FREQUENCY FINTECH UI', icon: Zap },
  ];

  return (
    <section 
      id="ticker-tape-section" 
      aria-label="Technology and skills ticker"
      className="w-full bg-[#CCFF00] border-y-2 border-slate-900 py-3 sm:py-3.5 overflow-hidden select-none relative z-10 shadow-xs"
    >
      <div className="animate-marquee flex items-center">
        {/* Double the array for seamless infinite looping */}
        {[...tickerItems, ...tickerItems].map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={`ticker-${index}`} 
              className="flex items-center gap-3 px-6 sm:px-8 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wider whitespace-nowrap"
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950/20 text-slate-950 shrink-0" />
              <span>{item.text}</span>
              <span className="text-slate-950/50 font-black text-xs sm:text-sm ml-3">★</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
