import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { StatsAndBio } from './components/StatsAndBio';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ProjectItem } from './data/portfolioData';

export default function App() {
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div
      className={`font-sans antialiased min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode
          ? 'bg-[#080c16] text-[#f8fafc] selection:bg-[#bef264] selection:text-[#080c16]'
          : 'bg-[#faf8ff] text-[#131b2e] selection:bg-[#c1f100] selection:text-[#546b00]'
      }`}
    >
      {/* Fixed Floating Header */}
      <Navbar
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Sections */}
      <main
        className={`w-full pt-20 flex-grow transition-colors duration-300 ${
          darkMode ? 'bg-[#080c16]' : 'bg-[#faf8ff]'
        }`}
      >
        <div className="flex flex-col w-full">
          {/* Top Ambient Halo & Hero Wrapper */}
          <Hero lang={lang} darkMode={darkMode} />

          {/* Marquee Ticker Ribbon (Acid Lime / Neo-Brutalist Pop in Light, Cyber Dark in Dark Mode) */}
          <Marquee darkMode={darkMode} />

          {/* Bento Stats & Ringkasan Profil */}
          <StatsAndBio lang={lang} darkMode={darkMode} />

          {/* Keahlian & Tech Stack (Colorful Bento Grid) */}
          <Skills lang={lang} darkMode={darkMode} />

          {/* Proyek Pilihan (Featured Projects Showcase) */}
          <Projects
            lang={lang}
            darkMode={darkMode}
            onSelectProject={(project) => setSelectedProject(project)}
          />

          {/* Linimasa & Pengalaman Kerja (Timeline) */}
          <Experience lang={lang} darkMode={darkMode} />

          {/* Testimoni & Rekomendasi Klien */}
          <Testimonials lang={lang} darkMode={darkMode} />

          {/* Hubungi & Formulir Kolaborasi Interaktif */}
          <Contact lang={lang} darkMode={darkMode} />
        </div>
      </main>

      {/* Footer */}
      <Footer lang={lang} darkMode={darkMode} />

      {/* Project Case Study Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        lang={lang}
        darkMode={darkMode}
      />
    </div>
  );
}
