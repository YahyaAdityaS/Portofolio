import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';

export const TestimonialsBento: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#CCFF00] border border-slate-900 rounded-full px-3.5 py-1 text-xs font-black tracking-wider uppercase mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
            <span>Client Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Trusted by Engineering Leaders
          </h2>
        </div>

        {/* Carousel Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 cursor-pointer shadow-xs transition-transform active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-[#CCFF00] hover:bg-[#bbf000] border-2 border-slate-900 flex items-center justify-center text-slate-950 cursor-pointer shadow-xs transition-transform active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bento Testimonial Box */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
        <Quote className="absolute top-6 right-6 w-20 h-20 text-slate-100 pointer-events-none -z-0" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            {/* Quote Body (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-950 leading-relaxed tracking-tight">
                "{current.content}"
              </p>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Project: <strong className="text-slate-900">{current.projectWorkedOn}</strong>
                </span>
              </div>
            </div>

            {/* Client Profile (4 cols) */}
            <div className="md:col-span-4 bg-[#FAF8FF] border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-900 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base font-extrabold text-slate-950">
                    {current.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {current.role}
                  </p>
                  <p className="text-xs font-bold text-[#1D4ED8]">
                    {current.company}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Collaboration
                </span>
                <span className="text-slate-400">0{currentIndex + 1} / 0{TESTIMONIALS_DATA.length}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
