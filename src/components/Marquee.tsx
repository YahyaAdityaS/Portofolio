import React from 'react';

interface MarqueeProps {
  darkMode?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({ darkMode = false }) => {
  const items = [
    { label: 'NEXT.JS 14 APP ROUTER', isBadge: true },
    { label: 'TYPESCRIPT RIGOR', isBadge: false },
    { label: 'TAILWIND CSS ARCHITECTURE', isBadge: true },
    { label: 'FASTAPI & PYTHON', isBadge: false },
    { label: 'FIGMA DESIGN TOKENS', isBadge: true },
    { label: 'POSTGRESQL & SUPABASE', isBadge: false },
    { label: 'FRAMER MOTION', isBadge: true },
    { label: 'DOCKER & CI/CD', isBadge: false },
  ];

  return (
    <section
      className={`w-full py-3.5 shadow-sm overflow-hidden select-none rotate-[-0.5deg] my-4 transition-colors duration-300 ${
        darkMode
          ? 'bg-[#0d1527] border-y-2 border-[#23324f]'
          : 'bg-[#bef264] border-y-2 border-[#a3e635]'
      }`}
    >
      <div className="flex items-center gap-6 whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] w-max">
        {[...Array(2)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center gap-4 uppercase tracking-wider font-extrabold text-xs sm:text-sm">
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                {item.isBadge ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      darkMode
                        ? 'bg-[#2563eb] text-white'
                        : 'bg-[#131b2e] text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                ) : (
                  <span
                    className={`font-bold ${
                      darkMode ? 'text-[#38bdf8]' : 'text-[#0f172a]'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
                <span
                  className={
                    darkMode ? 'text-[#bef264]' : 'text-[#0f172a]'
                  }
                >
                  ✦
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
