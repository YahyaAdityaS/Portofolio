import React from 'react';
import { ProjectItem } from '../data/portfolioData';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  lang: 'ID' | 'EN';
  darkMode?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, lang, darkMode = false }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border overflow-hidden relative max-h-[90vh] flex flex-col transition-colors ${
          darkMode
            ? 'bg-[#111a2e] border-[#1e293b]'
            : 'bg-white border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            darkMode
              ? 'bg-[#16223b] hover:bg-[#1e293b] text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#dce1ff] text-[#001551]">
            {project.badge}
          </span>
          <span className={`text-xs font-bold ${darkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
            • {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${
            darkMode ? 'text-white' : 'text-[#131b2e]'
          }`}
        >
          {project.title}
        </h3>

        <p
          className={`text-sm sm:text-base mb-6 font-medium leading-relaxed ${
            darkMode ? 'text-[#cbd5e1]' : 'text-slate-600'
          }`}
        >
          {project.description}
        </p>

        {/* Technical Highlights */}
        <div
          className={`rounded-2xl p-4 sm:p-5 mb-6 border space-y-3 ${
            darkMode
              ? 'bg-[#0d1527] border-[#23324f]'
              : 'bg-[#f2f3ff] border-[#eaedff]'
          }`}
        >
          <h4
            className={`text-xs font-bold uppercase tracking-wider ${
              darkMode ? 'text-[#38bdf8]' : 'text-primary'
            }`}
          >
            {lang === 'ID' ? 'Spesifikasi Arsitektur & Performa' : 'Architecture & Performance Specs'}
          </h4>
          <ul
            className={`text-xs sm:text-sm space-y-2 font-medium ${
              darkMode ? 'text-[#cbd5e1]' : 'text-slate-700'
            }`}
          >
            <li className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-base ${
                  darkMode ? 'text-[#bef264]' : 'text-primary'
                }`}
              >
                verified
              </span>
              <span>100% Core Web Vitals & Sub-second Initial Page Render</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-base ${
                  darkMode ? 'text-[#bef264]' : 'text-primary'
                }`}
              >
                verified
              </span>
              <span>Modular Atomic Component Model with Strict Type Safety</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-base ${
                  darkMode ? 'text-[#bef264]' : 'text-primary'
                }`}
              >
                verified
              </span>
              <span>End-to-end Telemetry & Automated Deployment Pipeline</span>
            </li>
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                darkMode
                  ? 'bg-[#16223b] border border-[#334155] text-white'
                  : 'bg-[#eaedff] text-[#131b2e]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Modal CTA Buttons */}
        <div
          className={`flex items-center justify-end gap-3 pt-4 border-t mt-auto ${
            darkMode ? 'border-[#1e293b]' : 'border-slate-100'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              darkMode
                ? 'text-[#cbd5e1] hover:bg-[#16223b]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'ID' ? 'Tutup' : 'Close'}
          </button>
          <a
            href="#diskusi-proyek"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span>{lang === 'ID' ? 'Tanyakan Studi Kasus' : 'Inquire Case Study'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>
  );
};
