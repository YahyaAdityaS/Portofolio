import React from 'react';

interface StatsAndBioProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
}

export const StatsAndBio: React.FC<StatsAndBioProps> = ({ lang, darkMode }) => {
  return (
    <section className="w-full py-space-xl transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
          
          {/* Stat Card 1 */}
          <div
            className={`p-space-lg rounded-2xl shadow-sm hover:-translate-y-1 transition-all flex flex-col justify-between border ${
              darkMode
                ? 'bg-[#111a2e] border-[#1e293b]'
                : 'bg-white border-[#eaedff]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-space-md ${
                darkMode
                  ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                  : 'bg-[#eef1ff] text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-xl">folder_managed</span>
            </div>
            <div>
              <div
                className={`text-3xl sm:text-4xl tracking-tight font-extrabold leading-none mb-1 ${
                  darkMode ? 'text-[#38bdf8]' : 'text-primary'
                }`}
              >
                15+
              </div>
              <div
                className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                {lang === 'ID' ? 'Proyek Selesai' : 'Completed Projects'}
              </div>
              <p
                className={`text-xs mt-1 ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                Enterprise apps, open-source tool, & UI kits.
              </p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div
            className={`p-space-lg rounded-2xl shadow-sm hover:-translate-y-1 transition-all flex flex-col justify-between border ${
              darkMode
                ? 'bg-[#111a2e] border-[#1e293b]'
                : 'bg-white border-[#eaedff]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-space-md ${
                darkMode
                  ? 'bg-[#16223b] border border-[#bef264]/40 text-[#bef264]'
                  : 'bg-[#f4fde8] text-[#546b00]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">speed</span>
            </div>
            <div>
              <div
                className={`text-3xl sm:text-4xl tracking-tight font-extrabold leading-none mb-1 ${
                  darkMode ? 'text-[#bef264]' : 'text-[#0f172a]'
                }`}
              >
                99.2%
              </div>
              <div
                className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                {lang === 'ID' ? 'Optimasi Kode' : 'Code Optimization'}
              </div>
              <p
                className={`text-xs mt-1 ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                Benchmark zero-layout shift & bundle budget.
              </p>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div
            className={`p-space-lg rounded-2xl shadow-sm hover:-translate-y-1 transition-all flex flex-col justify-between border ${
              darkMode
                ? 'bg-[#111a2e] border-[#1e293b]'
                : 'bg-white border-[#eaedff]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-space-md ${
                darkMode
                  ? 'bg-[#16223b] border border-[#c084fc]/40 text-[#c084fc]'
                  : 'bg-[#f7edff] text-[#7e22ce]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">timer</span>
            </div>
            <div>
              <div
                className={`text-3xl sm:text-4xl tracking-tight font-extrabold leading-none mb-1 ${
                  darkMode ? 'text-[#c084fc]' : 'text-[#7e22ce]'
                }`}
              >
                3+ Thn
              </div>
              <div
                className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                {lang === 'ID' ? 'Pengalaman Aktif' : 'Active Experience'}
              </div>
              <p
                className={`text-xs mt-1 ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                Dari pondasi SMK Telkom hingga level profesional.
              </p>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div
            className={`p-space-lg rounded-2xl shadow-sm hover:-translate-y-1 transition-all flex flex-col justify-between border ${
              darkMode
                ? 'bg-[#111a2e] border-[#1e293b]'
                : 'bg-white border-[#eaedff]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-space-md ${
                darkMode
                  ? 'bg-[#16223b] border border-[#60a5fa]/40 text-white'
                  : 'bg-[#e2e7ff] text-[#1d4ed8]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">verified_user</span>
            </div>
            <div>
              <div
                className={`text-3xl sm:text-4xl tracking-tight font-extrabold leading-none mb-1 ${
                  darkMode ? 'text-white' : 'text-[#1d4ed8]'
                }`}
              >
                100%
              </div>
              <div
                className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                {lang === 'ID' ? 'Tepat Waktu' : 'On-Time Delivery'}
              </div>
              <p
                className={`text-xs mt-1 ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                Sprint berorientasi delivery & standardisasi CI/CD.
              </p>
            </div>
          </div>

        </div>

        {/* Narrative Bio Card with Split Layout */}
        <div
          className={`rounded-3xl p-space-lg lg:p-space-xl shadow-sm border transition-colors ${
            darkMode
              ? 'bg-[#111a2e] border-[#1e293b]'
              : 'bg-white border-[#eaedff]'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            
            <div className="lg:col-span-5">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-space-sm ${
                  darkMode
                    ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                    : 'bg-[#e2e7ff] text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">person</span>
                <span>
                  {lang === 'ID' ? 'Filosofi Rekayasa' : 'Engineering Philosophy'}
                </span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                {lang === 'ID'
                  ? 'Membangun Perangkat Lunak Bukan Sekadar Menulis Kode.'
                  : 'Building Software Goes Beyond Just Writing Code.'}
              </h2>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <p
                className={`text-base sm:text-lg leading-relaxed font-medium ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                {lang === 'ID'
                  ? 'Saya memandang software engineering sebagai sinergi antara logika komputasi yang deterministik dan pengalaman manusia yang empatik. Latar belakang saya di Rekayasa Perangkat Lunak mengakar kuat pada disiplin penulisan kode terstruktur, modularitas komponen, serta pengujian berkala.'
                  : 'I perceive software engineering as the harmony between deterministic computing logic and empathetic human experience. Grounded in Software Engineering, my workflow is rooted in structured coding disciplines, modular architectures, and rigorous testing.'}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  {
                    name: 'Modular Design System',
                    icon: 'grid_view',
                    light: 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 hover:border-sky-300',
                    dark: 'bg-sky-950/50 text-sky-300 border-sky-800 hover:bg-sky-900/50 hover:border-sky-600',
                    dot: 'bg-[#38bdf8]',
                  },
                  {
                    name: 'Semantic HTML & A11y',
                    icon: 'accessibility_new',
                    light: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300',
                    dark: 'bg-emerald-950/50 text-[#bef264] border-emerald-800/80 hover:bg-emerald-900/50 hover:border-emerald-600',
                    dot: 'bg-[#bef264]',
                  },
                  {
                    name: 'Type Safety First',
                    icon: 'code_blocks',
                    light: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 hover:border-purple-300',
                    dark: 'bg-purple-950/50 text-purple-300 border-purple-800 hover:bg-purple-900/50 hover:border-purple-600',
                    dot: 'bg-[#c084fc]',
                  },
                  {
                    name: 'Micro-Interactions',
                    icon: 'touch_app',
                    light: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100 hover:border-amber-300',
                    dark: 'bg-amber-950/50 text-amber-300 border-amber-800 hover:bg-amber-900/50 hover:border-amber-600',
                    dot: 'bg-[#f59e0b]',
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`text-xs px-3 py-2 rounded-full font-bold text-center transition-all flex items-center justify-center gap-1.5 border shadow-xs hover:-translate-y-0.5 ${
                      darkMode ? item.dark : item.light
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`}></span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
