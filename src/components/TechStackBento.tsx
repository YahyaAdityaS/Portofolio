import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Layers, 
  Palette, 
  Sparkles, 
  Cpu, 
  Box, 
  BarChart2, 
  Activity, 
  Compass, 
  Terminal, 
  Database, 
  Share2, 
  Container, 
  Zap, 
  Eye, 
  Workflow, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/skillsData';

// Map icon names to Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Layers,
  Palette,
  Sparkles,
  Cpu,
  Box,
  BarChart2,
  Activity,
  Compass,
  Terminal,
  Database,
  Share2,
  Container,
  Zap,
  Eye,
  Workflow,
};

export const TechStackBento: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSkillHover, setActiveSkillHover] = useState<string | null>(null);

  const allSkills = SKILL_CATEGORIES.flatMap((c) => c.skills);
  const currentCategoryData = SKILL_CATEGORIES.find((c) => c.id === selectedCategory);
  const displayedSkills = selectedCategory === 'all' 
    ? allSkills 
    : currentCategoryData?.skills || [];

  return (
    <section id="stack" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#CCFF00] border border-slate-900 rounded-full px-3.5 py-1 text-xs font-black tracking-wider uppercase mb-3">
            <Cpu className="w-3.5 h-3.5 text-slate-950" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            Engineering & Technology Stack
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-2">
            A battle-tested arsenal of modern frameworks, rendering engines, and architectural paradigms chosen for durability and speed.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`tactile-ghost px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-950 text-[#CCFF00] border-2 border-slate-950'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-900'
            }`}
          >
            All Skills ({allSkills.length})
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`tactile-ghost px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-950 text-[#CCFF00] border-2 border-slate-950'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Skills Cards Grid (8 cols on lg) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {displayedSkills.map((skill, index) => {
              const Icon = ICON_MAP[skill.iconName] || Code2;
              const isHovered = activeSkillHover === skill.name;

              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  onMouseEnter={() => setActiveSkillHover(skill.name)}
                  onMouseLeave={() => setActiveSkillHover(null)}
                  className={`bento-card bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-sm flex flex-col justify-between transition-all ${
                    skill.hotTag ? 'ring-1 ring-blue-500/20' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] border border-slate-200 flex items-center justify-center text-[#1D4ED8] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {skill.hotTag && (
                          <span className="bg-[#CCFF00] text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full border border-slate-900">
                            CORE
                          </span>
                        )}
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          skill.level === 'Expert'
                            ? 'bg-blue-100 text-[#1D4ED8]'
                            : skill.level === 'Advanced'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-950 tracking-tight">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase">
                      Production Verified
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Engineering Philosophy & Standout Card (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card 1: Core Principles */}
          <div className="bg-[#1D4ED8] text-white rounded-3xl p-6 sm:p-7 border-2 border-slate-900 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-[#CCFF00] text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-slate-950 inline-block mb-4">
                HOW I SHIP CODE
              </span>
              <h3 className="text-2xl font-black tracking-tight text-white mb-3">
                Zero Compromise Standard
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                Fast web applications are built on deliberate foundations. Every interface is constructed with:
              </p>

              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
                  <div className="text-xs font-bold text-[#CCFF00] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Sub-100ms Interactions
                  </div>
                  <p className="text-[11px] text-blue-100 mt-0.5">Optimistic updates and zero unnecessary re-renders.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
                  <div className="text-xs font-bold text-[#CCFF00] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Accessible by Default
                  </div>
                  <p className="text-[11px] text-blue-100 mt-0.5">WCAG AAA contrast math, full keyboard navigation.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
                  <div className="text-xs font-bold text-[#CCFF00] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Atomic Token Architecture
                  </div>
                  <p className="text-[11px] text-blue-100 mt-0.5">Maintainable design tokens bridging Figma and code.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Environment Banner */}
          <div className="bg-[#FAF8FF] rounded-3xl p-6 border-2 border-slate-900 flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Workflow Tooling</div>
              <div className="text-sm font-extrabold text-slate-950 mt-0.5">Vite • Biome • Git Hooks • Docker</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-[#CCFF00] flex items-center justify-center font-mono font-black text-sm">
              &gt;_
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
