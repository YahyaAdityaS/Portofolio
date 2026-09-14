import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
  darkMode?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  darkMode = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Menginisialisasi Arsitektur Web Skala Tinggi...');
  const isCompletedRef = useRef(false);

  const steps = [
    'Menginisialisasi Arsitektur Web Skala Tinggi...',
    'Menghubungkan Design Tokens & CSS Variables...',
    'Mengoptimalkan Core Web Vitals (99.2% benchmark)...',
    'Memuat Arsip Proyek & Studi Kasus...',
    'Menyiapkan Antarmuka Interaktif...',
  ];

  useEffect(() => {
    // Total duration: 2.5 seconds (fits cleanly in 2-3s range)
    const totalDuration = 2500;
    const startTime = performance.now();
    let animationFrameId: number;

    const update = (now: number) => {
      if (isCompletedRef.current) return;

      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / totalDuration, 1);

      // Smooth cubic bezier easing: fast takeoff, smooth deceleration to 100%
      const easedT =
        rawT < 0.5
          ? 4 * rawT * rawT * rawT
          : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      const currentPct = Math.min(Math.round(easedT * 100), 100);
      setProgress(currentPct);

      const stepIndex = Math.min(
        Math.floor(rawT * steps.length),
        steps.length - 1
      );
      setStepText(steps[stepIndex]);

      if (rawT < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        isCompletedRef.current = true;
        setProgress(100);
        setTimeout(() => {
          onComplete();
        }, 180);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  const handleSkip = () => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setProgress(100);
    setStepText('Membuka Portofolio...');
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: 'blur(8px)',
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`fixed inset-0 z-[999] font-sans w-full h-full min-h-screen flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 ${
        darkMode ? 'bg-[#0b1326] text-slate-100' : 'bg-[#faf8ff] text-slate-800'
      }`}
    >
      {/* Background Ambience & Engineering Blueprint Grid */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 ${
          darkMode
            ? 'bg-gradient-to-b from-[#0b1326] via-[#090e1c] to-[#060913]'
            : 'bg-gradient-to-b from-[#faf8ff] via-[#f3f5fa] to-[#ecf0f8]'
        }`}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none z-0 ${
          darkMode ? 'bg-sky-500/10' : 'bg-sky-400/15'
        }`}
      />
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: darkMode
            ? 'linear-gradient(to right, rgba(56, 189, 248, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(37, 99, 235, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(37, 99, 235, 0.25) 1px, transparent 1px)',
        }}
      />

      {/* Top Bar Header Badge */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-end relative z-10">
        <div
          className={`px-3 py-1 rounded-full text-xs font-sans flex items-center gap-2 backdrop-blur-md border ${
            darkMode
              ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
              : 'bg-white/80 border-slate-200/90 text-slate-700 shadow-xs'
          }`}
        >
          <span className="text-[11px]">🇮🇩</span>
          <span className="font-medium text-[11px]">ID / EN</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </header>

      {/* MAIN LOADING CORE CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 my-auto py-10">
        <div className="w-full max-w-xl text-center flex flex-col items-center space-y-8">
          {/* Badge & Typography Headline */}
          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                darkMode
                  ? 'bg-sky-500/10 border-sky-400/20 text-sky-300'
                  : 'bg-sky-50 border-sky-200/80 text-sky-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>Portfolio Experience</span>
            </div>
            <h1
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Engineering Scalability.
              <br />
              <span
                className={`bg-clip-text text-transparent ${
                  darkMode
                    ? 'bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-300'
                    : 'bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600'
                }`}
              >
                Designing Precision.
              </span>
            </h1>
            <p
              className={`text-sm font-normal tracking-normal max-w-md mx-auto ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Menyiapkan antarmuka interaktif, portofolio sistem, &amp; studi kasus terpilih.
            </p>
          </div>

          {/* Terminal / Browser Window Card */}
          <div
            className={`w-full max-w-lg mx-auto rounded-[8px] border shadow-xl backdrop-blur-md overflow-hidden text-left transition-colors duration-300 ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800/80 shadow-2xl'
                : 'bg-white/95 border-slate-200/90 shadow-slate-200/70'
            }`}
          >
            {/* Top Mac-style bar */}
            <div
              className={`flex items-center justify-between px-4 py-2.5 border-b ${
                darkMode
                  ? 'bg-slate-900/90 border-slate-800/60'
                  : 'bg-slate-50/90 border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/90 border border-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/90 border border-amber-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/90 border border-emerald-500/30" />
              </div>
              <div
                className={`flex-1 max-w-[240px] mx-2 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[5px] text-[11px] font-mono border ${
                  darkMode
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                }`}
              >
                <svg
                  className="w-3 h-3 text-sky-500 animate-spin flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <span className="truncate font-sans font-medium">yahya-aditya.dev</span>
                <span
                  className={`font-sans text-[10px] hidden sm:inline ${
                    darkMode ? 'text-sky-400' : 'text-blue-600 font-semibold'
                  }`}
                >
                  /portfolio
                </span>
              </div>
              <div
                className={`flex items-center gap-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  darkMode
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>200 OK</span>
              </div>
            </div>

            {/* Sub header */}
            <div
              className={`px-4 py-2.5 border-b flex items-center justify-between ${
                darkMode
                  ? 'bg-[#0b1326]/60 border-slate-800/40'
                  : 'bg-slate-100/60 border-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-sm bg-blue-500 animate-pulse flex-shrink-0" />
                <span
                  className={`text-xs font-semibold truncate ${
                    darkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  Yahya Aditya Saputra — Portfolio
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono tracking-tight shrink-0">
                SSR • v2.4.0
              </span>
            </div>

            {/* Progress status & bar */}
            <div
              className={`px-5 py-4 space-y-3 ${
                darkMode ? 'bg-slate-950/50' : 'bg-slate-50/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium gap-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <svg
                    className={`w-3 h-3 shrink-0 animate-spin ${
                      darkMode ? 'text-sky-400' : 'text-blue-600'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  <span
                    className={`text-xs truncate transition-all duration-300 ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {stepText}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-0.5 font-mono font-bold shrink-0 ${
                    darkMode ? 'text-sky-400' : 'text-blue-600'
                  }`}
                >
                  <span className="text-xs">{progress}</span>
                  <span className="text-[10px] opacity-80">%</span>
                </div>
              </div>

              <div
                className={`h-1.5 w-full rounded-full overflow-hidden p-0 border ${
                  darkMode
                    ? 'bg-slate-900/90 border-slate-800/80'
                    : 'bg-slate-200/80 border-slate-300/70'
                }`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Skip Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSkip}
              className={`group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 border backdrop-blur-md cursor-pointer ${
                darkMode
                  ? 'bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white border-sky-400/30 hover:border-sky-400/80 shadow-[0_0_16px_rgba(56,189,248,0.15)] hover:shadow-[0_0_24px_rgba(56,189,248,0.35)]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300/90 hover:border-sky-400/80 shadow-sm hover:shadow-md'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 group-hover:bg-emerald-400 transition-colors" />
              <span>Lewati &amp; Masuk</span>
              <svg
                className="w-3.5 h-3.5 text-sky-500 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER BAR: METRICS & COPYRIGHT */}
      <footer
        className={`w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans relative z-10 border-t ${
          darkMode
            ? 'border-slate-800/40 text-slate-400'
            : 'border-slate-200/80 text-slate-500'
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Status: Tersedia untuk Kolaborasi</span>
          </span>
          <span className={darkMode ? 'hidden md:inline text-slate-700' : 'hidden md:inline text-slate-300'}>
            •
          </span>
          <span className="hidden md:inline">SMK Telkom Malang Alum</span>
        </div>

        <div className="flex items-center gap-6">
          <span>Response Time: &lt; 24 Jam</span>
          <span className={darkMode ? 'text-slate-600' : 'text-slate-400'}>
            © 2025 Yahya Aditya Saputra
          </span>
        </div>
      </footer>
    </motion.div>
  );
};
