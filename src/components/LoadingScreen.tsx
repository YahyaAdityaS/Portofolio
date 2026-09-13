import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
  darkMode: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, darkMode }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Memuat ikon & font sistem...');

  const fastStatuses = [
    'Memuat aset ikon & tipografi antarmuka...',
    'Menyiapkan modul arsitektur & komponen...',
    'Mengunduh data studi kasus & proyek...',
    'Sinkronisasi API Google Sheets...',
    'Mengaktifkan interaksi kursor & efek visual...',
    'Pemeriksaan akhir sistem...',
    'Portofolio siap dieksplorasi!',
  ];

  useEffect(() => {
    // 2.4 seconds duration (in the 2-3s range requested)
    const totalDuration = 2400;
    const startTime = performance.now();
    let animationFrameId: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / totalDuration, 1);

      // Smooth cubic easing for fluid, non-stiff progression
      const easedT =
        rawT < 0.5
          ? 4 * rawT * rawT * rawT
          : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      const currentPct = Math.min(Math.round(easedT * 100), 100);
      setProgress(currentPct);

      // Transition status messages synchronously with progress
      const statusIdx = Math.min(
        Math.floor(rawT * fastStatuses.length),
        fastStatuses.length - 1
      );
      setStatusText(fastStatuses[statusIdx]);

      if (rawT < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setProgress(100);
        setTimeout(() => {
          onComplete();
        }, 180);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  // Skill tags with rich, vibrant colors (not boring white)
  const skillChips = [
    {
      name: 'UI/UX Design',
      color: darkMode
        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
        : 'border-emerald-500/50 bg-emerald-50 text-emerald-700',
      dot: 'bg-emerald-400',
    },
    {
      name: 'Front-End',
      color: darkMode
        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
        : 'border-cyan-500/50 bg-cyan-50 text-cyan-700',
      dot: 'bg-cyan-400',
    },
    {
      name: 'Back-End',
      color: darkMode
        ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
        : 'border-indigo-500/50 bg-indigo-50 text-indigo-700',
      dot: 'bg-indigo-400',
    },
    {
      name: 'Creative',
      color: darkMode
        ? 'border-lime-500/40 bg-lime-500/10 text-[#bef264]'
        : 'border-lime-600/50 bg-lime-50 text-[#4d6300]',
      dot: 'bg-[#bef264]',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.12,
        filter: 'blur(10px)',
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      }}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none ${
        darkMode ? 'bg-[#060a12] text-white' : 'bg-[#f8faff] text-[#0f172a]'
      }`}
    >
      {/* Ambient background glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tr from-[#2563eb]/25 via-[#38bdf8]/20 to-[#bef264]/20 blur-[90px]"
        />
        {/* Subtle dot-grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1.5px 1.5px, currentColor 1.5px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Centered Content (NO bulky card box - clean, direct layout as requested) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center text-center px-4"
      >
        {/* Brand Monogram Badge with Ambient Glow */}
        <div className="relative mb-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2.5 rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#06b6d4] to-[#bef264] opacity-40 blur-md"
          />
          <div
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl tracking-tighter shadow-xl border ${
              darkMode
                ? 'bg-[#0b101c] border-white/15 text-white shadow-black/40'
                : 'bg-white border-slate-200/90 text-slate-900 shadow-blue-500/10'
            }`}
          >
            <span className="bg-gradient-to-br from-[#2563eb] via-[#0284c7] to-[#10b981] bg-clip-text text-transparent">
              YAS
            </span>
          </div>
        </div>

        {/* Identity Title */}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1 text-inherit">
          Yahya Aditya Saputra
        </h1>
        <p
          className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-6 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          PERSONAL PORTFOLIO • 2026
        </p>

        {/* Default Circular Spinner */}
        <div className="relative w-12 h-12 flex items-center justify-center my-3">
          <div
            className={`w-11 h-11 rounded-full border-[3px] ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}
          />
          <div
            className={`absolute inset-0 rounded-full border-[3px] border-transparent animate-spin ${
              darkMode
                ? 'border-t-[#bef264] border-r-[#06b6d4]'
                : 'border-t-[#2563eb] border-r-[#06b6d4]'
            }`}
            style={{ animationDuration: '0.85s' }}
          />
        </div>

        {/* Dynamic Status Text & Percentage */}
        <div className="w-full flex items-center justify-between text-xs font-bold mb-6 px-1">
          <span
            className={`text-left text-[11px] sm:text-xs font-semibold truncate max-w-[75%] transition-all duration-150 ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {statusText}
          </span>
          <span
            className={`font-mono text-xs sm:text-sm font-black tabular-nums ${
              darkMode ? 'text-[#bef264]' : 'text-[#2563eb]'
            }`}
          >
            {progress}%
          </span>
        </div>

        {/* Colorful Skill Tags (Vibrant, Not Boring White) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {skillChips.map((chip) => (
            <motion.div
              key={chip.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border shadow-xs transition-transform hover:scale-105 ${chip.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${chip.dot} animate-pulse`} />
              <span>{chip.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
