import React from 'react';

interface ExperienceProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({ lang, darkMode }) => {
  const experiences = [
    {
      number: '01',
      numberBg: 'bg-[#2563eb]',
      role: 'UI/UX Design Intern',
      status: lang === 'ID' ? 'Aktif / 2026' : 'Active / 2026',
      statusHighlight: true,
      company: 'Infotact Solutions • Remote',
      desc: lang === 'ID'
        ? 'Mengembangkan komponen UI terstandarisasi, flow prototipe interaktif untuk dashboard klien enterprise, dan audit aksesibilitas antarmuka pengguna.'
        : 'Developing standardized UI components, interactive prototypes for enterprise dashboards, and conducting user accessibility audits.',
      tag: 'Figma • Prototyping',
      specialBadge: false,
    },
    {
      number: '02',
      numberBg: 'bg-[#7e22ce]',
      role: 'UI Design System Developer',
      status: '2025',
      statusHighlight: false,
      company: 'Machine Vision Indonesia • Hybrid',
      desc: lang === 'ID'
        ? 'Membangun tokenisasi desain dan implementasi library komponen berbasis Tailwind CSS & React untuk sistem monitoring komputer visi industri manufaktur.'
        : 'Engineered design tokenization and component library implementation with Tailwind CSS & React for manufacturing computer vision systems.',
      tag: 'Design Ops • React',
      specialBadge: false,
    },
    {
      number: '03',
      numberBg: 'bg-[#0284c7]',
      role: 'Software Engineering Graduate',
      status: '2023 - 2024',
      statusHighlight: false,
      company: 'SMK Telkom Malang • Malang, Jawa Timur',
      desc: lang === 'ID'
        ? 'Fokus kompetensi pada Rekayasa Perangkat Lunak, algoritma struktur data, pemrograman berorientasi objek, basis data relasional, dan metodologi Agile Scrum.'
        : 'Focused on Software Engineering, data structure algorithms, object-oriented programming, relational databases, and Agile Scrum methodologies.',
      tag: lang === 'ID' ? 'Lulusan Terbaik RPL' : 'Valedictorian • SE',
      specialBadge: true,
    },
  ];

  return (
    <section
      className={`w-full py-space-xl transition-colors duration-300 ${
        darkMode ? 'bg-[#0b1120] border-y border-[#1e293b]' : 'bg-[#f2f3ff]'
      }`}
      id="pengalaman"
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
              <span className="material-symbols-outlined text-sm">history_edu</span>
              <span className="tracking-wider">
                {lang === 'ID' ? 'JEJAK LANGKAH & KARIER' : 'CAREER & EDUCATION'}
              </span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {lang === 'ID' ? 'Pengalaman Kerja & Pendidikan' : 'Work Experience & Education'}
            </h2>
          </div>
          <p
            className={`text-base max-w-md font-medium ${
              darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
            }`}
          >
            {lang === 'ID'
              ? 'Evolusi berkelanjutan dari bangku sekolah vokasi terkemuka hingga menangani rekayasa antarmuka di level industri.'
              : 'A continuous evolution from top-tier vocational roots to enterprise-level interface architecture.'}
          </p>
        </div>

        {/* Timeline Items */}
        <div className="space-y-space-md">
          {experiences.map((item, idx) => (
            <div
              key={idx}
              className={`p-space-lg rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border transition-colors ${
                darkMode
                  ? 'bg-[#111a2e] border-[#1e293b]'
                  : 'bg-white border-[#eaedff]'
              }`}
            >
              <div className="flex items-start gap-space-md">
                <div
                  className={`w-12 h-12 rounded-full ${item.numberBg} text-white flex items-center justify-center shrink-0 shadow-sm mt-1 md:mt-0 font-extrabold text-lg`}
                >
                  {item.number}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3
                      className={`text-lg sm:text-xl font-bold ${
                        darkMode ? 'text-white' : 'text-[#131b2e]'
                      }`}
                    >
                      {item.role}
                    </h3>
                    {item.statusHighlight ? (
                      <span className="text-xs px-3 py-0.5 rounded-full bg-[#bef264] text-[#080c16] font-extrabold shadow-sm">
                        {item.status}
                      </span>
                    ) : (
                      <span
                        className={`text-xs px-3 py-0.5 rounded-full font-bold ${
                          darkMode
                            ? 'bg-[#16223b] border border-[#334155] text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      darkMode ? 'text-[#38bdf8]' : 'text-primary'
                    }`}
                  >
                    {item.company}
                  </p>
                  <p
                    className={`text-sm sm:text-base mt-1 max-w-2xl font-medium leading-relaxed ${
                      darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {item.specialBadge ? (
                  <span
                    className={`text-xs px-3.5 py-1 rounded-full font-bold border ${
                      darkMode
                        ? 'bg-[#16223b] border-[#bef264]/40 text-[#bef264]'
                        : 'bg-[#f4fde8] border-[#bef264] text-[#3c4d00]'
                    }`}
                  >
                    {item.tag}
                  </span>
                ) : (
                  <span
                    className={`text-xs px-3.5 py-1 rounded-full font-medium ${
                      darkMode
                        ? 'bg-[#16223b] border border-[#334155] text-[#cbd5e1]'
                        : 'bg-[#f2f3ff] text-[#434655]'
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
