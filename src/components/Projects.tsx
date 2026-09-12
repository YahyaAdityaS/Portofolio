import React, { useState } from 'react';
import { PROJECTS, ProjectItem } from '../data/portfolioData';

interface ProjectsProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
  onSelectProject: (project: ProjectItem) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ lang, darkMode, onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: lang === 'ID' ? 'Semua' : 'All' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'backend', label: 'AI & Backend' },
    { id: 'designsystem', label: 'Design System' },
  ];

  const filteredProjects = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeFilter);

  const getBannerHeaderStyle = (type: string) => {
    switch (type) {
      case 'plagin':
        return {
          bg: darkMode ? 'bg-[#1e3a8a] border-blue-900' : 'bg-[#1d4ed8] border-blue-800',
          accent: 'bg-[#bef264]',
          yearBg: darkMode ? 'bg-[#2563eb]' : 'bg-[#2563eb]',
        };
      case 'karsa':
        return {
          bg: darkMode ? 'bg-[#581c87] border-purple-800' : 'bg-[#4c2e99] border-purple-700',
          accent: 'bg-[#c084fc]',
          yearBg: darkMode ? 'bg-[#7e22ce]' : 'bg-[#7e22ce]',
        };
      case 'finflow':
        return {
          bg: darkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#131b2e] border-slate-700',
          accent: 'bg-[#38bdf8]',
          yearBg: darkMode ? 'bg-[#1e293b] border border-[#334155] text-[#38bdf8]' : 'bg-slate-700',
        };
      case 'nusantara':
      default:
        return {
          bg: darkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#23324f] border-slate-600',
          accent: 'bg-[#38bdf8]',
          yearBg: darkMode ? 'bg-[#111a2e] border border-[#334155] text-[#bef264]' : 'bg-slate-700',
        };
    }
  };

  return (
    <section className="w-full py-space-xl transition-colors duration-300" id="proyek-pilihan">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-space-lg gap-space-md">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-space-xs ${
                darkMode
                  ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                  : 'bg-[#dce1ff] text-primary'
              }`}
            >
              <span className="tracking-wider">SELECTED ARCHIVES</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {lang === 'ID' ? 'Proyek Unggulan & Studi Kasus' : 'Featured Projects & Case Studies'}
            </h2>
          </div>

          {/* Filter Pill Controls */}
          <div
            className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-full border transition-colors ${
              darkMode
                ? 'bg-[#111a2e] border-[#23324f]'
                : 'bg-[#f2f3ff] border-[#eaedff]'
            }`}
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === filter.id
                    ? 'bg-[#2563eb] text-white shadow-sm'
                    : darkMode
                    ? 'text-[#cbd5e1] hover:text-white'
                    : 'text-[#434655] hover:text-primary'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Bento Grid (4 High Impact Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {filteredProjects.map((project) => {
            const headerStyle = getBannerHeaderStyle(project.type);

            return (
              <div
                key={project.id}
                className={`rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between border ${
                  darkMode
                    ? 'bg-[#111a2e] border-[#1e293b]'
                    : 'bg-white border-[#eaedff]'
                }`}
              >
                <div>
                  {/* Banner Header */}
                  <div className={`text-white p-space-md flex items-center justify-between border-b ${headerStyle.bg}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${headerStyle.accent}`}></span>
                      <span className="text-xs uppercase tracking-wider font-extrabold text-white">
                        {project.badge}
                      </span>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${headerStyle.yearBg}`}>
                      {project.year}
                    </span>
                  </div>

                  {/* Preview Graphic Simulator */}
                  <div className={`p-space-md ${darkMode ? 'bg-[#0d1527]' : 'bg-[#eaedff]/60'}`}>
                    {project.type === 'plagin' && (
                      <div
                        className={`w-full h-56 rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative shadow-inner border ${
                          darkMode
                            ? 'bg-[#080c16] border-[#23324f]'
                            : 'bg-[#080c16] border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[#94a3b8] text-xs font-mono">
                          <span>Plag-In Engine v2.4</span>
                          <span className="text-[#bef264] font-bold">Analysis: 99.4% Match Accuracy</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 my-auto">
                          <div
                            className={`p-2.5 rounded-xl text-center border ${
                              darkMode
                                ? 'bg-[#111a2e] border-[#1e293b]'
                                : 'bg-[#131b2e] border-slate-700'
                            }`}
                          >
                            <span className="block text-xl sm:text-2xl font-bold text-[#bef264]">0.14s</span>
                            <span className="text-[10px] text-[#94a3b8] uppercase font-semibold">Latency</span>
                          </div>
                          <div
                            className={`p-2.5 rounded-xl text-center border ${
                              darkMode
                                ? 'bg-[#111a2e] border-[#1e293b]'
                                : 'bg-[#131b2e] border-slate-700'
                            }`}
                          >
                            <span className="block text-xl sm:text-2xl font-bold text-white">12k+</span>
                            <span className="text-[10px] text-[#94a3b8] uppercase font-semibold">Corpus Docs</span>
                          </div>
                          <div
                            className={`p-2.5 rounded-xl text-center border ${
                              darkMode
                                ? 'bg-[#111a2e] border-[#1e293b]'
                                : 'bg-[#131b2e] border-slate-700'
                            }`}
                          >
                            <span className="block text-xl sm:text-2xl font-bold text-[#38bdf8]">Zero</span>
                            <span className="text-[10px] text-[#94a3b8] uppercase font-semibold">False Positive</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#bef264] h-full rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                    )}

                    {project.type === 'karsa' && (
                      <div
                        className={`w-full h-56 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-inner border ${
                          darkMode
                            ? 'bg-[#080c16] border-[#23324f]'
                            : 'bg-[#080c16] border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-[#cbd5e1]">
                          <span className="font-bold text-white">Karsa Design Tokens Hub</span>
                          <span className="px-2 py-0.5 rounded bg-[#bef264] text-[#080c16] text-[10px] font-extrabold">
                            Figma Sync v1.8
                          </span>
                        </div>
                        <div className="flex items-center justify-around gap-2">
                          <div className="w-16 h-16 rounded-2xl bg-[#2563eb] flex flex-col items-center justify-center text-white shadow-md border border-blue-400">
                            <span className="text-[10px] font-bold">Primary</span>
                            <span className="text-[9px] opacity-80">#2563EB</span>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-[#bef264] flex flex-col items-center justify-center text-[#080c16] shadow-md border border-lime-300">
                            <span className="text-[10px] font-extrabold">Accent</span>
                            <span className="text-[9px] opacity-90 font-bold">#BEF264</span>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-[#c084fc] flex flex-col items-center justify-center text-[#1e1b4b] shadow-md border border-purple-200">
                            <span className="text-[10px] font-extrabold">Lilac</span>
                            <span className="text-[9px] opacity-80">#C084FC</span>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-[#1e293b] flex flex-col items-center justify-center text-white shadow-md border border-slate-700">
                            <span className="text-[10px] font-bold">Surface</span>
                            <span className="text-[9px] opacity-80">#1E293B</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                          <span>GitHub Actions CI/CD Pipeline</span>
                          <span className="text-[#38bdf8] font-bold">Synced 24 tokens</span>
                        </div>
                      </div>
                    )}

                    {project.type === 'finflow' && (
                      <div
                        className={`w-full h-56 rounded-2xl p-4 flex flex-col justify-between shadow-inner border ${
                          darkMode
                            ? 'bg-[#080c16] border-[#23324f]'
                            : 'bg-[#080c16] border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-[#94a3b8]">Arus Kas Bersih (Q3-Q4)</span>
                            <h4 className="text-xl font-bold text-white">Rp 842.650.000</h4>
                          </div>
                          <span className="text-xs font-black text-[#080c16] bg-[#bef264] px-2.5 py-1 rounded-full shadow-sm">
                            +28.4%
                          </span>
                        </div>
                        <div className="w-full h-24 my-1">
                          <svg className="w-full h-full text-[#38bdf8]" fill="none" viewBox="0 0 300 80">
                            <path
                              d="M0 60 Q 40 50, 80 55 T 160 30 T 220 38 T 300 10"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeWidth="3"
                            />
                            <path
                              d="M0 60 Q 40 50, 80 55 T 160 30 T 220 38 T 300 10 L 300 80 L 0 80 Z"
                              fill="currentColor"
                              fillOpacity="0.12"
                            />
                            <circle className="fill-[#bef264]" cx="300" cy="10" r="4" />
                          </svg>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#94a3b8] border-t border-[#1e293b] pt-1">
                          <span>Sub-second Latency</span>
                          <span className="text-[#38bdf8] font-semibold">React-Query Optimistic Updates</span>
                        </div>
                      </div>
                    )}

                    {project.type === 'nusantara' && (
                      <div
                        className={`w-full h-56 rounded-2xl p-4 flex flex-col justify-between shadow-inner border ${
                          darkMode
                            ? 'bg-[#080c16] border-[#23324f]'
                            : 'bg-[#080c16] border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-[#cbd5e1]">
                          <span className="font-mono">Midtrans Snap Sandbox Flow</span>
                          <span className="text-[#bef264] font-bold">Payment Verified</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 my-auto">
                          <div
                            className={`p-3 rounded-xl flex items-center gap-3 border ${
                              darkMode
                                ? 'bg-[#111a2e] border-[#1e293b]'
                                : 'bg-[#131b2e] border-slate-700'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-bold text-xs">
                              QR
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">QRIS Instant</div>
                              <div className="text-[10px] text-[#38bdf8] font-medium">Instant Webhook</div>
                            </div>
                          </div>
                          <div
                            className={`p-3 rounded-xl flex items-center gap-3 border ${
                              darkMode
                                ? 'bg-[#111a2e] border-[#1e293b]'
                                : 'bg-[#131b2e] border-slate-700'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#bef264] flex items-center justify-center text-[#080c16] font-extrabold text-xs shadow-sm">
                              <span className="material-symbols-outlined text-base">account_balance</span>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">Virtual Account</div>
                              <div className="text-[10px] text-[#cbd5e1]">BCA, Mandiri, BRI</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                          <span>99.9% Cart Conversion Reliability</span>
                          <span className="text-[#bef264] font-bold">Optimized PWA</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-space-lg">
                    <h3
                      className={`text-xl sm:text-2xl font-extrabold transition-colors mb-space-xs ${
                        darkMode
                          ? 'text-white group-hover:text-[#38bdf8]'
                          : 'text-[#131b2e] group-hover:text-primary'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p
                      className={`text-sm sm:text-base mb-space-md font-medium leading-relaxed ${
                        darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                      }`}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-space-md">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                            darkMode
                              ? 'bg-[#16223b] border border-[#334155] text-white'
                              : 'bg-[#f2f3ff] text-[#131b2e]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-space-lg pb-space-lg pt-0 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      darkMode ? 'text-[#94a3b8]' : 'text-slate-400'
                    }`}
                  >
                    {project.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-sm group-hover:translate-x-1 transition-all font-bold cursor-pointer ${
                      darkMode
                        ? 'text-[#38bdf8] hover:text-white'
                        : 'text-primary hover:text-[#1d4ed8]'
                    }`}
                  >
                    <span>{project.actionText}</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
