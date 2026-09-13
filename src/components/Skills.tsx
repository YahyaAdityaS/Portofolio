import React from 'react';

interface SkillsProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
}

export const Skills: React.FC<SkillsProps> = ({ lang, darkMode }) => {
  return (
    <section
      className={`w-full py-space-xl transition-colors duration-300 scroll-mt-28 ${
        darkMode ? 'bg-[#0b1120] border-y border-[#1e293b]' : 'bg-[#f2f3ff]'
      }`}
      id="keahlian"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-space-xs ${
                darkMode
                  ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                  : 'bg-white text-primary'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  darkMode ? 'bg-[#38bdf8]' : 'bg-primary'
                }`}
              ></span>
              <span className="tracking-wider">
                {lang === 'ID' ? 'ARSITEKTUR & KAPABILITAS' : 'ARCHITECTURE & CAPABILITIES'}
              </span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {lang === 'ID' ? 'Keahlian & Stack Teknologi' : 'Skills & Tech Stack'}
            </h2>
          </div>
          <p
            className={`text-base max-w-md font-medium ${
              darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
            }`}
          >
            {lang === 'ID'
              ? 'Alat dan metodologi terkini yang saya gunakan setiap hari untuk mewujudkan produk digital berskala produksi.'
              : 'Cutting-edge tooling and methodologies leveraged daily to ship production-grade software.'}
          </p>
        </div>

        {/* Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md">
          
          {/* Card 1: Frontend Engineering (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-3xl p-space-lg shadow-sm flex flex-col justify-between border transition-colors ${
              darkMode
                ? 'bg-[#111a2e] border-[#1e293b]'
                : 'bg-white border-[#eaedff]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                    darkMode
                      ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                      : 'bg-[#eef1ff] text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">desktop_windows</span>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    darkMode
                      ? 'bg-[#38bdf8]/15 border border-[#38bdf8]/50 text-[#38bdf8]'
                      : 'bg-[#eef1ff] text-primary'
                  }`}
                >
                  {lang === 'ID' ? 'Utama' : 'Primary'}
                </span>
              </div>

              <h3
                className={`text-xl sm:text-2xl font-extrabold mb-space-xs ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                Frontend Engineering & Next-Gen Web
              </h3>
              <p
                className={`text-sm sm:text-base mb-space-md font-medium ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                {lang === 'ID'
                  ? 'Membangun Single Page Application dan Server-Side Rendered apps dengan kecepatan kilat, zero runtime bloat, dan arsitektur atomic component.'
                  : 'Building resilient SPAs and Server-Side Rendered applications with blazing velocity, zero runtime bloat, and atomic components.'}
              </p>

              {/* Mini Interactive Code Simulation */}
              <div
                className={`p-space-md rounded-2xl font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto shadow-inner mb-space-md border transition-colors ${
                  darkMode
                    ? 'bg-[#080c16] border-[#23324f] text-[#f8fafc]'
                    : 'bg-[#080c16] text-[#f8fafc] border-slate-800'
                }`}
              >
                <div className="text-[#64748b]">// App Router & Server Actions</div>
                <div>
                  <span className="text-[#bef264] font-bold">export async function</span>{' '}
                  <span className="text-[#38bdf8] font-semibold">getProjects</span>() &#123;
                </div>
                <div className="pl-4 text-[#e2e8f0]">
                  <span className="text-[#bef264] font-bold">const</span> res ={' '}
                  <span className="text-[#bef264] font-bold">await</span> db.query.projects.findMany();
                </div>
                <div className="pl-4 text-[#e2e8f0]">
                  <span className="text-[#bef264] font-bold">return</span> res.map(hydrateComponents);
                </div>
                <div>&#125;</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['Next.js 14', 'React 18/19', 'TypeScript', 'Tailwind CSS', 'Zustand'].map((tag) => (
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

          {/* Card 2: Backend & Cloud APIs (5 cols) */}
          <div
            className={`lg:col-span-5 rounded-3xl p-space-lg shadow-sm flex flex-col justify-between border transition-colors ${
              darkMode
                ? 'bg-[#111a2e] border-[#1e293b]'
                : 'bg-white border-[#eaedff]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                    darkMode
                      ? 'bg-[#16223b] border border-[#bef264]/40 text-[#bef264]'
                      : 'bg-[#f4fde8] text-[#546b00]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">dns</span>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-extrabold ${
                    darkMode
                      ? 'bg-[#bef264]/15 border border-[#bef264]/50 text-[#bef264]'
                      : 'bg-[#f4fde8] text-[#546b00]'
                  }`}
                >
                  API Engine
                </span>
              </div>

              <h3
                className={`text-xl sm:text-2xl font-extrabold mb-space-xs ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                Backend & Cloud API
              </h3>
              <p
                className={`text-sm sm:text-base mb-space-md font-medium ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                {lang === 'ID'
                  ? 'Perancangan RESTful & GraphQL endpoints yang aman, efisien, dengan caching Redis dan schema PostgreSQL ternormalisasi.'
                  : 'Architecting RESTful & GraphQL services with Redis caching, transaction safety, and clean PostgreSQL data schemas.'}
              </p>

              <ul className="space-y-2 mb-space-md">
                {[
                  'FastAPI Python • Asynchronous Workers',
                  'Node.js / Express • JWT Authentication',
                  'PostgreSQL & Prisma ORM Telemetry',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className={`material-symbols-outlined text-base ${
                        darkMode ? 'text-[#38bdf8]' : 'text-primary'
                      }`}
                    >
                      check_circle
                    </span>
                    <span className={darkMode ? 'text-[#cbd5e1]' : 'text-[#131b2e]'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['FastAPI', 'Node.js', 'PostgreSQL', 'Supabase'].map((tag) => (
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

          {/* Card 3: UI/UX & Design Systems (6 cols) */}
          <div
            className={`lg:col-span-6 rounded-3xl p-space-lg shadow-sm flex flex-col justify-between border transition-colors ${
              darkMode
                ? 'bg-[#111a2e] border-[#1e293b]'
                : 'bg-white border-[#eaedff]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                    darkMode
                      ? 'bg-[#16223b] border border-[#c084fc]/40 text-[#c084fc]'
                      : 'bg-[#f7edff] text-[#7e22ce]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">palette</span>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    darkMode
                      ? 'bg-[#c084fc]/15 border border-[#c084fc]/50 text-[#c084fc]'
                      : 'bg-[#f7edff] text-[#7e22ce]'
                  }`}
                >
                  Visual Ops
                </span>
              </div>

              <h3
                className={`text-xl sm:text-2xl font-extrabold mb-space-xs ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                UI/UX & Design Systems
              </h3>
              <p
                className={`text-sm sm:text-base mb-space-md font-medium ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                {lang === 'ID'
                  ? 'Menghubungkan Figma Design Tokens secara langsung ke Tailwind Config dan CSS Variables. Memastikan konsistensi antar-platform tanpa friction.'
                  : 'Bridging Figma Design Tokens into Tailwind Configs and CSS Variables to ensure zero-friction parity across platforms.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['Figma Tokens', 'Design Ops', 'WCAG 2.1 AA', 'Prototyping'].map((tag) => (
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

          {/* Card 4: DevOps & Clean Engineering Mindset (6 cols) */}
          <div
            className={`lg:col-span-6 rounded-3xl p-space-lg shadow-sm flex flex-col justify-between border transition-colors ${
              darkMode
                ? 'bg-[#111a2e] border-[#1e293b]'
                : 'bg-white border-[#eaedff]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                    darkMode
                      ? 'bg-[#16223b] border border-[#60a5fa]/40 text-[#60a5fa]'
                      : 'bg-[#e2e7ff] text-[#1d4ed8]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">terminal</span>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-extrabold ${
                    darkMode
                      ? 'bg-[#60a5fa]/15 border border-[#60a5fa]/50 text-[#93c5fd]'
                      : 'bg-[#e2e7ff] text-[#1d4ed8]'
                  }`}
                >
                  Best Practices
                </span>
              </div>

              <h3
                className={`text-xl sm:text-2xl font-extrabold mb-space-xs ${
                  darkMode ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                DevOps & Engineering Rigor
              </h3>
              <p
                className={`text-sm sm:text-base mb-space-md font-medium ${
                  darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                }`}
              >
                {lang === 'ID'
                  ? 'Automated linting, Git semantic branching, Dockerized development environments, dan zero-downtime deployment pipelines ke Vercel atau VPS.'
                  : 'Automated linting, semantic branching, containerized local development, and zero-downtime CI/CD pipelines to Edge/VPS.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['GitHub Actions', 'Docker', 'Vercel Edge', 'Vitest / Jest'].map((tag) => (
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
      </div>
    </section>
  );
};
