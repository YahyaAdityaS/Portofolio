import React from 'react';

interface HeroProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
  onOpenCV?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, darkMode, onOpenCV }) => {
  return (
    <section className="relative overflow-hidden w-full pb-space-xl pt-space-lg transition-colors duration-300 scroll-mt-28" id="tentang">
      {/* Fluid background glow orbs */}
      <div
        className={`absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[520px] rounded-full blur-[140px] pointer-events-none transition-colors duration-500 ${
          darkMode ? 'bg-[#2563eb]/20' : 'bg-[#dce1ff]/60'
        }`}
      />
      <div
        className={`absolute top-40 -right-24 w-[420px] h-[420px] rounded-full blur-[100px] pointer-events-none transition-colors duration-500 ${
          darkMode ? 'bg-[#bef264]/10' : 'bg-[#bef264]/30'
        }`}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Hero Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          
          {/* Left Text Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Clean Role Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-space-md transition-colors ${
                darkMode
                  ? 'bg-[#111a2e] border border-[#38bdf8]/40'
                  : 'bg-[#e2e7ff] text-primary border border-primary/20'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bef264] opacity-75"></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    darkMode ? 'bg-[#38bdf8]' : 'bg-primary'
                  }`}
                ></span>
              </span>
              <span
                className={`text-[11px] font-bold tracking-wider uppercase ${
                  darkMode ? 'text-[#38bdf8]' : 'text-primary'
                }`}
              >
                Full-Stack & UI Architect
              </span>
            </div>

            {/* Ultra-Clean Modern Display Headline */}
            <div className="mb-space-md">
              <h1
                className={`text-4xl sm:text-5xl lg:text-display-hero font-extrabold tracking-tight leading-[1.1] text-left transition-colors ${
                  darkMode ? 'text-white' : 'text-[#0f172a]'
                }`}
              >
                Engineering Scalability.
                <span
                  className={`block transition-colors ${
                    darkMode ? 'text-[#38bdf8]' : 'text-primary'
                  }`}
                >
                  Designing Precision.
                </span>
              </h1>
            </div>

            {/* Crisp Concise Subcopy */}
            <p
              className={`text-lg max-w-xl mb-space-lg leading-relaxed transition-colors ${
                darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
              }`}
            >
              {lang === 'ID' ? (
                <>
                  Halo, saya{' '}
                  <span
                    className={`font-bold underline decoration-[#bef264] decoration-4 underline-offset-4 ${
                      darkMode ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    Yahya Aditya Saputra
                  </span>
                  . Membangun sistem web skala tinggi dengan backend performan dan antarmuka interaktif kelas dunia.
                </>
              ) : (
                <>
                  Hi, I am{' '}
                  <span
                    className={`font-bold underline decoration-[#bef264] decoration-4 underline-offset-4 ${
                      darkMode ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    Yahya Aditya Saputra
                  </span>
                  . Engineering high-scale web systems with resilient backends and world-class interactive interfaces.
                </>
              )}
            </p>

            {/* 50/50 Balanced Hero CTAs */}
            <div className="flex flex-wrap items-center gap-space-md mb-space-lg">
              <a
                href="#proyek-pilihan"
                className={`inline-flex items-center justify-center gap-2 bg-[#bef264] hover:bg-[#a3e635] text-[#080c16] px-8 py-3.5 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-all font-extrabold group ${
                  darkMode
                    ? 'shadow-[0_4px_0px_rgba(0,0,0,0.3)]'
                    : 'shadow-[0_4px_0px_rgba(0,0,0,0.15)]'
                }`}
              >
                <span className="text-[#080c16] font-black">
                  {lang === 'ID' ? 'Jelajahi Proyek' : 'Explore Projects'}
                </span>
                <span className="material-symbols-outlined text-lg text-[#080c16] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform font-bold">
                  arrow_outward
                </span>
              </a>

              <button
                type="button"
                onClick={onOpenCV}
                className={`inline-flex items-center justify-center gap-2 border-2 px-6 py-3 rounded-full shadow-sm transition-all font-bold cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                  darkMode
                    ? 'bg-[#0d1527] text-[#38bdf8] border-[#38bdf8] hover:bg-[#16223b] hover:text-white'
                    : 'bg-white text-[#1d4ed8] border-[#1d4ed8] hover:bg-blue-50'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-lg ${
                    darkMode ? 'text-[#38bdf8]' : 'text-primary'
                  }`}
                >
                  download
                </span>
                <span>{lang === 'ID' ? 'Unduh CV • PDF' : 'Download CV • PDF'}</span>
              </button>

              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                  darkMode
                    ? 'bg-[#bef264]/20 text-[#bef264] border border-[#bef264]/60'
                    : 'bg-[#dce1ff] text-primary'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-sm ${
                    darkMode ? 'text-[#bef264]' : 'text-primary'
                  }`}
                >
                  bolt
                </span>
                <span>
                  {lang === 'ID' ? 'Respon Cepat < 24 Jam' : 'Fast Response < 24h'}
                </span>
              </div>
            </div>

            {/* Social Proof & Experience Metric Banner Strip */}
            <div
              className={`w-full max-w-xl p-3 border rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 transition-colors ${
                darkMode
                  ? 'bg-[#111a2e]/90 border-[#23324f]'
                  : 'bg-white/95 border-[#eaedff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <div
                    className={`h-8 w-8 rounded-full bg-[#2563eb] text-white text-[11px] font-bold flex items-center justify-center ring-2 shadow-sm ${
                      darkMode ? 'ring-[#111a2e]' : 'ring-white'
                    }`}
                  >
                    TS
                  </div>
                  <div
                    className={`h-8 w-8 rounded-full bg-[#bef264] text-[#080c16] text-[11px] font-extrabold flex items-center justify-center ring-2 shadow-sm ${
                      darkMode ? 'ring-[#111a2e]' : 'ring-white'
                    }`}
                  >
                    N14
                  </div>
                  <div
                    className={`h-8 w-8 rounded-full bg-[#7e22ce] text-white text-[11px] font-bold flex items-center justify-center ring-2 shadow-sm ${
                      darkMode ? 'ring-[#111a2e]' : 'ring-white'
                    }`}
                  >
                    PY
                  </div>
                  <div
                    className={`h-8 w-8 rounded-full bg-[#1e293b] text-white text-[11px] font-bold flex items-center justify-center ring-2 shadow-sm ${
                      darkMode ? 'ring-[#111a2e]' : 'ring-white'
                    }`}
                  >
                    FIG
                  </div>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold leading-none ${
                      darkMode ? 'text-white' : 'text-[#131b2e]'
                    }`}
                  >
                    15+ Proyek Terkirim
                  </span>
                  <span className="text-[10px] text-[#94a3b8]">
                    Production-ready Stack
                  </span>
                </div>
              </div>

              <div
                className={`h-6 w-px hidden sm:block ${
                  darkMode ? 'bg-[#23324f]' : 'bg-[#eaedff]'
                }`}
              ></div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#facc15]">
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold leading-none ${
                      darkMode ? 'text-white' : 'text-[#131b2e]'
                    }`}
                  >
                    4.9/5 Client Rating
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      darkMode ? 'text-[#38bdf8]' : 'text-primary'
                    }`}
                  >
                    99.2% Lighthouse Speed
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Bento Visual Card (5 cols - sized down 10% to 90%) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Background geometric highlight card */}
            <div
              className={`relative border rounded-3xl p-4 shadow-xl overflow-hidden group transition-all duration-300 w-full max-w-[90%] ${
                darkMode
                  ? 'bg-[#111a2e] border-[#23324f]'
                  : 'bg-white border-[#eaedff]'
              }`}
            >
              {/* Top Card Nav Strip */}
              <div
                className={`flex items-center justify-between pb-3 mb-3 border-b transition-colors ${
                  darkMode ? 'border-[#1e293b]' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-[#bef264]"></span>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      darkMode ? 'bg-[#38bdf8]' : 'bg-primary'
                    }`}
                  ></span>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono transition-colors ${
                    darkMode
                      ? 'bg-[#16223b] border border-[#334155] text-[#cbd5e1]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  yahyaditya-s.dev
                </span>
              </div>

              {/* Portrait Box with Stickers */}
              <div
                className={`relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center border transition-colors ${
                  darkMode
                    ? 'bg-gradient-to-b from-[#2563eb]/20 to-[#111a2e] border-[#1e293b]'
                    : 'bg-gradient-to-b from-blue-50 to-indigo-100/50 border-slate-100'
                }`}
              >
                <img
                  src="/public/images/yahyadityas.webp"
                  alt="Yahya Aditya Saputra"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Top Badge: Status */}
                <div className="absolute top-3 right-3 bg-[#bef264] text-[#080c16] px-3.5 py-1 rounded-full text-[11px] font-extrabold shadow-[0_3px_0px_rgba(0,0,0,0.3)] flex items-center gap-1.5 rotate-3">
                  <span className="material-symbols-outlined text-sm font-black text-[#080c16]">
                    bolt
                  </span>
                  <span className="text-[#080c16]">OPEN FOR HIRES</span>
                </div>

                {/* Floating Bottom Glass Badge: Lighthouse Score */}
                <div
                  className={`absolute bottom-4 left-4 backdrop-blur-md border px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2.5 transition-colors ${
                    darkMode
                      ? 'bg-[#0d1527]/90 border-[#23324f]'
                      : 'bg-white/95 border-[#eaedff]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#bef264] text-[#080c16] flex items-center justify-center font-extrabold text-[10px]">
                    99
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-[11px] leading-none font-bold ${
                        darkMode ? 'text-white' : 'text-[#131b2e]'
                      }`}
                    >
                      Lighthouse Speed
                    </span>
                    <span
                      className={`text-[10px] font-medium ${
                        darkMode ? 'text-[#38bdf8]' : 'text-primary'
                      }`}
                    >
                      Core Web Vitals A+
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="mt-4 pt-1 flex items-center justify-between">
                <div>
                  <h3
                    className={`font-bold text-base transition-colors ${
                      darkMode ? 'text-white' : 'text-[#131b2e]'
                    }`}
                  >
                    Yahya Aditya Saputra
                  </h3>
                  <p
                    className={`text-xs transition-colors ${
                      darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                    }`}
                  >
                    Software Engineer & UI Systems Architect
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-[0_3px_0px_rgba(0,0,0,0.3)] ${
                    darkMode
                      ? 'bg-[#2563eb] border border-[#38bdf8]'
                      : 'bg-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg text-white">
                    code
                  </span>
                </div>
              </div>
            </div>

            {/* Playful Decorative Floating Sticker */}
            <div className="hidden sm:flex absolute -bottom-5 -right-4 bg-[#c084fc] text-[#1e1b4b] px-4 py-2 rounded-full shadow-md items-center gap-1.5 text-xs font-black rotate-[-4deg] border border-purple-300">
              <span className="material-symbols-outlined text-base text-[#1e1b4b]">
                verified
              </span>
              <span className="text-[#1e1b4b]">SMK Telkom Malang</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
