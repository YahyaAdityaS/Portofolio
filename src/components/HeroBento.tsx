import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Download, 
  Github, 
  Linkedin, 
  Twitter, 
  Dribbble, 
  Mail, 
  Copy, 
  Check, 
  Clock, 
  MapPin, 
  Sparkles, 
  Zap, 
  Trophy, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

interface HeroBentoProps {
  onExploreWork: () => void;
  onContactClick: () => void;
}

export const HeroBento: React.FC<HeroBentoProps> = ({ onExploreWork, onContactClick }) => {
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [cvDownloaded, setCvDownloaded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@portobento.dev');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCV = () => {
    setCvDownloaded(true);
    // Simulate instantaneous download feedback
    setTimeout(() => setCvDownloaded(false), 3000);
  };

  return (
    <section id="hero" className="pt-24 sm:pt-28 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 12-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Main Hero Card (8 Cols Desktop) */}
        <motion.div
          id="hero-main-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-slate-900 shadow-sm relative overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle Decorative Geometric Backdrop Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-100/60 via-purple-50/40 to-transparent rounded-bl-full pointer-events-none -z-0" />
          
          <div className="relative z-10">
            {/* Tag / Eyebrow */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 bg-[#1D4ED8] text-white px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                Creative Engineer & Architect
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#FAF8FF] text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                React 19 • WebGL • Design Systems
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15] mb-5">
              Building tactile digital products with{' '}
              <span className="inline-block bg-[#CCFF00] px-2.5 py-0.5 rounded-lg border border-slate-900 shadow-[2px_2px_0px_#0f172a] text-slate-950">
                kinetic polish
              </span>{' '}
              & zero latency.
            </h1>

            {/* Description */}
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-2xl font-normal mb-8">
              I specialize in bridging the gap between high-concept visual design and mission-critical engineering. 
              Crafting neo-brutalist bento architectures, sub-second web applications, and interactive experiences that delight humans.
            </p>
          </div>

          {/* Action Row */}
          <div className="relative z-10 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="hero-explore-work-btn"
                type="button"
                onClick={onExploreWork}
                className="tactile-btn bg-[#CCFF00] hover:bg-[#bbf000] text-slate-950 border-2 border-slate-950 rounded-full px-6 py-3 text-sm sm:text-base font-extrabold flex items-center gap-2 cursor-pointer"
              >
                <span>View Selected Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                id="hero-contact-btn"
                type="button"
                onClick={onContactClick}
                className="tactile-ghost bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 rounded-full px-5 py-3 text-sm sm:text-base font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>Let's Connect</span>
                <Mail className="w-4 h-4 text-[#1D4ED8]" />
              </button>

              <button
                id="hero-cv-btn"
                type="button"
                onClick={handleDownloadCV}
                className="tactile-ghost bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-full px-4 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
                title="Download Resume / CV"
              >
                {cvDownloaded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Download CV</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                id="social-github"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#1D4ED8] hover:text-white border border-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                id="social-linkedin"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#1D4ED8] hover:text-white border border-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                id="social-twitter"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter X Profile"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#1D4ED8] hover:text-white border border-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                id="social-dribbble"
                href="https://dribbble.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Dribbble Portfolio"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#1D4ED8] hover:text-white border border-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <Dribbble className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Profile, Live Presence & Quick Connect Card (4 Cols Desktop) */}
        <motion.div
          id="hero-presence-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-4 bg-[#1D4ED8] text-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-sm flex flex-col justify-between relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#CCFF00]/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Card Header: Avatar & Availability */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
                  alt="Creative Engineer Portrait"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#CCFF00] shadow-[3px_3px_0px_#0f172a]"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center" title="Online now">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div className="text-right">
                <span className="inline-block bg-[#CCFF00] text-slate-950 font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border border-slate-950">
                  OPEN TO WORK
                </span>
                <p className="text-blue-100 text-xs font-semibold mt-1">Full-time / Contract</p>
              </div>
            </div>

            {/* Profile Intro */}
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Alex Sterling
            </h2>
            <p className="text-blue-100 text-xs font-medium mt-0.5">
              Staff Frontend Architect & Creative Technologist
            </p>

            {/* Real-Time Telemetry / Local Time & Location */}
            <div className="mt-6 space-y-2.5">
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-blue-100">
                  <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Base Location</span>
                </div>
                <span className="text-xs font-bold text-white">Singapore / Jakarta</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-blue-100">
                  <Clock className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Local Time (SGT)</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#CCFF00]">
                  {currentTime || '12:00:00'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Copy Email Action Button */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <button
              id="hero-copy-email-btn"
              type="button"
              onClick={handleCopyEmail}
              className="tactile-btn w-full bg-[#CCFF00] hover:bg-[#bbf000] text-slate-950 border border-slate-950 rounded-2xl py-2.5 px-4 text-xs font-extrabold flex items-center justify-between cursor-pointer transition-transform"
            >
              <span className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-900" />
                <span className="truncate">hello@portobento.dev</span>
              </span>
              {copied ? (
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Copied
                </span>
              ) : (
                <span className="bg-slate-900/15 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Metric Bento Tile 1: Years Experience */}
        <motion.div
          id="stat-card-years"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bento-card md:col-span-3 bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-950 tracking-tight">5+</div>
            <p className="text-xs font-medium text-slate-600 mt-1">Years engineering modern web platforms</p>
          </div>
        </motion.div>

        {/* Metric Bento Tile 2: Shipped Projects */}
        <motion.div
          id="stat-card-projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bento-card md:col-span-3 bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Impact</span>
            <div className="w-8 h-8 rounded-xl bg-lime-100 text-lime-900 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-950 tracking-tight">40+</div>
            <p className="text-xs font-medium text-slate-600 mt-1">Production web & mobile apps launched</p>
          </div>
        </motion.div>

        {/* Metric Bento Tile 3: Core Web Vitals */}
        <motion.div
          id="stat-card-vitals"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bento-card md:col-span-3 bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-950 tracking-tight">100%</div>
            <p className="text-xs font-medium text-slate-600 mt-1">Lighthouse Core Web Vitals standard</p>
          </div>
        </motion.div>

        {/* Metric Bento Tile 4: Recognitions */}
        <motion.div
          id="stat-card-awards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bento-card md:col-span-3 bg-[#CCFF00] rounded-3xl p-6 border-2 border-slate-900 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">Accolades</span>
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-[#CCFF00] flex items-center justify-center font-bold">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-950 tracking-tight">3×</div>
            <p className="text-xs font-bold text-slate-800 mt-1">Awwwards & FWA Honors recognition</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
