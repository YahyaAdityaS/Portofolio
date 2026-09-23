import React, { useState, useEffect } from 'react';
import { ProjectItem } from '../types';
import { PROJECTS } from '../data/portfolioData';
import { PROJECTS_API_URL } from '../config/apiEndpoints';

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

interface ProjectsProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
  onSelectProject: (project: ProjectItem) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ lang, darkMode, onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Instant Hydration: Load immediately from cache (purely spreadsheet data)
  const [allProjects, setAllProjects] = useState<ProjectItem[]>(() => {
    try {
      const cached = localStorage.getItem('yas_portfolio_projects_cache_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(
            (p) =>
              !['karsa', 'finflow', 'nusantara'].includes(p.id) &&
              !['Karsa Design System', 'FinFlow Core Banking Portal', 'Nusantara Creative Identity'].includes(p.title)
          );
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Only show skeleton wireframe if no projects exist at all (which never happens because of instant hydration)
  const [isLoadingSheets, setIsLoadingSheets] = useState<boolean>(() => allProjects.length === 0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const CARDS_PER_PAGE = 3;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const fetchSheetProjects = async () => {
      try {
        const res = await fetch(PROJECTS_API_URL, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (isMounted && data && Array.isArray(data.projects) && data.projects.length > 0) {
          // Map google sheets row data into ProjectItem shape with standardized categories
          const sheetMapped: ProjectItem[] = data.projects.map((item: any, idx: number) => {
            const rawCat = (item.category || '').trim();
            const lower = rawCat.toLowerCase();
            let cat = 'UI/UX Design';
            if (lower.includes('web') || lower.includes('dev') || lower.includes('fullstack') || lower.includes('backend')) {
              cat = 'Web Development';
            } else if (lower.includes('graph') || lower.includes('grafis')) {
              cat = 'Graphic Design';
            } else if (lower.includes('photo') || lower.includes('foto') || lower.includes('camera')) {
              cat = 'Photography';
            } else if (lower.includes('ui') || lower.includes('ux') || lower.includes('design')) {
              cat = 'UI/UX Design';
            } else if (rawCat) {
              cat = rawCat;
            }

            const parsedTags = Array.isArray(item.tags)
              ? item.tags
              : typeof item.tags === 'string'
              ? item.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : [cat, 'Showcase'];
            const rawTags = Array.from(
              new Set(parsedTags.map((t: any) => String(t).trim()).filter(Boolean))
            );

            return {
              id: item.id ? String(item.id).trim() : `sheet-prj-${idx}`,
              category: cat,
              year: item.year ? String(item.year).trim() : (item.tahun ? String(item.tahun).trim() : '2026'),
              badge: item.badge || cat,
              badgeBg: 'bg-primary text-on-primary',
              badgeText: 'bg-primary-container',
              title: item.title || 'Untitled Project',
              subtitle: item.subtitle || cat || 'Portfolio Showcase',
              description: item.desc || item.description || '',
              tags: rawTags.length > 0 ? rawTags : [cat, 'Production'],
              status: item.status || 'Live Production',
              actionText: 'Lihat Detail',
              type: 'sheet-project',
              imageUrl: formatGoogleDriveUrl(item.image || item.imageUrl || ''),
              githubUrl: item.github || item.githubUrl || '',
              demoUrl: item.demo || item.demoUrl || '',
            };
          });

          // Hanya gunakan data proyek murni dari database Google Sheets
          setAllProjects(sheetMapped);
          try {
            localStorage.setItem('yas_portfolio_projects_cache_v2', JSON.stringify(sheetMapped));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        // Fallback gracefully without breaking UI or blanking cards
      } finally {
        if (isMounted) setIsLoadingSheets(false);
        clearTimeout(timeoutId);
      }
    };

    fetchSheetProjects();

    // Listen for local admin updates for instantaneous 0ms reflection
    const handleSync = () => {
      try {
        const cached = localStorage.getItem('yas_portfolio_projects_cache_v2');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter(
              (p) =>
                !['karsa', 'finflow', 'nusantara'].includes(p.id) &&
                !['Karsa Design System', 'FinFlow Core Banking Portal', 'Nusantara Creative Identity'].includes(p.title)
            );
            setAllProjects(filtered);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('yas_projects_updated', handleSync);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
      window.removeEventListener('yas_projects_updated', handleSync);
    };
  }, []); // Run on mount only - changing language does NOT trigger loading or skeleton!

  // Standardized categories matching requirement
  const filters = [
    { id: 'all', label: lang === 'ID' ? 'Semua' : 'All' },
    { id: 'uiux', label: 'UI/UX Design' },
    { id: 'webdev', label: 'Web Development' },
    { id: 'graphic', label: 'Graphic Design' },
    { id: 'photography', label: 'Photography' },
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const isCategoryMatch = (project: ProjectItem, filterId: string) => {
    if (filterId === 'all') return true;
    const cat = (project.category || '').toLowerCase().trim();
    const tags = (project.tags || []).map((t) => t.toLowerCase()).join(' ');

    if (filterId === 'uiux') {
      return (
        cat === 'ui/ux design' ||
        cat.includes('ui') ||
        cat.includes('ux') ||
        cat.includes('design') ||
        cat.includes('figma') ||
        tags.includes('ui') ||
        tags.includes('ux') ||
        tags.includes('figma')
      );
    }
    if (filterId === 'webdev') {
      return (
        cat === 'web development' ||
        cat.includes('web') ||
        cat.includes('dev') ||
        cat.includes('fullstack') ||
        cat.includes('backend') ||
        tags.includes('web') ||
        tags.includes('react') ||
        tags.includes('next')
      );
    }
    if (filterId === 'graphic') {
      return (
        cat === 'graphic design' ||
        cat.includes('graphic') ||
        cat.includes('grafis') ||
        cat.includes('visual') ||
        cat.includes('brand') ||
        tags.includes('graphic') ||
        tags.includes('brand')
      );
    }
    if (filterId === 'photography') {
      return (
        cat === 'photography' ||
        cat.includes('photo') ||
        cat.includes('foto') ||
        cat.includes('camera') ||
        tags.includes('photo')
      );
    }
    return cat === filterId;
  };

  const filteredProjects = activeFilter === 'all'
    ? allProjects
    : allProjects.filter((p) => isCategoryMatch(p, activeFilter));

  const totalPages = Math.ceil(filteredProjects.length / CARDS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + CARDS_PER_PAGE);

  // Layout logic: 3 cards per row; when 2 cards exist, stretch to fill full row width (no blank space)
  const gridColsClass = paginatedProjects.length === 1
    ? 'grid-cols-1 max-w-xl mx-auto'
    : paginatedProjects.length === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section
      className={`w-full py-space-xl transition-colors duration-300 scroll-mt-28 ${
        darkMode ? 'bg-[#080c16]' : 'bg-[#faf8ff]'
      }`}
      id="proyek-pilihan"
    >
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
              <span className="material-symbols-outlined text-sm">stars</span>
              <span className="tracking-wider">{lang === 'ID' ? 'ARSIP TERPILIH' : 'SELECTED ARCHIVES'}</span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {lang === 'ID' ? 'Proyek Unggulan & Studi Kasus' : 'Featured Projects & Case Studies'}
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 font-medium ${darkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
              {lang === 'ID'
                ? `Menampilkan 3 karya pilihan per halaman untuk eksplorasi yang cepat dan fokus.`
                : `Presenting 3 curated projects per page for clean, focused exploration.`}
            </p>
          </div>

          {/* Filter Pill Controls - Tabbing versi mobile turun ke bawah (wrap), tidak di-scroll horizontal */}
          <div
            className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full border transition-colors self-start lg:self-auto ${
              darkMode
                ? 'bg-[#111a2e] border-[#23324f]'
                : 'bg-[#f2f3ff] border-[#eaedff]'
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

        {/* Loading Wireframe Skeleton State */}
        {isLoadingSheets ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((skeletonIdx) => (
              <div
                key={`skeleton-${skeletonIdx}`}
                className={`relative rounded-[28px] overflow-hidden min-h-[440px] sm:min-h-[480px] p-5 sm:p-6 flex flex-col justify-between border animate-pulse ${
                  darkMode
                    ? 'bg-[#0f172a] border-[#1e293b]'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                {/* Top Badges Wireframe */}
                <div className="flex items-center justify-between">
                  <div className={`h-6 w-24 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  <div className={`h-6 w-14 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>

                {/* Center Wireframe Subtle Icon */}
                <div className="flex items-center justify-center my-auto">
                  <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-slate-800/60' : 'bg-slate-200/80'} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-2xl ${darkMode ? 'text-slate-700' : 'text-slate-300'}`}>
                      image
                    </span>
                  </div>
                </div>

                {/* Bottom Text Area Wireframe */}
                <div className="flex flex-col pt-4">
                  <div className={`h-6 w-3/4 rounded-lg mb-2.5 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
                  <div className={`h-4 w-full rounded-md mb-1.5 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  <div className={`h-4 w-2/3 rounded-md mb-4 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`h-5 w-20 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    <div className={`h-5 w-16 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  </div>
                  <div className={`h-11 w-full rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className={`p-12 text-center rounded-[28px] border ${
            darkMode ? 'bg-[#0f172a] border-[#1e293b] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">folder_open</span>
            <p className="text-sm font-semibold">
              {lang === 'ID' ? 'Belum ada proyek dalam kategori ini.' : 'No projects found in this category.'}
            </p>
          </div>
        ) : (
          /* Cards Grid: persis sesuai file yang dikirim user */
          <div className={`grid ${gridColsClass} gap-5 sm:gap-6`}>
            {paginatedProjects.map((project, pIndex) => {
              return (
                <div
                  key={`${project.id}-${pIndex}`}
                  onClick={() => onSelectProject(project)}
                  className={`relative rounded-[28px] overflow-hidden min-h-[440px] sm:min-h-[480px] p-5 sm:p-6 border transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 select-none ${
                    darkMode
                      ? 'bg-[#0b1120] border-[#1e293b] shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:border-[#38bdf8]/50 hover:shadow-[0_20px_48px_rgba(56,189,248,0.15)]'
                      : 'bg-white border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(37,99,235,0.14)]'
                  }`}
                >
                  {/* Full Card Background Image Thumbnail */}
                  {(() => {
                    const primaryImg = formatGoogleDriveUrl(project.imageUrl);
                    const fallbackImg = getCategoryFallbackImage(project.category);
                    return (
                      <img
                        src={primaryImg || fallbackImg}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const driveFallback = getGoogleDriveFallbackUrl(project.imageUrl);
                          if (driveFallback && target.src !== driveFallback) {
                            target.src = driveFallback;
                          } else if (target.src !== fallbackImg) {
                            target.src = fallbackImg;
                          }
                        }}
                      />
                    );
                  })()}

                  {/* Darkened Gradient Overlay to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 via-50% to-black/25 pointer-events-none transition-opacity duration-300 group-hover:opacity-95" />

                  {/* Top Badge Row */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-black/55 backdrop-blur-md border border-white/20 shadow-xs">
                      {project.badge || project.category || 'Featured'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold text-white bg-black/55 backdrop-blur-md border border-white/20 shadow-xs">
                      {project.year || '2026'}
                    </span>
                  </div>

                  {/* Bottom Information Row */}
                  <div className="relative z-10 flex flex-col pt-12">
                    {/* Title & Status Indicator */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3
                        className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#38bdf8] transition-colors tracking-tight truncate drop-shadow-sm"
                        title={project.title}
                      >
                        {project.title}
                      </h3>
                      {project.status && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#bef264] shrink-0 shadow-[0_0_8px_#bef264]" title={project.status}></span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm font-medium text-slate-200 line-clamp-2 leading-relaxed mb-3 drop-shadow-xs">
                      {project.description}
                    </p>

                    {/* Micro Tag Pills (Semi-glass style yang disukai user) */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {project.tags[0] && (
                          <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 shadow-xs">
                            {project.tags[0]}
                          </span>
                        )}
                        {project.tags[1] && (
                          <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 shadow-xs hidden sm:inline-block">
                            {project.tags[1]}
                          </span>
                        )}
                      </div>
                    )}

                    {/* High-Contrast Full-Width Pill Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 bg-white text-[#090d16] hover:bg-[#bef264] hover:text-[#080c16] group-hover:bg-[#bef264] transition-all duration-200 shadow-md cursor-pointer"
                    >
                      <span>{lang === 'ID' ? 'Lihat Detail' : 'View Details'}</span>
                      <span className="material-symbols-outlined text-sm sm:text-base transition-transform group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Redesigned Pagination Controls */}
        {!isLoadingSheets && totalPages > 1 && (
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Text Result on Left */}
            <div className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'ID'
                ? `Hasil ${startIndex + 1} - ${Math.min(startIndex + CARDS_PER_PAGE, filteredProjects.length)} dari ${filteredProjects.length}`
                : `Results ${startIndex + 1} - ${Math.min(startIndex + CARDS_PER_PAGE, filteredProjects.length)} of ${filteredProjects.length}`}
            </div>

            {/* Navigation: < 1 2 3 > */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Prev Button */}
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === 1
                    ? 'opacity-30 cursor-not-allowed text-slate-400'
                    : darkMode
                    ? 'bg-[#1e293b] text-slate-200 hover:bg-[#283955] hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>

              {/* Numbered Page Dots with Primary Active State */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-[#2563eb] text-white shadow-sm'
                          : darkMode
                          ? 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === totalPages
                    ? 'opacity-30 cursor-not-allowed text-slate-400'
                    : darkMode
                    ? 'bg-[#1e293b] text-slate-200 hover:bg-[#283955] hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};