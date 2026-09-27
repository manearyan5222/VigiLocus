'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Menu, X, Play, LogIn, UserPlus } from 'lucide-react';

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#see-threats' },
    { label: 'Multi-Camera Grid', href: '#human-review' },
    { label: 'Live Demo', href: '/demo' },
    { label: 'SOC Console', href: '/dashboard' },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <div className="w-full max-w-5xl bg-[#0a0e1a]/85 backdrop-blur-2xl border border-white/10 rounded-full px-5 py-2.5 shadow-2xl shadow-black/60 flex items-center justify-between pointer-events-auto transition-all">
        
        {/* Brand Logo & Vestris-style Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-extrabold text-base tracking-wide text-white font-mono">
              Vigi<span className="text-blue-500">Locus</span>
            </span>
          </Link>

          {/* Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AUTONOMOUS AGENTS ACTIVE</span>
          </div>
        </div>

        {/* Minimal Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wide text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-blue-400 transition-colors py-1 relative text-slate-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons: Demo, Login, Sign Up */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/demo"
            className="group px-3.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 border border-blue-500/30 transition-all active:scale-[0.98]"
          >
            <Play className="w-3 h-3 fill-blue-400 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Live Demo</span>
          </Link>

          <Link
            href="/login"
            className="px-3 py-1.5 text-slate-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/signup"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 active:scale-[0.98]"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-100" />
            <span>Sign Up</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-[#0a0e1a]/98 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl font-mono pointer-events-auto">
          <div className="flex flex-col space-y-3 text-xs font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1.5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-blue-600/20 text-blue-300 border border-blue-500/40 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-blue-400 text-blue-400" />
              <span>Launch Interactive Demo</span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-slate-400" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

