import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { CursorFollower } from './components/CursorFollower';
import { CVModal } from './components/CVModal';
import { AdminModal } from './components/AdminModal';
import { LoadingScreen } from './components/LoadingScreen';
import { ProjectItem } from './data/portfolioData';

export default function App() {
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  // Only show initial loading screen on fresh visit; skip on refresh if already loaded
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('yas_portfolio_loaded');
    } catch {
      return false;
    }
  });
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isCVOpen, setIsCVOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLoadingComplete = () => {
    try {
      sessionStorage.setItem('yas_portfolio_loaded', 'true');
    } catch (e) {
      // Ignore in strict private mode
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`font-sans antialiased min-h-screen flex flex-col transition-colors duration-300 relative ${
        darkMode
          ? 'bg-[#080c16] text-[#f8fafc] selection:bg-[#bef264] selection:text-[#080c16]'
          : 'bg-[#faf8ff] text-[#131b2e] selection:bg-[#c1f100] selection:text-[#546b00]'
      }`}
    >
      {/* Interactive Cursor Follower with Shadow Glow Effect */}
      <CursorFollower darkMode={darkMode} />

      {/* Modern Glassmorphic Initial Loading Screen with Dive-In Exit Animation */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen
            key="initial-loading-screen"
            darkMode={darkMode}
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      {/* Fixed Floating Header - mounted outside motion.div so position:fixed is anchored to viewport and floats when scrolling */}
      <Navbar
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Page Container with Clean Transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full flex-grow flex flex-col min-h-screen"
      >
        {/* Main Content Sections */}
        <main
          className={`w-full pt-20 flex-grow transition-colors duration-300 ${
            darkMode ? 'bg-[#080c16]' : 'bg-[#faf8ff]'
          }`}
        >
          <div className="flex flex-col w-full">
            {/* Top Ambient Halo & Hero Wrapper */}
            <Hero
              lang={lang}
              darkMode={darkMode}
              onOpenCV={() => setIsCVOpen(true)}
            />

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
            <Testimonials
              lang={lang}
              darkMode={darkMode}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />

            {/* Hubungi & Formulir Kolaborasi Interaktif */}
            <Contact lang={lang} darkMode={darkMode} />
          </div>
        </main>

        {/* Footer with subtle hidden underscore admin trigger */}
        <Footer
          lang={lang}
          darkMode={darkMode}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </motion.div>

      {/* Project Case Study Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        lang={lang}
        darkMode={darkMode}
      />

      {/* Professional Curriculum Vitae (CV) & Printable PDF Modal */}
      <CVModal
        isOpen={isCVOpen}
        onClose={() => setIsCVOpen(false)}
        lang={lang}
        darkMode={darkMode}
      />

      {/* Hidden Admin Security & Moderation Terminal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        lang={lang}
        darkMode={darkMode}
        onReplayLoading={() => setIsLoading(true)}
      />
    </div>
  );
}
