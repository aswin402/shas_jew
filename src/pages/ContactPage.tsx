import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Send, Sparkles, MapPin, Mail, Phone, Clock, CalendarCheck } from 'lucide-react';

export function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSubmitted(true);
  };

  return (
    <main className="relative min-h-[calc(100vh-5rem)] bg-shas-bg text-shas-heading py-16 px-6 md:px-12 overflow-hidden transition-colors duration-300">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-shas-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-shas-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Back Link */}
        <div className="text-left">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-shas-secondary hover:text-shas-brand transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <section className="text-left space-y-3 max-w-xl">
          <span className="text-[10px] uppercase tracking-[0.25em] text-shas-brand font-semibold font-sans">
            Atelier Booking & Support
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide leading-tight">
            Connect with SHAS.
          </h1>
          <p className="text-xs md:text-sm text-shas-secondary font-sans leading-relaxed">
            Inquire about our ready-to-wear collections, order tracking, or schedule a custom design consultation with Deepa Sakthi.
          </p>
        </section>

        {/* Contact Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-5 text-left space-y-8 font-sans">
            
            {/* Boutique Details card */}
            <div className="border border-shas-border bg-shas-bg p-6 md:p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg font-medium text-shas-heading border-b border-shas-border pb-3 uppercase tracking-wider text-[11px] font-semibold text-shas-secondary">
                The Showroom
              </h3>
              
              <ul className="space-y-6 text-xs text-shas-secondary">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4.5 h-4.5 text-shas-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-shas-heading mb-0.5">Physical Atelier</h4>
                    <a 
                      href="https://maps.app.goo.gl/TPyzzbEHRfyPZrUX6" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline hover:text-shas-brand transition-colors"
                    >
                      SHAS Jewellers, Periyar Nagar,<br />Erode, Tamil Nadu 638001
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <Clock className="w-4.5 h-4.5 text-shas-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-shas-heading mb-0.5">Showroom Hours</h4>
                    <p>Monday — Saturday: 10:30 AM to 8:30 PM</p>
                    <p className="italic mt-0.5">Sundays: Closed</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="w-4.5 h-4.5 text-shas-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-shas-heading mb-0.5">Digital Inquiries</h4>
                    <p>For orders: support@shasjewellers.com</p>
                    <p>Custom fittings: atelier@shasjewellers.com</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="w-4.5 h-4.5 text-shas-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-shas-heading mb-0.5">Phone Call</h4>
                    <p>+91 98765 43210</p>
                    <p className="text-[10px] italic">WhatsApp support available during operating hours.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Custom consult note */}
            <div className="border border-shas-border bg-shas-border/10 p-6 flex gap-4 items-start">
              <CalendarCheck className="w-6 h-6 text-shas-brand flex-shrink-0" />
              <div className="text-xs leading-relaxed space-y-1">
                <h4 className="font-serif text-sm font-semibold text-shas-heading">Bridal & Custom Fittings</h4>
                <p className="text-shas-secondary">
                  We offer custom ring sizing, custom bridal stone curation, and bespoke metal castings. Select "Custom Consultation" in the inquiry form to book an appointment with our lead designer.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="border border-shas-border bg-shas-bg p-6 md:p-10 shadow-sm text-left">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 font-sans"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Elizabeth Bennet"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all placeholder:text-shas-secondary/40 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="elizabeth@darcy.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all placeholder:text-shas-secondary/40 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Subject</label>
                      <select
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full h-11 px-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all text-xs cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order Support">Order & Shipping Support</option>
                        <option value="Custom Consultation">Custom Design Consultation</option>
                        <option value="Press Inquiries">Media & Press</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-shas-secondary">Your Narrative Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Detail your request, design thoughts, or custom sizing requirements..."
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="w-full p-4 border border-shas-border bg-shas-bg focus:border-shas-brand focus:outline-none transition-all placeholder:text-shas-secondary/40 text-xs resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-shas-burgundy text-shas-bg border border-shas-burgundy hover:bg-shas-cream hover:text-shas-charcoal hover:border-shas-burgundy transition-all text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer dark:bg-shas-brand dark:border-shas-brand dark:text-shas-bg dark:hover:bg-shas-bg dark:hover:border-shas-brand dark:hover:text-shas-cream"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Narrative Inquiry</span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-10 space-y-6 font-sans"
                  >
                    <div className="inline-flex p-4 bg-shas-brand/10 border border-shas-brand/20 rounded-full text-shas-brand">
                      <Sparkles className="w-8 h-8 text-shas-accent animate-pulse" />
                    </div>
                    
                    <div className="space-y-2 max-w-sm mx-auto">
                      <h3 className="font-serif text-2xl font-bold text-shas-heading">
                        Inquiry Received
                      </h3>
                      <p className="text-xs text-shas-secondary leading-relaxed">
                        Thank you, <strong className="text-shas-heading">{formState.name}</strong>. Your inquiry regarding <strong className="text-shas-heading">{formState.subject}</strong> has been logged at our Erode studio.
                      </p>
                      <p className="text-[11px] text-shas-secondary/80 leading-relaxed pt-2">
                        We will reach out to <span className="font-semibold text-shas-brand">{formState.email}</span> within 24 business hours.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormState({ name: '', email: '', subject: 'General Inquiry', message: '' });
                      }}
                      className="px-6 py-2.5 border border-shas-border text-shas-heading hover:border-shas-brand hover:text-shas-brand transition-colors text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
