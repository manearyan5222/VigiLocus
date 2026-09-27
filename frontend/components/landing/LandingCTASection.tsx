'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';

export function LandingCTASection() {
  return (
    <section className="py-28 md:py-40 bg-[#07090e] border-t border-white/[0.06] relative overflow-hidden">
      
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[350px] bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-red-500/30 text-slate-300 font-mono text-xs shadow-sm">
          <Shield className="w-3.5 h-3.5 text-red-400" />
          <span className="text-red-400 font-bold">READY TO PROTECT YOUR PROPERTY</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Stop property theft <span className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 bg-clip-text text-transparent">before it happens.</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto">
          Turn passive CCTV camera feeds into active 24/7 theft prevention with real-time threat detection, 5-second operator alert triage, and evidence recording.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Launch CCTV Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/cameras"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 rounded-2xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-colors"
          >
            <span>Manage Connected Cameras</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
