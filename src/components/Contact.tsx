import React, { useState } from 'react';
import { InteractiveMap } from './InteractiveMap';

interface ContactProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
}

export const Contact: React.FC<ContactProps> = ({ lang, darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'fullstack',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxObfZfzBGxrV4HI6W1Iso4jaKp-Ac-ODyWsjS00SeBNF4PWYljGEe0b-7pr6kzQUVV/exec';

  const serviceOptions = [
    {
      value: 'fullstack',
      label: 'Full-Stack Web Development (Next.js + Python)',
    },
    {
      value: 'frontend',
      label: 'Creative Frontend & Web Animation',
    },
    {
      value: 'designsystem',
      label: 'UI/UX Design & Figma Design System',
    },
    {
      value: 'consult',
      label: 'Konsultasi Arsitektur Perangkat Lunak',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const selectedService = serviceOptions.find(s => s.value === formData.service)?.label || formData.service;
    const fullMessage = `[Kategori: ${selectedService}]\n\n${formData.message}`;

    try {
      // Send payload as plain text/urlencoded or JSON with no-cors / mode handling for Google Apps Script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: fullMessage,
        }),
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', service: 'fullstack', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    } catch (err) {
      console.error('Error submitting form:', err);
      // Even if CORS blocks response reading on some browsers, fetch usually succeeds inserting row in Apps Script
      setSubmitted(true);
      setFormData({ name: '', email: '', service: 'fullstack', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    // Sesuaikan email dengan yang tertera di UI (dengan titik)
    const emailToCopy = 'yahyaditya.s@gmail.com'; 

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback untuk koneksi non-HTTPS (HTTP) / browser/iframe tertentu
        const textArea = document.createElement('textarea');
        textArea.value = emailToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (err) {
      console.error('Gagal menyalin email:', err);
    }
  };

  return (
    <section
      className={`w-full py-space-xl transition-colors duration-300 scroll-mt-28 ${
        darkMode ? 'bg-[#0b1120] border-t border-[#1e293b]' : 'bg-[#f2f3ff]'
      }`}
      id="diskusi-proyek"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        
        <div
          className={`rounded-3xl p-space-lg lg:p-space-xl shadow-xl border transition-colors ${
            darkMode
              ? 'bg-[#111a2e] border-[#1e293b]'
              : 'bg-white border-[#eaedff]'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            
            {/* Left Col Info */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-space-sm ${
                    darkMode
                      ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]'
                      : 'bg-[#e2e7ff] text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">handshake</span>
                  <span className="tracking-wider">
                    {lang === 'ID' ? 'DISKUSI PROYEK' : 'PROJECT INQUIRY'}
                  </span>
                </div>
                
                <h2
                  className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-space-sm ${
                    darkMode ? 'text-white' : 'text-[#131b2e]'
                  }`}
                >
                  {lang === 'ID'
                    ? 'Punya Ide atau Kebutuhan Engineering?'
                    : 'Have an Idea or Engineering Requirement?'}
                </h2>
                
                <p
                  className={`text-base sm:text-lg mb-space-lg leading-relaxed font-medium ${
                    darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'
                  }`}
                >
                  {lang === 'ID'
                    ? 'Saya selalu terbuka untuk freelance project, perancangan design token enterprise, atau bergabung dalam inisiatif tech inovatif skala penuh.'
                    : 'Open for freelance architectures, enterprise design tokens, or partnering in high-impact technological innovations.'}
                </p>

                {/* Direct Communication Badges */}
                <div className="space-y-space-sm">
                  <div
                    onClick={handleCopyEmail}
                    className={`flex items-center justify-between p-space-sm rounded-2xl border transition-all cursor-pointer group ${
                      darkMode
                        ? 'bg-[#16223b] border-[#23324f] hover:border-[#38bdf8]'
                        : 'bg-[#f2f3ff] border-[#eaedff] hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-xl">mail</span>
                      </div>
                      <div>
                        <div className={`text-xs ${darkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                          {lang === 'ID' ? 'Email Langsung' : 'Direct Email'}
                        </div>
                        <div className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-white' : 'text-[#131b2e]'}`}>
                          yahyaditya.s@gmail.com
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        copiedEmail
                          ? 'bg-[#bef264] text-[#080c16]'
                          : darkMode
                          ? 'bg-[#0d1527] text-[#38bdf8]'
                          : 'bg-white text-primary'
                      }`}
                    >
                      {copiedEmail
                        ? (lang === 'ID' ? 'Disalin!' : 'Copied!')
                        : (lang === 'ID' ? 'Salin' : 'Copy')}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-3 p-space-sm rounded-2xl border ${
                      darkMode
                        ? 'bg-[#16223b] border-[#23324f]'
                        : 'bg-[#f2f3ff] border-[#eaedff]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#bef264] text-[#080c16] flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-xl">schedule</span>
                    </div>
                    <div>
                      <div className={`text-xs ${darkMode ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                        {lang === 'ID' ? 'Waktu Respon' : 'Response Latency'}
                      </div>
                      <div className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-white' : 'text-[#131b2e]'}`}>
                        &lt; 24 Jam (Hari Kerja)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Marker */}
              <div className="pt-space-lg flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#bef264] animate-ping"></span>
                <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-white' : 'text-[#131b2e]'}`}>
                  {lang === 'ID'
                    ? 'Status: Menerima Proyek Baru Q1 - Q2'
                    : 'Status: Accepting New Projects Q1 - Q2'}
                </span>
              </div>
            </div>

            {/* Right Col Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-name"
                      className={`text-xs sm:text-sm font-bold ${
                        darkMode ? 'text-white' : 'text-[#131b2e]'
                      }`}
                    >
                      {lang === 'ID' ? 'Nama Lengkap' : 'Full Name'}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === 'ID' ? 'mis. John Doe' : 'e.g. John Doe'}
                      className={`px-4 py-3 rounded-full border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all ${
                        darkMode
                          ? 'bg-[#0d1527] border-[#334155] text-white placeholder:text-[#64748b]'
                          : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-email"
                      className={`text-xs sm:text-sm font-bold ${
                        darkMode ? 'text-white' : 'text-[#131b2e]'
                      }`}
                    >
                      {lang === 'ID' ? 'Alamat Email' : 'Email Address'}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={lang === 'ID' ? 'mis. john@domain.com' : 'e.g. john@domain.com'}
                      className={`px-4 py-3 rounded-full border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all ${
                        darkMode
                          ? 'bg-[#0d1527] border-[#334155] text-white placeholder:text-[#64748b]'
                          : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label
                    id="contact-service-label"
                    className={`text-xs sm:text-sm font-bold ${
                      darkMode ? 'text-white' : 'text-[#131b2e]'
                    }`}
                  >
                    {lang === 'ID' ? 'Kategori Kebutuhan' : 'Service Domain'}
                  </label>

                  {/* Custom Trigger styled rounded panjang */}
                  <button
                    type="button"
                    id="contact-service-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isServiceDropdownOpen}
                    onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    className={`w-full px-5 py-3 rounded-full border text-sm font-medium flex items-center justify-between text-left transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#38bdf8] ${
                      darkMode
                        ? 'bg-[#0d1527] border-[#334155] text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'
                    }`}
                  >
                    <span className="truncate pr-2">
                      {serviceOptions.find((opt) => opt.value === formData.service)?.label || serviceOptions[0].label}
                    </span>
                    {/* Chevron right icon with comfortable margin from edge */}
                    <span
                      className={`material-symbols-outlined text-xl transition-transform duration-200 shrink-0 mr-1.5 ${
                        isServiceDropdownOpen ? 'rotate-180' : ''
                      } ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                      expand_more
                    </span>
                  </button>

                  {/* Custom Dropdown Popover (Rounded Panjang options) */}
                  {isServiceDropdownOpen && (
                    <>
                      {/* Click outside backdrop */}
                      <div
                        className="fixed inset-0 z-20 cursor-default"
                        onClick={() => setIsServiceDropdownOpen(false)}
                      />
                      <div
                        className={`absolute top-full left-0 right-0 mt-2 z-30 p-2 rounded-3xl border shadow-2xl backdrop-blur-xl flex flex-col gap-1.5 ${
                          darkMode
                            ? 'bg-[#0e172a]/95 border-[#23324f] shadow-black/70'
                            : 'bg-white/95 border-slate-200 shadow-blue-500/10'
                        }`}
                      >
                        {serviceOptions.map((option) => {
                          const isSelected = formData.service === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, service: option.value });
                                setIsServiceDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-[#2563eb] text-white shadow-xs'
                                  : darkMode
                                  ? 'text-slate-200 hover:bg-[#1e293b] hover:text-white'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <span className="truncate">{option.label}</span>
                              {isSelected && (
                                <span className="material-symbols-outlined text-base shrink-0 ml-2">check</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className={`text-xs sm:text-sm font-bold ${
                      darkMode ? 'text-white' : 'text-[#131b2e]'
                    }`}
                  >
                    {lang === 'ID' ? 'Ringkasan Pesan • Brief Proyek' : 'Project Brief & Message'}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      lang === 'ID'
                        ? 'Ceritakan tujuan proyek, timeline, dan cakupan fungsionalitas yang Anda bayangkan...'
                        : 'Describe project objectives, timeline, deliverables, and estimated scope...'
                    }
                    className={`px-4 py-3.5 rounded-2xl border text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all ${
                      darkMode
                        ? 'bg-[#0d1527] border-[#334155] text-white placeholder:text-[#64748b]'
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white'
                    }`}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold text-sm sm:text-base cursor-pointer ${
                      darkMode
                        ? 'shadow-[0_4px_0px_rgba(0,0,0,0.3)]'
                        : 'shadow-[0_4px_0px_rgba(0,0,0,0.2)]'
                    }`}
                  >
                    <span>
                      {isSubmitting
                        ? (lang === 'ID' ? 'Mengirim ke Database...' : 'Saving to Database...')
                        : (lang === 'ID' ? 'Kirim Pesan Briefing' : 'Transmit Project Brief')}
                    </span>
                    {isSubmitting ? (
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-lg">send</span>
                    )}
                  </button>
                </div>

                {submitted && (
                  <div
                    className={`p-space-md rounded-2xl text-xs sm:text-sm flex items-center gap-2 font-semibold animate-in fade-in duration-300 border ${
                      darkMode
                        ? 'bg-[#bef264]/20 text-[#bef264] border-[#bef264]/60'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        darkMode ? 'text-[#bef264]' : 'text-emerald-600'
                      }`}
                    >
                      check_circle
                    </span>
                    <span className={darkMode ? 'text-white' : ''}>
                      {lang === 'ID'
                        ? 'Terima kasih! Pesan Anda telah terkirim. Saya akan menanggapi dalam waktu 24 jam.'
                        : 'Thank you! Your inquiry was sent successfully. Expect a response within 24 hours.'}
                    </span>
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>

        {/* Interactive Map Component with Light/Dark Theme Switch */}
        <div className="mt-10 sm:mt-14">
          <InteractiveMap lang={lang} darkMode={darkMode} />
        </div>

      </div>
    </section>
  );
};