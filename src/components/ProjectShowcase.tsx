import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ExternalLink, 
  Github, 
  Layers, 
  Maximize2, 
  Sparkles, 
  Flame, 
  Filter 
} from 'lucide-react';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data/projectsData';

interface ProjectShowcaseProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Projects', count: PROJECTS_DATA.length },
    { id: 'web', label: 'Web Apps & Systems', count: PROJECTS_DATA.filter(p => p.category === 'web').length },
    { id: 'mobile', label: 'Mobile FinTech', count: PROJECTS_DATA.filter(p => p.category === 'mobile').length },
    { id: 'creative', label: 'Creative 3D / WebGL', count: PROJECTS_DATA.filter(p => p.category === 'creative').length },
    { id: 'ai', label: 'AI Platforms', count: PROJECTS_DATA.filter(p => p.category === 'ai').length },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#CCFF00] border border-slate-900 rounded-full px-3.5 py-1 text-xs font-black tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Curated Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            Featured Engineering & Products
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-2">
            Selected client builds, design systems, and experimental applications engineered with extreme attention to detail and tactile delight.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-btn-${cat.id}`}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`tactile-ghost px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-950 text-[#CCFF00] border-2 border-slate-950'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-800 text-[#CCFF00]' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 12-Column Bento Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            // Determine column span
            const colSpanClass = project.colSpanDesktop === 8 
              ? 'md:col-span-8' 
              : project.colSpanDesktop === 4 
              ? 'md:col-span-4' 
              : 'md:col-span-6';

            return (
              <motion.div
                key={project.id}
                id={`project-card-${project.id}`}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`bento-card ${colSpanClass} bg-white rounded-3xl border-2 border-slate-900 overflow-hidden flex flex-col justify-between group shadow-sm`}
              >
                {/* Visual Preview Container */}
                <div className="relative overflow-hidden bg-slate-950 p-4 sm:p-5 border-b-2 border-slate-900">
                  {/* Browser / Device Simulation Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white/60 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                      <span className="ml-2 text-white/40 hidden sm:inline">{project.id}.app</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-white/10 text-white/80 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {project.year}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="p-1 rounded-md bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title="Expand preview"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Preview Image with Zoom Effect */}
                  <div 
                    className="relative aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden cursor-pointer group-hover:brightness-105 transition-all"
                    onClick={() => onSelectProject(project)}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="bg-[#CCFF00] text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                        <Maximize2 className="w-3 h-3" /> Click to Inspect Case Study
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Header Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="bg-slate-100 text-slate-800 font-bold text-[11px] uppercase tracking-wider px-3 py-0.5 rounded-full border border-slate-200">
                        {project.categoryLabel}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-600 text-xs font-semibold">
                        {project.role}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-snug group-hover:text-[#1D4ED8] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Metrics Badges if available */}
                    {project.metrics && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                        {project.metrics.map((metric, mIdx) => (
                          <div 
                            key={mIdx} 
                            className="bg-[#FAF8FF] border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2"
                          >
                            <span className="text-xs font-extrabold text-slate-950">{metric.value}</span>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase">{metric.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Tech Pills & Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-[11px] font-medium text-slate-400 self-center">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="tactile-ghost bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};
