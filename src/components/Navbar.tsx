import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface NavbarProps {
  lang: 'ID' | 'EN';
  setLang: (lang: 'ID' | 'EN') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('tentang');

  const navLinks = [
    { id: 'tentang', label: lang === 'ID' ? 'Tentang' : 'About', href: '#tentang' },
    { id: 'keahlian', label: lang === 'ID' ? 'Keahlian' : 'Skills', href: '#keahlian' },
    { id: 'proyek-pilihan', label: lang === 'ID' ? 'Proyek Pilihan' : 'Featured Projects', href: '#proyek-pilihan' },
    { id: 'sertifikat', label: lang === 'ID' ? 'Sertifikat & Pengalaman' : 'Certificates & Experience', href: '#sertifikat' },
    { id: 'testimoni', label: lang === 'ID' ? 'Testimoni & Rating' : 'Reviews & Rating', href: '#testimoni' },
  ];

  // Detect scroll state and active section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const scrollPosition = window.scrollY + 140;
      const sections = ['tentang', 'keahlian', 'proyek-pilihan', 'sertifikat', 'pengalaman', 'testimoni', 'diskusi-proyek'];

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            // Sertifikat & Pengalaman digabung dalam satu indikator nav
            const targetSection = sections[i] === 'pengalaman' ? 'sertifikat' : sections[i];
            setActiveSection(targetSection);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4 pointer-events-none transition-all duration-300">
      <div
        className={`mx-auto px-3 sm:px-6 pointer-events-auto transition-all duration-500 ease-out ${
          isScrolled ? 'max-w-[1140px]' : 'max-w-[1280px]'
        }`}
      >
        <div
          className={`w-full backdrop-blur-xl rounded-full px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2 transition-all duration-500 ${
            isScrolled
              ? darkMode
                ? 'bg-[#0b1120]/95 border border-[#334155] shadow-[0_12px_32px_rgba(0,0,0,0.55)]'
                : 'bg-white/95 border border-slate-300/90 shadow-[0_12px_32px_rgba(37,99,235,0.09)]'
              : darkMode
              ? 'bg-[#0f172a]/85 border border-[#23324f]'
              : 'bg-white/85 border border-slate-200/80 shadow-md'
          }`}
        >
          {/* Left: Brand + Available Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <a
              className="flex items-center gap-2 group flex-shrink-0"
              href="#tentang"
              onClick={(e) => scrollToSection(e, 'tentang')}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${
                  darkMode ? 'bg-[#2563eb]' : 'bg-primary'
                }`}
              >
                <span className="text-white font-bold text-xs sm:text-sm tracking-tighter">Y</span>
              </div>
              <span
                className={`font-bold text-sm sm:text-base tracking-tight hidden sm:inline-block ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                YAS<span className="inline-block w-1.5 h-1.5 rounded-full bg-[#bef264] ml-0.5"></span>
              </span>
            </a>

            {/* Badge Open to Work */}
            <div
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs whitespace-nowrap flex-shrink-0 ${
                darkMode
                  ? 'bg-[#bef264]/15 text-[#bef264] border-[#bef264]/40'
                  : 'bg-[#c3f400]/20 text-[#314100] border-[#a3e635]/70'
              }`}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bef264] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bef264]"></span>
              </span>
              <span className="font-extrabold text-[10px] uppercase tracking-wider whitespace-nowrap">
                OPEN TO WORK
              </span>
            </div>
          </div>

          {/* Center Navigation Links with Active State */}
          <nav
            className={`hidden lg:flex items-center gap-0 p-1 rounded-full border transition-all duration-300 relative ${
              darkMode
                ? 'bg-[#111a2e]/80 border-[#23324f]'
                : 'bg-[#f2f3ff]/80 border-[#eaedff]'
            }`}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={`px-2 xl:px-2.5 py-1.5 rounded-full text-xs xl:text-sm font-bold relative whitespace-nowrap flex-shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : darkMode
                      ? 'text-[#cbd5e1] hover:text-[#38bdf8] hover:bg-[#16223b]/50'
                      : 'text-slate-600 hover:text-primary hover:bg-white/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavbarIndicator"
                      className="absolute inset-0 rounded-full bg-[#2563eb] shadow-sm"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavbarDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#bef264] z-20"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Language Toggle */}
            <div
              className={`flex items-center p-0.5 rounded-full border text-[11px] font-bold transition-colors flex-shrink-0 ${
                darkMode
                  ? 'bg-[#111a2e] border-[#23324f]'
                  : 'bg-[#f2f3ff] border-[#eaedff]'
              }`}
            >
              <button
                type="button"
                onClick={() => setLang('ID')}
                className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'ID'
                    ? darkMode
                      ? 'bg-[#2563eb] text-white shadow-xs'
                      : 'bg-white text-primary shadow-xs'
                    : darkMode
                    ? 'text-[#94a3b8] hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLang('EN')}
                className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'EN'
                    ? darkMode
                      ? 'bg-[#2563eb] text-white shadow-xs'
                      : 'bg-white text-primary shadow-xs'
                    : darkMode
                    ? 'text-[#94a3b8] hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border flex-shrink-0 ${
                darkMode
                  ? 'bg-[#16223b] border-[#334155] text-[#bef264] hover:bg-[#1e293b]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-base sm:text-lg">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Direct Contact Button */}
            <a
              href="#diskusi-proyek"
              onClick={(e) => scrollToSection(e, 'diskusi-proyek')}
              className={`hidden sm:inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full font-bold text-xs transition-all flex-shrink-0 shadow-xs hover:shadow-sm ${
                darkMode
                  ? 'bg-[#bef264] hover:bg-[#a3e635] text-[#080c16]'
                  : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
              }`}
            >
              <span className="whitespace-nowrap">{lang === 'ID' ? 'Kontak' : 'Contact'}</span>
              <span className="material-symbols-outlined text-sm shrink-0">arrow_forward</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border flex-shrink-0 ${
                darkMode
                  ? 'bg-[#111a2e] border-[#23324f] text-white'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden mt-2 p-4 rounded-3xl border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
              darkMode
                ? 'bg-[#0f172a]/95 border-[#23324f]'
                : 'bg-white/95 border-slate-200 shadow-[0_15px_40px_rgba(0,0,0,0.1)]'
            }`}
          >
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${
                      isActive
                        ? darkMode
                          ? 'bg-[#2563eb] text-white shadow-sm'
                          : 'bg-[#bef264] text-[#131b2e] border border-[#a3e635] shadow-xs'
                        : darkMode
                        ? 'text-[#cbd5e1] hover:bg-[#16223b]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className={`material-symbols-outlined text-base ${darkMode ? 'text-white' : 'text-[#131b2e]'}`}>
                        check
                      </span>
                    )}
                  </a>
                );
              })}
              
              <a
                href="#diskusi-proyek"
                onClick={(e) => scrollToSection(e, 'diskusi-proyek')}
                className={`mt-2.5 px-4 py-3 rounded-2xl font-bold text-sm text-center transition-all shadow-md flex items-center justify-center gap-2 ${
                  darkMode
                    ? 'bg-[#bef264] hover:bg-[#a3e635] text-[#080c16]'
                    : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                }`}
              >
                <span>{lang === 'ID' ? 'Mulai Diskusi Proyek' : 'Start Project Inquiry'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
