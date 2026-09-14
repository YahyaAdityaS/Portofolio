import React from 'react';

interface FooterProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, darkMode, onOpenAdmin }) => {
  return (
    <footer
      className={`w-full mt-space-xl border-t transition-colors duration-300 ${
        darkMode ? 'bg-[#060911] border-[#1e293b]' : 'bg-white border-[#eaedff]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-space-xl flex flex-col gap-space-xl">
        
        {/* Top Action Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-space-lg">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-space-sm py-1 rounded-full mb-space-md border ${
                darkMode
                  ? 'bg-[#111a2e] border-[#23324f]'
                  : 'bg-[#eaedff] border-transparent'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  darkMode ? 'bg-[#bef264]' : 'bg-primary'
                }`}
              ></span>
              <span
                className={`text-xs uppercase tracking-wider font-bold ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                {lang === 'ID' ? 'Siap Berkolaborasi' : 'Ready to Collaborate'}
              </span>
            </div>
            
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {lang === 'ID'
                ? 'Mari Kolaborasi & Ciptakan Karya Hebat'
                : 'Let’s Collaborate & Build Great Software'}
            </h2>
            <p
              className={`text-base mt-space-sm font-medium ${
                darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
              }`}
            >
              {lang === 'ID'
                ? 'Terbuka untuk konsultasi arsitektur frontend, full-stack application development, dan creative UI/UX engineering.'
                : 'Open for frontend architecture consultation, full-stack application development, and creative UI/UX engineering.'}
            </p>
          </div>

          <a
            href="#diskusi-proyek"
            className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold text-sm sm:text-base shrink-0 ${
              darkMode
                ? 'bg-[#bef264] hover:bg-[#a3e635] text-[#080c16] shadow-[0_4px_0px_rgba(0,0,0,0.3)] font-black'
                : 'bg-primary hover:bg-[#1d4ed8] text-white shadow-[0_4px_0px_rgba(0,0,0,0.2)] font-bold'
            }`}
          >
            <span>{lang === 'ID' ? 'Mulai Pembicaraan' : 'Start a Conversation'}</span>
            <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
          </a>
        </div>

        {/* Middle Bar: Location & Socials (Clean, Symmetrical Padding - No Over-padding) */}
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-3 px-5 py-3.5 sm:px-6 sm:py-3.5 rounded-2xl border transition-colors ${
            darkMode
              ? 'bg-[#0d1527] border-[#1e293b]'
              : 'bg-[#f2f3ff] border-[#eaedff]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-xl ${
                darkMode ? 'text-[#38bdf8]' : 'text-primary'
              }`}
            >
              location_on
            </span>
            <span
              className={`text-sm font-bold ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              Malang & Jakarta, Indonesia • GMT+7
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            {[{ name: 'GitHub', url: 'https://github.com/YahyaAdityaS' }, { name: 'LinkedIn', url: 'https://linkedin.com/in/yahyadityas' }, { name: 'Instagram', url: 'https://www.instagram.com/yahyaditya.s/' }, { name: 'Dribbble', url: 'https://dribbble.com/Putra204247T' }].map((net) => (
              <a
                key={net.name}
                href={net.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-bold transition-colors ${
                  darkMode
                    ? 'text-[#cbd5e1] hover:text-[#bef264]'
                    : 'text-[#434655] hover:text-primary'
                }`}
              >
                {net.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
          <p
            className={`text-xs font-medium flex items-center justify-center sm:justify-start flex-wrap ${
              darkMode ? 'text-[#94a3b8]' : 'text-[#434655]'
            }`}
          >
            <span>
              © 2025 Yahya Aditya Saputra. {lang === 'ID' ? 'Hak cipta dilindungi undang-undang.' : 'All rights reserved.'}
            </span>
          </p>

          <div
            className={`flex items-center gap-space-sm text-xs font-semibold ${
              darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
            }`}
          >
            <span>Software Engineering</span>
            <span className={darkMode ? 'text-[#64748b]' : ''}>•</span>
            <span>Creative UI/UX</span>
            <span className={darkMode ? 'text-[#64748b]' : ''}>•</span>
            {/* The Hidden Stealth Trigger disguised perfectly as normal text */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="font-semibold text-xs transition-opacity cursor-default select-none focus:outline-none focus:ring-0 active:opacity-75"
              tabIndex={-1}
            >
              Next-Gen Web
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
