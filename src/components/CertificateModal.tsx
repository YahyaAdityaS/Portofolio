import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CertificateItem } from '../types';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
  lang: 'ID' | 'EN';
  darkMode: boolean;
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

function getDriveOriginalLink(url?: string): string {
  if (!url || typeof url !== 'string') return '#';
  const driveId = extractGoogleDriveId(url);
  if (driveId) return `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
  return url;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
  lang,
  darkMode,
}) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (certificate) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const rawImage = certificate.image || certificate.imageUrl || '';
  const imageSrc = formatGoogleDriveUrl(rawImage);
  const fallbackImg = getGoogleDriveFallbackUrl(rawImage);
  const driveDirectUrl = getDriveOriginalLink(rawImage);

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-2xl max-h-[88vh] rounded-[28px] border shadow-2xl z-10 flex flex-col overflow-y-auto modal-scrollbar ${
            darkMode
              ? 'bg-[#0b1120] border-[#1e293b] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
              : 'bg-white border-slate-200 text-[#131b2e] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]'
          }`}
        >
          <div className="p-5 sm:p-7 flex flex-col flex-1">
            {/* Header: Badges & Close Button */}
            <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    darkMode
                      ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                      : 'bg-[#dce1ff] text-primary'
                  }`}
                >
                  {certificate.category || 'Certificate'}
                </span>
                {certificate.year && (
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      darkMode
                        ? 'bg-[#1e293b] text-[#cbd5e1]'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {certificate.year}
                  </span>
                )}
                {certificate.issuer && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:inline-block ${
                      darkMode ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {certificate.issuer}
                  </span>
                )}
              </div>

              {/* Close Button on Top Right */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup card sertifikat"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  darkMode
                    ? 'bg-[#16223b] hover:bg-[#1e293b] text-[#cbd5e1]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Title */}
            <h2
              className={`text-xl sm:text-2xl font-extrabold tracking-tight mb-2 ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {certificate.title}
            </h2>

            {/* Description / Detail */}
            <p
              className={`text-sm sm:text-base leading-relaxed mb-5 font-normal ${
                darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
              }`}
            >
              {certificate.desc || certificate.description}
            </p>

            {/* Certificate Image Preview */}
            {imageSrc && (
              <div
                className={`w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-5 border relative bg-black/40 shadow-inner shrink-0 group ${
                  darkMode ? 'border-[#23324f]' : 'border-slate-200'
                }`}
              >
                <img
                  src={imageSrc}
                  alt={certificate.title}
                  className="w-full h-full object-contain object-center bg-black/50 transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const driveFallback = getGoogleDriveFallbackUrl(rawImage);
                    if (driveFallback && target.src !== driveFallback) {
                      target.src = driveFallback;
                    }
                  }}
                />
              </div>
            )}

            {/* Tags */}
            {certificate.tags && certificate.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 shrink-0">
                {certificate.tags.map((tag: string, tagIdx: number) => (
                  <span
                    key={`${certificate.id}-tag-${tag}-${tagIdx}`}
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
            )}

            {/* Modal Footer Buttons */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t mt-auto shrink-0 ${
                darkMode ? 'border-[#1e293b]' : 'border-slate-100'
              }`}
            >
              {/* Tombol menuju file/gambar di Google Drive (Pengganti Live Demo & GitHub) */}
              <a
                href={driveDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#bef264] hover:bg-[#a8e04b] text-[#080c16] text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                <span>{lang === 'ID' ? 'Buka Gambar di Google Drive' : 'Open Image in Google Drive'}</span>
              </a>

              {/* Tombol Diskusi / Hubungi */}
              <a
                href="#diskusi-proyek"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-center"
              >
                <span>{lang === 'ID' ? 'Hubungi Saya' : 'Contact Me'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
