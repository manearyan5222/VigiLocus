'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Play, CheckCircle2 } from 'lucide-react';

export function LandingCTASection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-24 md:py-36 bg-[#080c14] border-t border-white/10 relative overflow-hidden text-slate-100">
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="vestris-card p-10 sm:p-16 border border-white/10 bg-gradient-to-b from-[#131d16]/90 via-[#0d141e]/95 to-[#080c14] rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-6 text-left relative z-10">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>READY FOR REAL ESTATE & ENTERPRISE SURVEILLANCE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to deploy autonomous AI agents <br />
              <span className="font-serif-italic text-emerald-300 text-4xl sm:text-6xl font-normal">
                across your camera network?
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Connect your existing RTSP / IP feeds in minutes. Experience 85% faster triage and zero false alarm fatigue.
            </p>

            {/* Email Demo Request Form */}
            {submitted ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-300 font-mono text-xs flex items-center gap-2 max-w-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Demo request received! Our SOC team will reach out shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg font-mono text-xs pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter work email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl whitespace-nowrap transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  Request Demo
                </button>
              </form>
            )}

            <div className="pt-4 flex items-center gap-4 text-xs font-mono text-slate-400">
              <Link href="/demo" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-blue-400" />
                <span>Try Interactive Demo Instantly →</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

