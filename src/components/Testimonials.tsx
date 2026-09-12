import React from 'react';

interface TestimonialsProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang, darkMode }) => {
  const testimonials = [
    {
      stars: 5,
      quote: lang === 'ID'
        ? '“Yahya mampu menerjemahkan rancangan antarmuka yang sangat kompleks menjadi implementasi Tailwind dan React tanpa kehilangan detail estetika sedikit pun. Kecepatan kerjanya luar biasa.”'
        : '“Yahya translated complex interface blueprints into production-ready Tailwind and React implementations without sacrificing a single aesthetic detail. Remarkable velocity.”',
      author: 'Rian Ardiansyah',
      role: 'Lead Product Designer • Infotact',
      avatar: 'RA',
      avatarBg: 'bg-[#2563eb]',
      avatarText: 'text-white',
    },
    {
      stars: 5,
      quote: lang === 'ID'
        ? '“Arsitektur kode FastAPI yang disusun untuk proyek evaluasi semantik kami sangat bersih. Skemanya rapi, dokumentasi OpenAPI otomatis lengkap, dan mudah dimaintain oleh tim internal.”'
        : '“The FastAPI code architecture designed for our semantic evaluation engine was remarkably clean. Documented OpenAPI schemas and seamless internal maintainability.”',
      author: 'Dimas Kurniawan',
      role: 'Engineering Manager • TechLab',
      avatar: 'DK',
      avatarBg: 'bg-[#bef264]',
      avatarText: 'text-[#080c16]',
    },
    {
      stars: 5,
      quote: lang === 'ID'
        ? '“Etos kerja dan ketepatan waktu delivery Yahya sangat teruji sejak di SMK Telkom Malang. Menyenangkan sekali berkolaborasi dengan developer yang memahami design logic secara mendalam.”'
        : '“Yahya’s delivery ethic and speed have been proven since his vocational roots at SMK Telkom Malang. It is refreshing to collaborate with an engineer who genuinely grasps design logic.”',
      author: 'Fauzan Wicaksono',
      role: 'Senior Frontend Engineer',
      avatar: 'FW',
      avatarBg: 'bg-[#7e22ce]',
      avatarText: 'text-white',
    },
  ];

  return (
    <section className="w-full py-space-xl transition-colors duration-300" id="testimoni">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-space-xs ${
                darkMode
                  ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                  : 'bg-[#dce1ff] text-primary'
              }`}
            >
              <span className="tracking-wider">
                {lang === 'ID' ? 'SUARA REKAN & KLIEN' : 'PEER & CLIENT FEEDBACK'}
              </span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-[#131b2e]'
              }`}
            >
              {lang === 'ID' ? 'Testimoni & Rekomendasi' : 'Testimonials & Endorsements'}
            </h2>
          </div>
          <p
            className={`text-base max-w-md font-medium ${
              darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
            }`}
          >
            {lang === 'ID'
              ? 'Kesan nyata dari rekan tim rekayasa perangkat lunak, manajer produk, dan mitra kolaborasi.'
              : 'Authentic words from software engineering peers, product managers, and collaboration partners.'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-space-lg shadow-sm flex flex-col justify-between border transition-colors ${
                darkMode
                  ? 'bg-[#111a2e] border-[#1e293b]'
                  : 'bg-white border-[#eaedff]'
              }`}
            >
              <div>
                <div className="flex items-center gap-1 text-[#facc15] mb-space-sm">
                  {[...Array(item.stars)].map((_, starIdx) => (
                    <span
                      key={starIdx}
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p
                  className={`text-sm sm:text-base italic mb-space-lg leading-relaxed ${
                    darkMode ? 'text-white' : 'text-[#131b2e]'
                  }`}
                >
                  {item.quote}
                </p>
              </div>

              <div
                className={`flex items-center gap-3 pt-space-sm border-t ${
                  darkMode ? 'border-[#1e293b]' : 'border-[#eaedff]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${item.avatarBg} ${item.avatarText} font-extrabold flex items-center justify-center text-sm shadow-sm`}
                >
                  {item.avatar}
                </div>
                <div>
                  <div
                    className={`text-sm font-bold ${
                      darkMode ? 'text-white' : 'text-[#131b2e]'
                    }`}
                  >
                    {item.author}
                  </div>
                  <div
                    className={`text-xs ${
                      darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                    }`}
                  >
                    {item.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
