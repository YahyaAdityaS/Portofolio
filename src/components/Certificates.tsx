import React, { useState, useEffect } from 'react';
import { CertificateItem } from '../types';
import { INITIAL_CERTIFICATES } from '../data/certificateData';
import { CertificateModal } from './CertificateModal';

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
  if (cat.includes('tech') || cat.includes('web')) {
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
  }
  if (cat.includes('business') || cat.includes('skill')) {
    return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80';
}

interface CertificatesProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
}

const CARDS_PER_PAGE = 3;

// Backend Google Apps Script Web App URL untuk sinkronisasi sertifikat secara otomatis
const CERT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwl_PVOYI-Y6LeMfNNlSG3ogxqu-U3kq2wgu1D45J_34MJJ-Fd5XMVC_DvXPz04Tagx/exec';

export const Certificates: React.FC<CertificatesProps> = ({ lang, darkMode }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Instant Hydration: Load immediately from cache or INITIAL_CERTIFICATES
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    try {
      const cached = localStorage.getItem('yas_portfolio_certificates');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_CERTIFICATES;
  });

  // Listen to custom event for real-time instant updates from Admin Modal
  useEffect(() => {
    const handleSync = () => {
      try {
        const cached = localStorage.getItem('yas_portfolio_certificates');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCertificates(parsed);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('yas_certificates_updated', handleSync);
    return () => window.removeEventListener('yas_certificates_updated', handleSync);
  }, []);

  // Sync with Google Apps Script Webhook automatically from code
  useEffect(() => {
    const certWebhookUrl = CERT_SCRIPT_URL || localStorage.getItem('yas_certificates_webhook_url');
    if (!certWebhookUrl) return;

    let isMounted = true;
    const fetchFromScript = async () => {
      try {
        const res = await fetch(certWebhookUrl);
        const data = await res.json();
        if (isMounted && data && Array.isArray(data.certificates) && data.certificates.length > 0) {
          const mapped: CertificateItem[] = data.certificates.map((c: any) => ({
            id: c.id || `CERT-${Math.random().toString(36).slice(2, 7)}`,
            title: c.title || 'Sertifikat',
            desc: c.desc || c.description || '',
            description: c.desc || c.description || '',
            category: c.category || 'Design',
            tags: Array.isArray(c.tags)
              ? c.tags
              : typeof c.tags === 'string' && c.tags.length > 0
              ? c.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : [c.category || 'Certificate'],
            image: c.image || c.imageUrl || '',
            imageUrl: c.image || c.imageUrl || '',
            year: c.year || new Date().getFullYear().toString(),
            badge: c.category || 'Certificate',
          }));

          setCertificates(mapped);
          try {
            localStorage.setItem('yas_portfolio_certificates', JSON.stringify(mapped));
          } catch {
            // ignore
          }
        }
      } catch {
        // fail silently to keep offline cache
      }
    };

    fetchFromScript();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Categories matching user requirement: All, Design, Tech, Business & Skills
  const filters = [
    { id: 'all', label: lang === 'ID' ? 'Semua' : 'All' },
    { id: 'Design', label: 'Design' },
    { id: 'Tech', label: 'Tech' },
    { id: 'Business & Skills', label: 'Business & Skills' },
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const isCategoryMatch = (cert: CertificateItem, filterId: string) => {
    if (filterId === 'all') return true;
    const cat = (cert.category || '').toLowerCase().trim();
    const target = filterId.toLowerCase().trim();
    if (target === 'design') {
      return cat.includes('design') || cat.includes('ui') || cat.includes('ux') || cat.includes('grafis');
    }
    if (target === 'tech') {
      return cat.includes('tech') || cat.includes('web') || cat.includes('dev') || cat.includes('code');
    }
    if (target === 'business & skills') {
      return (
        cat.includes('business') ||
        cat.includes('skill') ||
        cat.includes('lead') ||
        cat.includes('manage') ||
        cat.includes('market')
      );
    }
    return cat === target;
  };

  const filteredCertificates = activeFilter === 'all'
    ? certificates
    : certificates.filter((c) => isCategoryMatch(c, activeFilter));

  const totalPages = Math.ceil(filteredCertificates.length / CARDS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const paginatedCertificates = filteredCertificates.slice(startIndex, startIndex + CARDS_PER_PAGE);

  // Layout grid identical to Projects: 3 cards per row; when 2 cards exist, stretch to fill full row width
  const gridColsClass = paginatedCertificates.length === 1
    ? 'grid-cols-1 max-w-xl mx-auto'
    : paginatedCertificates.length === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section
      className={`w-full py-space-xl transition-colors duration-300 scroll-mt-28 ${
        darkMode ? 'bg-[#0b1120] border-y border-[#1e293b]' : 'bg-[#f2f3ff]'
      }`}
      id="sertifikat"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Top Header - Plek Ketiplek dengan Proyek */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-space-lg gap-space-md">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-space-xs ${
                darkMode
                  ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                  : 'bg-white text-primary shadow-xs'
              }`}
            >
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              <span className="tracking-wider">
                {lang === 'ID' ? 'KREDENSIAL & LISENSI' : 'CREDENTIALS & HONORS'}
              </span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {lang === 'ID' ? 'Sertifikat & Penghargaan' : 'Certificates & Honors'}
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 font-medium ${darkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
              {lang === 'ID'
                ? 'Koleksi sertifikasi profesional, kompetisi desain, dan keahlian terverifikasi yang telah diraih.'
                : 'Curated collection of professional certifications, design honors, and verified credentials.'}
            </p>
          </div>

          {/* Filter Pill Controls - Tabbing versi mobile wrap */}
          <div
            className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full border transition-colors self-start lg:self-auto ${
              darkMode
                ? 'bg-[#111a2e] border-[#23324f]'
                : 'bg-white border-[#eaedff] shadow-xs'
            }`}
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleFilterChange(filter.id)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

        {/* Empty State */}
        {filteredCertificates.length === 0 ? (
          <div
            className={`p-12 text-center rounded-[28px] border ${
              darkMode ? 'bg-[#0f172a] border-[#1e293b] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">workspace_premium</span>
            <p className="text-sm font-semibold">
              {lang === 'ID' ? 'Belum ada sertifikat dalam kategori ini.' : 'No certificates found in this category.'}
            </p>
          </div>
        ) : (
          /* Cards Grid: Plek Ketiplek dengan Proyek */
          <div className={`grid ${gridColsClass} gap-5 sm:gap-6`}>
            {paginatedCertificates.map((cert, cIndex) => {
              const rawImg = cert.image || cert.imageUrl || '';
              const primaryImg = formatGoogleDriveUrl(rawImg);
              const fallbackImg = getCategoryFallbackImage(cert.category);

              return (
                <div
                  key={`${cert.id}-${cIndex}`}
                  onClick={() => setSelectedCert(cert)}
                  className={`relative rounded-[28px] overflow-hidden min-h-[440px] sm:min-h-[480px] p-5 sm:p-6 border transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 select-none ${
                    darkMode
                      ? 'bg-[#0b1120] border-[#1e293b] shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:border-[#38bdf8]/50 hover:shadow-[0_20px_48px_rgba(56,189,248,0.15)]'
                      : 'bg-white border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(37,99,235,0.14)]'
                  }`}
                >
                  {/* Full Card Background Image Thumbnail */}
                  <img
                    src={primaryImg || fallbackImg}
                    alt={cert.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const driveFallback = getGoogleDriveFallbackUrl(rawImg);
                      if (driveFallback && target.src !== driveFallback) {
                        target.src = driveFallback;
                      } else if (target.src !== fallbackImg) {
                        target.src = fallbackImg;
                      }
                    }}
                  />

                  {/* Darkened Gradient Overlay to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 via-50% to-black/25 pointer-events-none transition-opacity duration-300 group-hover:opacity-95" />

                  {/* Top Badge Row */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-black/55 backdrop-blur-md border border-white/20 shadow-xs">
                      {cert.badge || cert.category || 'Certificate'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold text-white bg-black/55 backdrop-blur-md border border-white/20 shadow-xs">
                      {cert.year || '2024'}
                    </span>
                  </div>

                  {/* Bottom Information Row */}
                  <div className="relative z-10 flex flex-col pt-12">
                    {/* Title */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3
                        className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#38bdf8] transition-colors tracking-tight truncate drop-shadow-sm"
                        title={cert.title}
                      >
                        {cert.title}
                      </h3>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shrink-0 shadow-[0_0_8px_#38bdf8]" title="Verified Certificate"></span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm font-medium text-slate-200 line-clamp-2 leading-relaxed mb-3 drop-shadow-xs">
                      {cert.desc || cert.description}
                    </p>

                    {/* Micro Tag Pills */}
                    {cert.tags && cert.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {cert.tags[0] && (
                          <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 shadow-xs">
                            {cert.tags[0]}
                          </span>
                        )}
                        {cert.tags[1] && (
                          <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 shadow-xs hidden sm:inline-block">
                            {cert.tags[1]}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Button menuju image Google Drive (Pengganti live demo & github) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCert(cert);
                      }}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 bg-white text-[#090d16] hover:bg-[#bef264] hover:text-[#080c16] group-hover:bg-[#bef264] transition-all duration-200 shadow-md cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm sm:text-base">verified</span>
                      <span>{lang === 'ID' ? 'Lihat Sertifikat' : 'View Certificate'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Text Result on Left */}
            <div className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'ID'
                ? `Hasil ${startIndex + 1} - ${Math.min(startIndex + CARDS_PER_PAGE, filteredCertificates.length)} dari ${filteredCertificates.length}`
                : `Results ${startIndex + 1} - ${Math.min(startIndex + CARDS_PER_PAGE, filteredCertificates.length)} of ${filteredCertificates.length}`}
            </div>

            {/* Pagination Button Group on Right */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Halaman Sebelumnya"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode
                    ? 'border-[#23324f] text-[#cbd5e1] hover:bg-[#16223b] hover:text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={`cert-page-${pageNum}`}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#2563eb] text-white shadow-md'
                      : darkMode
                      ? 'text-[#cbd5e1] hover:bg-[#16223b] hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Halaman Berikutnya"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  darkMode
                    ? 'border-[#23324f] text-[#cbd5e1] hover:bg-[#16223b] hover:text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Certificate Detail Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
        lang={lang}
        darkMode={darkMode}
      />
    </section>
  );
};
