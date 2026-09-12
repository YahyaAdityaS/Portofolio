import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { EXPERIENCE_DATA } from '../data/experienceData';

export const ExperienceBento: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>(EXPERIENCE_DATA[0].id);

  return (
    <section id="experience" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-[#A78BFA] border border-slate-900 rounded-full px-3.5 py-1 text-xs font-black tracking-wider uppercase mb-3">
          <Briefcase className="w-3.5 h-3.5 text-slate-950" />
          <span>Career Journey</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
          Experience & Impact
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-2">
          Track record of delivering high-stakes frontend engineering, leading distributed teams, and shipping production applications.
        </p>
      </div>

      {/* Experience Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Experience List (12 cols) */}
        <div className="lg:col-span-12 space-y-4">
          {EXPERIENCE_DATA.map((item, index) => {
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                id={`exp-card-${item.id}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
                className={`bg-white rounded-3xl border-2 border-slate-900 p-6 sm:p-7 shadow-sm transition-all ${
                  item.featured ? 'ring-2 ring-[#1D4ED8]/20' : ''
                }`}
              >
                {/* Header Row */}
                <div 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF8FF] border-2 border-slate-900 flex items-center justify-center text-[#1D4ED8] shrink-0 font-extrabold text-lg">
                      0{index + 1}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight">
                          {item.role}
                        </h3>
                        <span className="bg-[#CCFF00] border border-slate-900 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
                        <span className="text-slate-900 font-bold">{item.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center">
                    <div className="bg-[#FAF8FF] border border-slate-200 text-slate-800 text-xs font-mono font-bold px-3 py-1.5 rounded-xl">
                      {item.period}
                    </div>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-transform"
                      aria-label="Toggle details"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-5 border-t border-slate-100 space-y-4"
                  >
                    <p className="text-slate-700 text-sm leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Key Accomplishments
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.highlights.map((highlight, hIdx) => (
                          <div 
                            key={hIdx}
                            className="bg-[#FAF8FF] border border-slate-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-slate-800"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
