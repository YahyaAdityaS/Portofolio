import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ID' | 'EN';
  darkMode: boolean;
}

const DEFAULT_DRIVE_URL = 'https://drive.google.com/file/d/1xU38b_UvKgHfeDKC8QJc8fHj2XPvZqtI/view?usp=sharing';

// Helper to extract Google Drive File ID from standard sharing URLs
function extractDriveFileId(url: string): string {
  if (!url) return '';
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const idParamMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];
  // If user provided raw file ID directly
  if (/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) return url.trim();
  return '';
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose, lang, darkMode }) => {
  // Configurable Google Drive CV URL (stored persistently in localStorage)
  const [driveInput, setDriveInput] = useState(DEFAULT_DRIVE_URL);

  const [isSettingUrl, setIsSettingUrl] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const fileId = extractDriveFileId(driveInput);
  const previewUrl = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : driveInput;

  const downloadUrl = fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : driveInput;

  if (!isOpen) return null;

  // Single Action: Download CV PDF directly
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = 'CV_Yahya_Aditya_Saputra.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-print">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`relative w-full max-w-5xl h-[90vh] flex flex-col rounded-3xl border shadow-2xl z-10 overflow-hidden ${
            darkMode
              ? 'bg-[#090d16] border-[#1e293b] text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Top Header with EXACTLY ONE primary download button */}
          <div
            className={`flex items-center justify-between px-5 sm:px-7 py-3.5 border-b shrink-0 ${
              darkMode ? 'bg-[#0e1628] border-[#1e293b]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                Curriculum Vitae • PDF Preview
              </span>
              <button
                type="button"
                onClick={() => setIsSettingUrl(!isSettingUrl)}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-colors cursor-pointer flex items-center gap-1 ${
                  isSettingUrl
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-slate-400 hover:text-slate-200 border-slate-700/60'
                }`}
                title="Ganti tautan Google Drive PDF jika diperlukan"
              >
                <span className="material-symbols-outlined text-xs">link</span>
                <span>{isSettingUrl ? 'Tutup URL' : 'Tautan Drive'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Only ONE button as requested: Unduh CV */}
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-all cursor-pointer shadow-md active:scale-95"
                title="Unduh PDF Resmi dari Google Drive"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>{lang === 'ID' ? 'Unduh CV' : 'Download CV'}</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Config URL Bar (Optional quick tool for Yahya) */}
          {isSettingUrl && (
            <div
              className={`p-3 border-b flex flex-col sm:flex-row items-center gap-2 text-xs shrink-0 ${
                darkMode ? 'bg-[#0f172a] border-[#1e293b]' : 'bg-blue-50 border-blue-100'
              }`}
            >
              <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-blue-400">cloud</span>
                <span>URL Google Drive:</span>
              </span>
              <input
                type="url"
                value={driveInput}
                onChange={(e) => {
                  setDriveInput(e.target.value);
                  setIframeLoaded(false);
                }}
                placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                className="flex-1 w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 shrink-0">
                (ID otomatis dikonversi ke format embed preview)
              </span>
            </div>
          )}

          {/* PDF Viewer Body */}
          <div className="relative flex-1 w-full bg-[#1e293b]/20 p-2 sm:p-4 overflow-hidden flex flex-col">
            {/* Loading Indicator */}
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/60 z-10 pointer-events-none">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-300 font-medium">
                  {lang === 'ID' ? 'Memuat dokumen PDF dari Google Drive...' : 'Loading PDF preview from Google Drive...'}
                </p>
              </div>
            )}

            {/* Embedded Google Drive PDF Preview */}
            <iframe
              src={previewUrl}
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-full flex-1 rounded-2xl border border-slate-700/60 bg-slate-900 shadow-inner"
              title="CV Yahya Aditya Saputra PDF Preview"
              allow="autoplay"
            />
          </div>

          {/* Modal Footer Bar (Clean, no "Simpan PDF Resmi" button) */}
          <div
            className={`px-6 py-3 border-t flex items-center justify-between text-xs font-medium shrink-0 ${
              darkMode ? 'bg-[#0e1628] border-[#1e293b] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <span>Yahya Aditya Saputra • Portfolio 2026</span>
            <span className="text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-emerald-500">verified</span>
              <span>Google Drive Cloud PDF</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
