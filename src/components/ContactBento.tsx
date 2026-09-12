import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Calendar, 
  MessageSquare, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export const ContactBento: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState('Full-Stack Web App');
  const [budget, setBudget] = useState('$15k - $30k');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const services = [
    'Full-Stack Web App',
    'Design System & Tokens',
    'Mobile App (React Native)',
    'Creative 3D / WebGL',
    'Performance Audit',
  ];

  const budgetTiers = [
    '< $5,000',
    '$5,000 — $15,000',
    '$15,000 — $30,000',
    '$30,000+',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate smooth network dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#CCFF00] border border-slate-900 rounded-full px-3.5 py-1 text-xs font-black tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>Initiate Collaboration</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
          Let's Build Something Exceptional
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Have an ambitious project, design system overhaul, or architectural challenge? Drop a note and let's turn vision into high-performance software.
        </p>
      </div>

      {/* Bento Layout: Channels + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Contact Channels & Availability (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Direct Email Card */}
          <div className="bg-[#1D4ED8] text-white rounded-3xl p-6 border-2 border-slate-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#CCFF00] mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-blue-200 font-semibold uppercase">
                Direct Inquiry
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                hello@portobento.dev
              </h3>
              <p className="text-xs text-blue-100 mt-1 font-medium">
                For formal RFPs, contract proposals, or advisory requests.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#CCFF00]" /> &lt; 12h turnaround
              </span>
              <span className="text-[#CCFF00] font-bold">Encrypted PGP</span>
            </div>
          </div>

          {/* Quick Schedule Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] border border-slate-200 flex items-center justify-center text-[#1D4ED8] mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
                Video Call Sync
              </span>
              <h3 className="text-xl font-extrabold text-slate-950 mt-1">
                Book a 20-min Intro
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Discuss technical feasibility, stack architecture, or sprint capacity directly.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noreferrer"
                className="tactile-btn w-full bg-[#CCFF00] hover:bg-[#bbf000] text-slate-950 border border-slate-950 rounded-2xl py-2.5 px-4 text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Available Slots</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#FAF8FF] rounded-2xl p-4 border border-slate-200 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-xs text-slate-700 font-medium leading-snug">
              Standard mutual NDA signed prior to code audits or repository review.
            </p>
          </div>

        </div>

        {/* Right Side: Interactive Form Container (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-slate-900 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-3xl bg-[#CCFF00] border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow-[4px_4px_0px_#0f172a]">
                  <CheckCircle2 className="w-8 h-8 text-slate-950" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Message Dispatched!
                </h3>
                <p className="text-slate-600 text-sm max-w-md">
                  Thank you, <strong>{name}</strong>! Your inquiry regarding <strong>{selectedService}</strong> has been logged. I will follow up via <strong>{email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="tactile-ghost mt-4 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {errorMsg && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                {/* Service Selection Pills */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
                    1. What can I engineer for you?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((srv) => (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => setSelectedService(srv)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          selectedService === srv
                            ? 'bg-slate-950 text-[#CCFF00] border-slate-950 shadow-[2px_2px_0px_#0f172a]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-800'
                        }`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Selection Pills */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
                    2. Estimated Project Budget
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgetTiers.map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setBudget(tier)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          budget === tier
                            ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-[2px_2px_0px_#0f172a]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-800'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Fields: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="contact-name-input"
                      className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name-input"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl bg-[#FAF8FF] border-2 border-slate-300 focus:border-slate-950 px-4 py-3 text-sm text-slate-950 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="contact-email-input"
                      className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email-input"
                      type="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl bg-[#FAF8FF] border-2 border-slate-300 focus:border-slate-950 px-4 py-3 text-sm text-slate-950 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label 
                    htmlFor="contact-message-input"
                    className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5"
                  >
                    Project Overview / Goals *
                  </label>
                  <textarea
                    id="contact-message-input"
                    required
                    rows={4}
                    placeholder="Tell me about your product, timeline, key challenges, or existing stack..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-2xl bg-[#FAF8FF] border-2 border-slate-300 focus:border-slate-950 p-4 text-sm text-slate-950 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Strict privacy guaranteed. No unsolicited newsletters.
                  </span>

                  <button
                    id="submit-inquiry-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="tactile-btn bg-[#CCFF00] hover:bg-[#bbf000] text-slate-950 border-2 border-slate-950 rounded-full px-8 py-3 text-sm font-black flex items-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
