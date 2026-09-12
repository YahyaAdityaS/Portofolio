import React, { useState } from 'react';

interface NavbarProps {
  lang: 'ID' | 'EN';
  setLang: (lang: 'ID' | 'EN') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: lang === 'ID' ? 'Tentang' : 'About', href: '#tentang' },
    { label: lang === 'ID' ? 'Keahlian' : 'Skills', href: '#keahlian' },
    { label: lang === 'ID' ? 'Proyek Pilihan' : 'Featured Projects', href: '#proyek-pilihan' },
    { label: lang === 'ID' ? 'Pengalaman' : 'Experience', href: '#pengalaman' },
    { label: lang === 'ID' ? 'Testimoni' : 'Testimonials', href: '#testimoni' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 pointer-events-none transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pointer-events-auto">
        <div
          className={`w-full backdrop-blur-md rounded-full px-4 py-2.5 shadow-lg flex items-center justify-between gap-4 transition-all duration-300 ${
            darkMode
              ? 'bg-[#0f172a]/90 border border-[#23324f]'
              : 'bg-white/90 border border-slate-200/80'
          }`}
        >
          {/* Left: Brand + Available Badge */}
          <div className="flex items-center gap-3">
            <a className="flex items-center gap-2 group" href="#tentang">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${
                  darkMode ? 'bg-[#2563eb]' : 'bg-primary'
                }`}
              >
                <span className="text-white font-bold text-sm tracking-tighter">Y</span>
              </div>
              <span
                className={`font-bold text-base tracking-tight hidden sm:inline-block ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                YAS<span className="inline-block w-2 h-2 rounded-full bg-[#bef264] ml-0.5"></span>
              </span>
            </a>

            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${
                darkMode
                  ? 'bg-[#bef264] text-[#080c16] border-[#a3e635]'
                  : 'bg-[#c3f400] text-[#0f172a] border-[#a3e635]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#161e00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#161e00]"></span>
              </span>
              <span className="font-bold text-[11px] uppercase tracking-wider text-[#080c16]">
                {lang === 'ID' ? 'Available for Hire' : 'Open to Work'}
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 p-1 rounded-full border transition-colors ${
              darkMode
                ? 'bg-[#111a2e]/70 border-[#23324f]'
                : 'bg-[#f2f3ff]/70 border-[#eaedff]'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full transition-colors text-sm font-semibold ${
                  darkMode
                    ? 'text-[#cbd5e1] hover:text-[#38bdf8] hover:bg-[#16223b]'
                    : 'text-slate-600 hover:text-primary hover:bg-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <div
              className={`flex items-center p-1 rounded-full border text-xs font-bold transition-colors ${
                darkMode
                  ? 'bg-[#111a2e] border-[#23324f]'
                  : 'bg-[#f2f3ff] border-[#eaedff]'
              }`}
            >
              <button
                type="button"
                aria-label="Pilih Bahasa Indonesia"
                onClick={() => setLang('ID')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'ID'
                    ? darkMode
                      ? 'bg-[#2563eb] text-white shadow-sm'
                      : 'bg-white text-primary shadow-sm'
                    : darkMode
                    ? 'text-[#cbd5e1] hover:text-white'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                <span className="text-xs leading-none">🇮🇩</span>
                <span className="text-[11px]">ID</span>
              </button>
              <button
                type="button"
                aria-label="Select English Language"
                onClick={() => setLang('EN')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'EN'
                    ? darkMode
                      ? 'bg-[#2563eb] text-white shadow-sm'
                      : 'bg-white text-primary shadow-sm'
                    : darkMode
                    ? 'text-[#cbd5e1] hover:text-[#38bdf8]'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                <span className="text-xs leading-none">🇬🇧</span>
                <span className="text-[11px]">EN</span>
              </button>
            </div>

            {/* Dark/Light Toggle */}
            <button
              type="button"
              aria-label="Toggle Light/Dark theme"
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-[#111a2e] text-[#bef264] hover:text-white hover:bg-[#1e293b] border-[#23324f]'
                  : 'bg-[#f2f3ff] text-slate-800 hover:text-primary hover:bg-[#eaedff] border-[#eaedff]'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-base">
                {darkMode ? 'dark_mode' : 'light_mode'}
              </span>
            </button>

            {/* CTA Button */}
            <a
              href="#diskusi-proyek"
              className="inline-flex items-center justify-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-4 py-2 rounded-full shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all text-xs sm:text-sm"
            >
              {lang === 'ID' ? 'Diskusi Proyek' : 'Discuss Project'}
            </a>

            {/* Avatar Pill */}
            <div className="flex items-center pl-0.5">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1X_8adeO16jpWavl99sgxtG0OpP9YJk8gdMedOwnqKtTv6B-lSGomwAO4Zh0izPtL_Yrf3Y4fIJi3ccXJwX-E4EWmRFSpqel9790et7iWvEhFU_zVnebEeGJuU5GEMfSE34DohzVCSOo4bBreA9X4v1PVTo6OKQUu_tAhP-tw0NAgozUs-xjnyz2A6E2jHwGIVFtUmO07ULgogFfULOJ4WnnkK1sXyWiyWQisskbKxlU57gqKfMsBI8NxQ"
                alt="Yahya Aditya Saputra"
                className={`w-8 h-8 rounded-full object-cover ring-2 ${
                  darkMode ? 'ring-[#38bdf8]/50' : 'ring-[#dce1ff]'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-1.5 rounded-full ${
                darkMode ? 'text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden mt-2 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col gap-2 border ${
              darkMode
                ? 'bg-[#0f172a]/95 border-[#23324f]'
                : 'bg-white/95 border-slate-200'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  darkMode
                    ? 'text-[#cbd5e1] hover:bg-[#16223b] hover:text-[#38bdf8]'
                    : 'text-slate-800 hover:bg-blue-50 hover:text-primary'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
