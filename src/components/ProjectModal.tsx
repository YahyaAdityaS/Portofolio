import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectItem } from '../types';

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

function getCategoryFallbackImage(category?: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('photo') || cat.includes('foto')) {
    return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80';
  }
  if (cat.includes('graph') || cat.includes('grafis')) {
    return 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80';
  }
  if (cat.includes('web') || cat.includes('dev')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80';
}

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  lang: 'ID' | 'EN';
  darkMode?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, lang, darkMode = false }) => {
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

  if (!project) return null;

  const rawImage = project.imageUrl || project.image || '';
  const primaryImg = formatGoogleDriveUrl(rawImage);
  const fallbackImg = getCategoryFallbackImage(project.category);
  const imageSrc = primaryImg || fallbackImg;

  const githubLink = (project.githubUrl || project.github || '').trim();
  const demoLink = (project.demoUrl || project.demo || '').trim();
  const hasGithub = githubLink.length > 0;
  const hasDemo = demoLink.length > 0;

  return (
    <AnimatePresence>
      <div
        key="modal-backdrop"
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          key="modal-card"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{
            type: 'spring',
            damping: 26,
            stiffness: 340,
          }}
          className={`rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border relative max-h-[85vh] sm:max-h-[90vh] modal-scrollbar flex flex-col transition-colors ${
            darkMode
              ? 'bg-[#111a2e] border-[#23324f] shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
              : 'bg-white border-slate-200 shadow-[0_25px_60px_rgba(37,99,235,0.15)]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-4 sm:top-5 right-4 sm:right-5 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer z-20 ${
              darkMode
                ? 'bg-[#16223b] hover:bg-[#23324f] text-white border border-[#334155]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </motion.button>

          {/* Header Badge Row */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-3 pr-12"
          >
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#bef264] text-[#080c16] shadow-xs">
              {project.badge || project.category || 'Featured'}
            </span>
            <span className={`text-xs font-bold ${darkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
              • {project.year || '2026'}
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

          {/* Description */}
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

          {/* Image Thumbnail */}
          {imageSrc && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`w-full h-52 sm:h-64 rounded-2xl overflow-hidden mb-5 border relative bg-black/30 shadow-inner shrink-0 ${
                darkMode ? 'border-[#23324f]' : 'border-slate-200'
              }`}
            >
              <img
                src={imageSrc}
                alt={project.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  const driveFallback = getGoogleDriveFallbackUrl(rawImage);
                  if (driveFallback && target.src !== driveFallback) {
                    target.src = driveFallback;
                  } else if (fallbackImg && target.src !== fallbackImg) {
                    target.src = fallbackImg;
                  }
                }}
              />
            </motion.div>
          )}

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

          {/* Modal Footer CTA Buttons:
              - Sebelah kiri: Button GitHub dan Live Demo (jika ada di database)
              - Sebelah kanan: Inquire Project
              - Tampilan mobile: Tersusun ke bawah (flex-col) agar leluasa di layar kecil */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t mt-auto shrink-0 ${
              darkMode ? 'border-[#1e293b]' : 'border-slate-100'
            }`}
          >
            {/* Bagian Kiri: GitHub & Live Demo (hanya tampil jika ada di database) */}
            {(hasGithub || hasDemo) ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {hasGithub && (
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                      darkMode
                        ? 'border-[#334155] text-white hover:bg-[#1e293b]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">code</span>
                    <span>GitHub</span>
                  </a>
                )}
                {hasDemo && (
                  <a
                    href={demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#bef264] hover:bg-[#a8e04b] text-[#080c16] text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="hidden sm:block" />
            )}

            {/* Bagian Kanan: Inquire Project */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href="#diskusi-proyek"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-center"
              >
                <span>{lang === 'ID' ? 'Diskusikan Proyek' : 'Inquire Project'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
