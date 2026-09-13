import React, { useState, useEffect } from 'react';

interface InteractiveMapProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
}

interface LocationTarget {
  id: 'malang' | 'jakarta';
  city: string;
  province: string;
  description: { ID: string; EN: string };
  coordinates: string;
  lat: number;
  lng: number;
  zoom: number;
  gmapsUrl: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ lang, darkMode }) => {
  const [selectedLoc, setSelectedLoc] = useState<'malang' | 'jakarta'>('malang');
  const [currentTime, setCurrentTime] = useState<string>('');

  const locations: Record<'malang' | 'jakarta', LocationTarget> = {
    malang: {
      id: 'malang',
      city: 'Malang',
      province: 'Jawa Timur, Indonesia',
      description: {
        ID: 'Pusat operasional, riset rekayasa web, dan kolaborasi remote.',
        EN: 'Primary engineering workspace, web architecture research & remote hub.',
      },
      coordinates: '7°58\'44.4"S 112°37\'48.0"E',
      lat: -7.9786,
      lng: 112.6318,
      zoom: 13,
      gmapsUrl: 'https://maps.google.com/?q=Malang,East+Java',
    },
    jakarta: {
      id: 'jakarta',
      city: 'Jakarta',
      province: 'DKI Jakarta, Indonesia',
      description: {
        ID: 'Jaringan mitra teknologi, konsultasi klien korporasi, dan agile sprint.',
        EN: 'Technology partner network, corporate client consultations & agile sprints.',
      },
      coordinates: '6°12\'31.7"S 106°50\'44.2"E',
      lat: -6.2088,
      lng: 106.8456,
      zoom: 12,
      gmapsUrl: 'https://maps.google.com/?q=Jakarta,Indonesia',
    },
  };

  const active = locations[selectedLoc];

  // Update live clock in WIB (UTC+7)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(`${timeStr} WIB`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Free OpenStreetMap embed URL with coordinates bounding box
  const bboxPadding = selectedLoc === 'malang' ? 0.05 : 0.08;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${active.lng - bboxPadding}%2C${
    active.lat - bboxPadding
  }%2C${active.lng + bboxPadding}%2C${active.lat + bboxPadding}&layer=mapnik&marker=${active.lat}%2C${active.lng}`;

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border shadow-lg transition-all duration-300 ${
        darkMode
          ? 'bg-[#0d1527] border-[#1e293b] shadow-[0_15px_35px_rgba(0,0,0,0.4)]'
          : 'bg-white border-[#eaedff] shadow-[0_15px_35px_rgba(37,99,235,0.06)]'
      }`}
    >
      {/* Top Header & Location Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                darkMode ? 'bg-[#bef264]' : 'bg-[#2563eb]'
              }`}
            ></span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                darkMode ? 'text-[#38bdf8]' : 'text-primary'
              }`}
            >
              {lang === 'ID' ? 'Lokasi & Zona Waktu' : 'Location & Timezone'}
            </span>
          </div>
          <h3
            className={`text-xl sm:text-2xl font-black tracking-tight ${
              darkMode ? 'text-white' : 'text-[#131b2e]'
            }`}
          >
            {active.city}, <span className="font-semibold text-sm opacity-80">{active.province}</span>
          </h3>
        </div>

        {/* Location Selector Tabs */}
        <div
          className={`flex items-center p-1.5 rounded-2xl border self-start sm:self-center transition-colors ${
            darkMode ? 'bg-[#16223b] border-[#23324f]' : 'bg-[#f2f3ff] border-[#eaedff]'
          }`}
        >
          <button
            type="button"
            onClick={() => setSelectedLoc('malang')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLoc === 'malang'
                ? darkMode
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-white text-primary shadow-xs'
                : darkMode
                ? 'text-[#94a3b8] hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📍</span>
            <span>Malang Base</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedLoc('jakarta')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLoc === 'jakarta'
                ? darkMode
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-white text-primary shadow-xs'
                : darkMode
                ? 'text-[#94a3b8] hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏢</span>
            <span>Jakarta Hub</span>
          </button>
        </div>
      </div>

      {/* Map Display Frame with Theme-Adaptive Filters */}
      <div
        className={`relative w-full h-[320px] sm:h-[390px] rounded-3xl overflow-hidden border transition-all ${
          darkMode ? 'border-[#23324f]' : 'border-slate-200'
        }`}
      >
        {/* Interactive Free OSM Map with Dark Theme CSS Transformation */}
        <iframe
          title={`Map of ${active.city}`}
          src={mapEmbedUrl}
          className={`w-full h-full border-0 transition-all duration-500 ${
            darkMode
              ? 'invert-[0.92] hue-rotate-[185deg] contrast-[1.1] brightness-[0.88] saturate-[0.8]'
              : 'contrast-[1.02]'
          }`}
          loading="lazy"
        />

        {/* Cyber / Clean Floating Overlay Card on Map with Spacious Padding and Margin */}
        <div
          className={`absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-auto sm:max-w-sm backdrop-blur-xl p-4 sm:p-5 rounded-2xl border shadow-2xl transition-all ${
            darkMode
              ? 'bg-[#0f172a]/95 border-[#334155] text-white'
              : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-[0_12px_30px_rgba(0,0,0,0.12)]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-tight px-3 py-1 rounded-lg border ${
                darkMode
                  ? 'bg-[#1e293b] text-[#bef264] border-[#334155]'
                  : 'bg-blue-50 text-[#2563eb] border-blue-100'
              }`}
            >
              {active.coordinates}
            </span>
            <span className="text-xs font-mono font-bold text-[#bef264] bg-[#060911]/90 px-3 py-1 rounded-lg border border-slate-700/60 shadow-xs">
              {currentTime || 'GMT+7'}
            </span>
          </div>
          <p className="text-xs sm:text-[13px] font-normal leading-relaxed opacity-90">
            {lang === 'ID' ? active.description.ID : active.description.EN}
          </p>
        </div>

        {/* Theme Mode Indicator Badge on Map Corner */}
        <div
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider backdrop-blur-md border shadow-sm ${
            darkMode
              ? 'bg-[#0b1120]/85 border-[#334155] text-[#38bdf8]'
              : 'bg-white/85 border-slate-200 text-slate-700'
          }`}
        >
          {darkMode ? 'DARK MODE MAP TILE' : 'LIGHT MODE MAP TILE'}
        </div>
      </div>

      {/* Bottom Info Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-[#1e293b]">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span
            className={`material-symbols-outlined text-base ${
              darkMode ? 'text-[#bef264]' : 'text-primary'
            }`}
          >
            schedule
          </span>
          <span className={darkMode ? 'text-[#cbd5e1]' : 'text-slate-600'}>
            {lang === 'ID'
              ? 'Jam Kerja Responsif: 08.00 - 22.00 WIB (Senin - Sabtu)'
              : 'Responsive Hours: 08:00 - 22:00 WIB (Mon - Sat)'}
          </span>
        </div>

        <a
          href={active.gmapsUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors self-end sm:self-auto ${
            darkMode
              ? 'text-[#38bdf8] hover:text-[#bef264]'
              : 'text-primary hover:text-blue-700'
          }`}
        >
          <span>{lang === 'ID' ? 'Buka di Google Maps' : 'Open in Google Maps'}</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </div>
    </div>
  );
};
