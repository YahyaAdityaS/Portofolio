import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sliders, 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  Layers, 
  RefreshCw, 
  Flame, 
  MousePointerClick, 
  Code 
} from 'lucide-react';

export const InteractiveLab: React.FC = () => {
  const [accentTheme, setAccentTheme] = useState<'blue' | 'lime' | 'lavender' | 'mint' | 'coral'>('lime');
  const [radius, setRadius] = useState<'sm' | 'md' | 'lg' | 'full'>('lg');
  const [shadowDepth, setShadowDepth] = useState<number>(4);
  const [clickCount, setClickCount] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [animationTrigger, setAnimationTrigger] = useState<number>(0);

  const themes = {
    blue: {
      name: 'Electric Royal',
      bg: 'bg-[#1D4ED8]',
      border: 'border-[#1D4ED8]',
      accentBg: '#1D4ED8',
      text: 'text-white',
      badge: 'bg-[#CCFF00] text-slate-950',
      tag: 'bg-white/20 text-white',
    },
    lime: {
      name: 'Acid Lime',
      bg: 'bg-[#CCFF00]',
      border: 'border-slate-950',
      accentBg: '#CCFF00',
      text: 'text-slate-950',
      badge: 'bg-slate-950 text-[#CCFF00]',
      tag: 'bg-slate-950/10 text-slate-950',
    },
    lavender: {
      name: 'Frosted Lilac',
      bg: 'bg-[#A78BFA]',
      border: 'border-purple-900',
      accentBg: '#A78BFA',
      text: 'text-slate-950',
      badge: 'bg-purple-950 text-white',
      tag: 'bg-purple-900/15 text-purple-950',
    },
    mint: {
      name: 'Cool Mint',
      bg: 'bg-[#34D399]',
      border: 'border-emerald-950',
      accentBg: '#34D399',
      text: 'text-slate-950',
      badge: 'bg-emerald-950 text-white',
      tag: 'bg-emerald-950/15 text-emerald-950',
    },
    coral: {
      name: 'Neo Coral',
      bg: 'bg-[#FB7185]',
      border: 'border-rose-950',
      accentBg: '#FB7185',
      text: 'text-slate-950',
      badge: 'bg-rose-950 text-white',
      tag: 'bg-rose-950/15 text-rose-950',
    },
  };

  const currentTheme = themes[accentTheme];

  const radiusClasses = {
    sm: 'rounded-xl',
    md: 'rounded-2xl',
    lg: 'rounded-3xl',
    full: 'rounded-[38px]',
  };

  const getShadowStyle = () => {
    if (shadowDepth === 0) return '0 0 0 0 transparent';
    return `${shadowDepth}px ${shadowDepth}px 0px #0f172a`;
  };

  const generatedTailwind = `className="${currentTheme.bg} ${radiusClasses[radius]} border-2 border-slate-950 p-6 shadow-[${shadowDepth}px_${shadowDepth}px_0px_#0f172a] transition-all"`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedTailwind);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleInteractiveClick = () => {
    setClickCount((prev) => prev + 1);
    setAnimationTrigger((prev) => prev + 1);
  };

  return (
    <section id="lab" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white rounded-full px-3.5 py-1 text-xs font-black tracking-wider uppercase mb-3">
          <Flame className="w-3.5 h-3.5 text-[#CCFF00]" />
          <span>Experimental Sandbox</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          Interactive Bento Playground
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-1.5">
          Tweak token variables, test kinetic spring physics, and inspect zero-latency styling in real-time.
        </p>
      </div>

      {/* Laboratory Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-slate-900 shadow-sm">
        
        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1D4ED8]" />
                Design Tokens Inspector
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                Tokens: v4.1-spec
              </span>
            </div>

            {/* Accent Theme Selection */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                Color Palette Token
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(themes) as (keyof typeof themes)[]).map((tKey) => {
                  const t = themes[tKey];
                  const active = accentTheme === tKey;
                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => setAccentTheme(tKey)}
                      className={`h-11 rounded-xl flex flex-col items-center justify-center border-2 transition-transform cursor-pointer ${
                        t.bg
                      } ${
                        active 
                          ? 'border-slate-950 scale-105 shadow-[2px_2px_0px_#0f172a]' 
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      title={t.name}
                    >
                      {active && <span className="text-xs font-black">✓</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-1.5">
                Current: <span className="font-bold text-slate-800">{currentTheme.name}</span>
              </p>
            </div>

            {/* Border Radius Control */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                Corner Radii Spec
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['sm', 'md', 'lg', 'full'] as const).map((rKey) => (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => setRadius(rKey)}
                    className={`py-2 px-3 text-xs font-extrabold rounded-xl border-2 transition-all cursor-pointer ${
                      radius === rKey
                        ? 'bg-slate-950 text-[#CCFF00] border-slate-950 shadow-[2px_2px_0px_#0f172a]'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-900'
                    }`}
                  >
                    {rKey === 'sm' ? '12px' : rKey === 'md' ? '16px' : rKey === 'lg' ? '24px' : '38px'}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow Depth Tactile Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Neo-Brutalist Depth
                </label>
                <span className="text-xs font-mono font-bold text-slate-900">{shadowDepth}px offset</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="2"
                value={shadowDepth}
                onChange={(e) => setShadowDepth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8]"
              />
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="bg-slate-950 rounded-2xl p-4 text-white font-mono text-xs border-2 border-slate-900">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="text-white/60 text-[11px] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#CCFF00]" />
                Tailwind Output
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] text-[#CCFF00] hover:underline cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Class
                  </>
                )}
              </button>
            </div>
            <p className="text-blue-200 break-all leading-relaxed select-all">
              {generatedTailwind}
            </p>
          </div>
        </div>

        {/* Live Interactive Preview Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF8FF] rounded-2xl p-6 sm:p-8 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
          {/* Subtle Grid Background Pattern */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="w-full max-w-md relative z-10">
            {/* The Dynamic Custom Bento Card */}
            <motion.div
              key={`${accentTheme}-${radius}-${animationTrigger}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                boxShadow: getShadowStyle(),
              }}
              className={`${currentTheme.bg} ${radiusClasses[radius]} border-2 border-slate-950 p-6 sm:p-7 transition-all duration-200 relative`}
            >
              {/* Card Header Pill */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full ${currentTheme.badge}`}>
                  LIVE SANDBOX TILE
                </span>
                <span className="text-[11px] font-mono font-bold opacity-75">
                  ID: #L4B-99
                </span>
              </div>

              {/* Title & Body */}
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${currentTheme.text} mb-2`}>
                Tactile Neo-Brutalist Card
              </h3>
              <p className={`text-xs sm:text-sm ${currentTheme.text} opacity-90 leading-relaxed mb-6 font-medium`}>
                This interactive widget demonstrates instant reactive CSS rendering, tight spatial hierarchy, and zero-compromise tactile feedback.
              </p>

              {/* Interactive Counter Trigger */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-950/15">
                <button
                  type="button"
                  onClick={handleInteractiveClick}
                  className="tactile-btn bg-slate-950 hover:bg-slate-900 text-[#CCFF00] border-2 border-slate-950 rounded-full px-5 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer"
                >
                  <MousePointerClick className="w-3.5 h-3.5" />
                  <span>Click Me: {clickCount}</span>
                </button>

                <div className={`text-xs font-mono font-bold px-3 py-1 rounded-lg ${currentTheme.tag}`}>
                  {clickCount === 0 ? 'Click to trigger test' : `Energy: ${clickCount * 12}kW`}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3 h-3 text-[#1D4ED8]" />
              Real-time reactive styling sandbox (zero layout reflow)
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
