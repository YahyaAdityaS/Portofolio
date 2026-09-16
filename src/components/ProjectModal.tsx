import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Extended ProjectItem interface guaranteeing full type safety across environments
export interface ProjectItem {
  id: string;
  category?: 'all' | 'fullstack' | 'backend' | 'designsystem' | string;
  year?: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  status?: string;
  actionText?: string;
  type?: 'plagin' | 'karsa' | 'finflow' | 'nusantara' | string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  github?: string;
  demo?: string;
  liveUrl?: string;
  [key: string]: any;
}

function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchFileD && matchFileD[1]) return matchFileD[1];
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchId && matchId[1]) return matchId[1];
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchD && matchD[1]) return matchD[1];
  return null;
}

function formatGoogleDriveUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
  return trimmed;
}

function getGoogleDriveFallbackUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const driveId = extractGoogleDriveId(url);
  if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
  return url;
}

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  lang: 'ID' | 'EN';
  darkMode?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, lang, darkMode = false }) => {
  // Lock body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.86, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 340,
            }}
            className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border overflow-hidden relative max-h-[90vh] flex flex-col transition-colors ${
              darkMode
                ? 'bg-[#111a2e] border-[#23324f] shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
                : 'bg-white border-slate-200 shadow-[0_25px_60px_rgba(37,99,235,0.15)]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button with fluid motion */}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer z-10 ${
                darkMode
                  ? 'bg-[#16223b] hover:bg-[#23324f] text-white border border-[#334155]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </motion.button>

            {/* Header Badge */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-3"
            >
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#bef264] text-[#080c16] shadow-xs">
                {project.badge}
              </span>
              <span className={`text-xs font-bold ${darkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                • {project.year}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                darkMode ? 'bg-[#16223b] text-[#38bdf8]' : 'bg-blue-50 text-primary'
              }`}>
                {project.status}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`text-2xl sm:text-3xl font-black tracking-tight mb-2.5 leading-tight ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {project.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-sm sm:text-base mb-5 font-medium leading-relaxed ${
                darkMode ? 'text-[#cbd5e1]' : 'text-slate-600'
              }`}
            >
              {project.description}
            </motion.p>

            {/* Technical Highlights with animated entries */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`rounded-2xl p-4 sm:p-5 mb-5 border space-y-3 ${
                darkMode
                  ? 'bg-[#0d1527] border-[#23324f]'
                  : 'bg-[#f2f3ff] border-[#eaedff]'
              }`}
            >
              <h4
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  darkMode ? 'text-[#38bdf8]' : 'text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-base">architecture</span>
                <span>{lang === 'ID' ? 'Spesifikasi Arsitektur & Performa' : 'Architecture & Performance Specs'}</span>
              </h4>
              <ul
                className={`text-xs sm:text-sm space-y-2.5 font-medium ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-slate-700'
                }`}
              >
                <li className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-base shrink-0 ${
                      darkMode ? 'text-[#bef264]' : 'text-primary'
                    }`}
                  >
                    verified
                  </span>
                  <span>100% Core Web Vitals, Sub-second Initial Page Render & Zero Layout Shift</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-base shrink-0 ${
                      darkMode ? 'text-[#bef264]' : 'text-primary'
                    }`}
                  >
                    verified
                  </span>
                  <span>Modular Atomic Component Model with Strict End-to-End Type Safety</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-base shrink-0 ${
                      darkMode ? 'text-[#bef264]' : 'text-primary'
                    }`}
                  >
                    verified
                  </span>
                  <span>Optimized REST/GraphQL APIs with Automated GitHub Actions CI/CD Pipeline</span>
                </li>
              </ul>
            </motion.div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {(project.tags || []).map((tag, tagIdx) => (
                  <span
                    key={`${project.id || 'modal'}-tag-${tag}-${tagIdx}`}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-transform hover:scale-105 ${
                      darkMode
                        ? 'bg-[#16223b] border border-[#334155] text-white hover:border-[#38bdf8]'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-blue-100'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Project Image in Modal if available */}
            {project.imageUrl && (
              <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 border border-[#23324f] relative bg-black/40">
                <img
                  src={formatGoogleDriveUrl(project.imageUrl)}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallback = getGoogleDriveFallbackUrl(project.imageUrl);
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
              </div>
            )}

            {/* Modal CTA Buttons */}
            <div
              className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t mt-auto ${
                darkMode ? 'border-[#1e293b]' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                      darkMode
                        ? 'border-[#334155] text-white hover:bg-[#1e293b]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">code</span>
                    <span>GitHub</span>
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#bef264] hover:bg-[#a8e04b] text-[#080c16] text-xs font-extrabold shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    <span>Live Demo</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
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
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <span>{lang === 'ID' ? 'Diskusikan Proyek' : 'Inquire Project'}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};