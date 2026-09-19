import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TestimonialItem } from '../types';

function generateReviewId(author: string, quote: string, timestamp?: string, fallbackIdx?: number): string {
  const cleanAuthor = (author || 'user').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
  const cleanQuote = (quote || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
  const cleanTime = (timestamp || '').replace(/[^a-z0-9]/g, '').slice(-8);
  const suffix = cleanTime || (typeof fallbackIdx === 'number' ? `idx${fallbackIdx}` : '0');
  return `rev_${cleanAuthor}_${cleanQuote}_${suffix}`;
}

interface TestimonialsProps {
  lang: 'ID' | 'EN';
  darkMode: boolean;
  onOpenAdmin?: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang, darkMode, onOpenAdmin }) => {
  const DEFAULT_WEBHOOK_URL =
    'https://script.google.com/macros/s/AKfycbxBQkvKe85FvYo5AKEbUPoVR8-9o9vFgppKYgigwgXfdhhzHKtiHmlvZ9Q3U7FJiR81/exec';

  const [reviews, setReviews] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('yas_portfolio_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r: any) => {
            const cleanQuote = String(r.quote || r.message || '').replace(/[“”"'\s]/g, '').trim();
            const cleanAuthor = String(r.author || r.name || '').trim().toLowerCase();
            return cleanQuote.length > 0 && cleanAuthor !== 'anonim' && cleanAuthor !== '';
          });
        }
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formFeedback, setFormFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('yas_portfolio_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const fetchSheetReviews = async () => {
      try {
        const res = await fetch(DEFAULT_WEBHOOK_URL, { signal: controller.signal });
        const data = await res.json();
        if (isMounted && data && Array.isArray(data.ratings)) {
          const sheetReviews: TestimonialItem[] = data.ratings
            .filter((r: any) => {
              const cleanQuote = String(r.quote || r.message || '').replace(/[“”"'\s]/g, '').trim();
              const cleanAuthor = String(r.author || r.name || '').trim().toLowerCase();
              return cleanQuote.length > 0 && cleanAuthor !== 'anonim' && cleanAuthor !== '';
            })
            .map((r: any, idx: number) => {
              const author = (r.author || r.name || 'Pengunjung Web').trim();
              const rawQuote = (r.quote || r.message || '').trim();
              const cleanQuote = rawQuote.replace(/^[“”"]+|[“”"]+$/g, '').trim();
              const initials = author.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
              const id = r.id && String(r.id).trim() ? String(r.id).trim() : String(idx + 1);
              const isApproved = r.approved === true || String(r.approved).toLowerCase() === 'true';

              return {
                id,
                author,
                role: r.role || 'Pengunjung Web',
                stars: Number(r.stars || r.rating) || 5,
                quote: `“${cleanQuote}”`,
                avatar: initials || 'US',
                avatarBg: 'bg-[#2563eb]',
                avatarText: 'text-white',
                approved: isApproved,
                timestamp: r.timestamp || new Date().toLocaleDateString('id-ID'),
              };
            });

          setReviews(sheetReviews);
          localStorage.setItem('yas_portfolio_reviews', JSON.stringify(sheetReviews));
        }
      } catch {
        // Fallback
      } finally {
        clearTimeout(timeoutId);
      }
    };

    fetchSheetReviews();
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formFeedback.trim()) return;

    setIsSubmitting(true);
    const initials = formName.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    const newId = generateReviewId(formName.trim(), formFeedback.trim(), Date.now().toString());

    const newReview: TestimonialItem = {
      id: newId,
      author: formName.trim(),
      role: formRole.trim() || (lang === 'ID' ? 'Pengunjung Web / Rekan' : 'Web Visitor / Peer'),
      stars: formRating,
      quote: `“${formFeedback.trim()}”`,
      avatar: initials || 'US',
      avatarBg: 'bg-[#2563eb]',
      avatarText: 'text-white',
      approved: false,
      timestamp: new Date().toLocaleDateString('id-ID'),
    };

    try {
      await fetch(DEFAULT_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submit_rating',
          type: 'rating',
          id: newId,
          name: formName.trim(),
          author: formName.trim(),
          role: formRole.trim() || 'Pengunjung Web',
          rating: formRating,
          stars: formRating,
          message: formFeedback.trim(),
          approved: false,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Submission warning:', err);
    }

    setReviews((prev) => {
      const next = [newReview, ...prev];
      localStorage.setItem('yas_portfolio_reviews', JSON.stringify(next));
      return next;
    });
    window.dispatchEvent(new CustomEvent('yas_reviews_updated'));
    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => {
      setFormName('');
      setFormRole('');
      setFormFeedback('');
      setFormRating(5);
      setSubmitSuccess(false);
      setIsFormOpen(false);
    }, 2400);
  };

  const approvedReviews = reviews.filter((item) => item.approved);

  return (
    <section
      className={`w-full py-space-xl transition-colors duration-300 scroll-mt-28 ${
        darkMode ? 'bg-[#0b1120] border-y border-[#1e293b]' : 'bg-[#f2f3ff]'
      }`}
      id="testimoni"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-space-xs ${
              darkMode ? 'bg-[#16223b] border border-[#38bdf8]/40 text-[#38bdf8]' : 'bg-white text-primary shadow-xs'
            }`}>
              <span className="tracking-wider">
                {lang === 'ID' ? 'SUARA REKAN & KLIEN' : 'PEER & CLIENT FEEDBACK'}
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-[#131b2e]'}`}>
              {lang === 'ID' ? 'Testimoni & Rating Portofolio' : 'Testimonials & Portfolio Rating'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer ${
                darkMode ? 'bg-[#bef264] hover:bg-[#a3e635] text-[#080c16]' : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">rate_review</span>
              <span>{lang === 'ID' ? 'Beri Rating & Masukan' : 'Write a Review'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {approvedReviews.map((item, itemIdx) => (
            <motion.div
              key={`${item.id}-${itemIdx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl p-space-lg shadow-sm flex flex-col justify-between border transition-colors ${
                darkMode ? 'bg-[#111a2e] border-[#1e293b]' : 'bg-white border-[#eaedff]'
              }`}
            >
              <div>
                <div className="flex items-center gap-1 text-[#facc15] mb-space-sm">
                  {[...Array(item.stars)].map((_, starIdx) => (
                    <span key={starIdx} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-400 ml-1">({item.stars}.0)</span>
                </div>
                <p className={`text-sm sm:text-base italic mb-space-lg leading-relaxed ${darkMode ? 'text-white' : 'text-[#131b2e]'}`}>
                  {item.quote}
                </p>
              </div>

              <div className={`flex items-center justify-between pt-space-sm border-t ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${item.avatarBg} ${item.avatarText} font-extrabold flex items-center justify-center text-sm shadow-sm`}>
                    {item.avatar}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-[#131b2e]'}`}>{item.author}</div>
                    <div className={`text-xs ${darkMode ? 'text-[#cbd5e1]' : 'text-[#434655]'}`}>{item.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {typeof document !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              {isFormOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                    onClick={() => setIsFormOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className={`rounded-3xl max-w-lg w-full p-6 sm:p-8 border shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto ${
                      darkMode ? 'bg-[#111a2e] border-[#23324f] text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className={`absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        darkMode ? 'bg-[#16223b] hover:bg-[#23324f] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>

                    {submitSuccess ? (
                      <div className="text-center py-8 space-y-3">
                        <div className="w-16 h-16 rounded-full bg-[#bef264]/20 text-[#bef264] flex items-center justify-center mx-auto text-3xl">
                          <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                        <h3 className="text-xl font-bold">{lang === 'ID' ? 'Terima Kasih atas Rating & Masukannya!' : 'Thank You for Your Review!'}</h3>
                        <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-[#cbd5e1]' : 'text-slate-600'}`}>
                          {lang === 'ID'
                            ? 'Rating Anda telah tersimpan dan siap masuk ke Google Spreadsheet. Ulasan akan tampil setelah lolos verifikasi moderasi Yahya untuk mencegah spam.'
                            : 'Your review is securely logged into the spreadsheet and will appear publicly once verified by Yahya.'}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#bef264] text-[#080c16]">FEEDBACK & RATING</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black">{lang === 'ID' ? 'Beri Rating & Masukan Portofolio' : 'Submit Review & Rating'}</h3>
                        </div>

                        <div className={`p-3.5 rounded-2xl border text-center ${darkMode ? 'bg-[#0d1527] border-[#23324f]' : 'bg-[#f2f3ff] border-[#eaedff]'}`}>
                          <div className="text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                            {lang === 'ID' ? 'Pilih Jumlah Bintang:' : 'Select Star Rating:'}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isActive = (formHoverRating || formRating) >= star;
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onMouseEnter={() => setFormHoverRating(star)}
                                  onMouseLeave={() => setFormHoverRating(0)}
                                  onClick={() => setFormRating(star)}
                                  className="p-1 transition-transform hover:scale-125 cursor-pointer"
                                >
                                  <span className={`material-symbols-outlined text-3xl sm:text-4xl transition-colors ${isActive ? 'text-[#facc15]' : 'text-slate-300 dark:text-slate-600'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                                    star
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1.5">{lang === 'ID' ? 'Nama Lengkap Anda' : 'Full Name'} *</label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder={lang === 'ID' ? 'Contoh: Rian Pratama' : 'e.g. John Doe'}
                            className={`w-full px-5 py-3 rounded-xl border text-sm transition-colors ${
                              darkMode ? 'bg-[#16223b] border-[#334155] text-white focus:border-[#38bdf8]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#2563eb]'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1.5">{lang === 'ID' ? 'Peran / Instansi / Hubungan' : 'Role / Company'}</label>
                          <input
                            type="text"
                            value={formRole}
                            onChange={(e) => setFormRole(e.target.value)}
                            placeholder={lang === 'ID' ? 'Contoh: Tech Lead / Klien' : 'e.g. Product Manager'}
                            className={`w-full px-5 py-3 rounded-xl border text-sm transition-colors ${
                              darkMode ? 'bg-[#16223b] border-[#334155] text-white focus:border-[#38bdf8]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#2563eb]'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1.5">{lang === 'ID' ? 'Saran & Pengalaman Anda' : 'Feedback'} *</label>
                          <textarea
                            required
                            rows={3}
                            value={formFeedback}
                            onChange={(e) => setFormFeedback(e.target.value)}
                            placeholder={lang === 'ID' ? 'Tuliskan ulasan Anda...' : 'Describe your review...'}
                            className={`w-full px-6 py-3.5 rounded-2xl border text-sm leading-relaxed transition-colors resize-none ${
                              darkMode ? 'bg-[#16223b] border-[#334155] text-white focus:border-[#38bdf8]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#2563eb]'
                            }`}
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {lang === 'ID' ? 'Batal' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md ${
                              darkMode ? 'bg-[#bef264] hover:bg-[#a3e635] text-[#080c16]' : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                            }`}
                          >
                            {isSubmitting ? <span>{lang === 'ID' ? 'Mengirim Data...' : 'Submitting...'}</span> : <span>{lang === 'ID' ? 'Kirim Rating' : 'Submit Review'}</span>}
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>
    </section>
  );
};
