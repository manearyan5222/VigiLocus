'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, ArrowRight, Play, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('guard');
  const [password, setPassword] = useState('guard123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('vigilocus_token', data.access_token);
        localStorage.setItem('vigilocus_user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.detail || 'Invalid username or password');
      }
    } catch {
      // Local fallback for standalone demo mode
      if ((username === 'guard' && password === 'guard123') || (username === 'admin' && password === 'admin123')) {
        localStorage.setItem('vigilocus_user', JSON.stringify({ username, role: username.toUpperCase() }));
        router.push('/dashboard');
      } else {
        setError('Backend server unreachable. Using fallback demo credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickFillCredentials = (role: 'guard' | 'admin') => {
    if (role === 'guard') {
      setUsername('guard');
      setPassword('guard123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white relative overflow-hidden font-mono">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-coram-grid opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#0d121c]/90 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10 backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex p-3 bg-blue-600/15 border border-blue-500/30 rounded-2xl text-blue-400 mb-1 hover:border-blue-400/60 transition-colors">
            <Shield className="w-6 h-6 animate-pulse" />
          </Link>
          <h1 className="text-2xl font-black text-white tracking-wider uppercase">
            Vigi<span className="text-blue-500">Locus</span>
          </h1>
          <p className="text-xs text-slate-400">
            Coram-Grade Security Operations Portal
          </p>
        </div>

        {/* Interactive Demo Action Pill */}
        <Link
          href="/demo"
          className="p-3 bg-blue-600/10 border border-blue-500/30 hover:border-blue-400/60 rounded-2xl flex items-center justify-between text-xs text-blue-300 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Play className="w-4 h-4 fill-blue-400 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Launch Interactive Live Demo</span>
          </div>
          <span className="text-[10px] text-blue-400 font-bold">Try Now →</span>
        </Link>

        {/* Demo Credentials Picker */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold">1-CLICK DEMO CREDENTIALS:</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => quickFillCredentials('guard')}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 text-left font-mono transition-colors"
            >
              <div className="text-[10px] text-slate-400">Guard Role:</div>
              <div className="font-bold text-blue-400">guard / guard123</div>
            </button>

            <button
              type="button"
              onClick={() => quickFillCredentials('admin')}
              className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-200 text-left font-mono transition-colors"
            >
              <div className="text-[10px] text-slate-400">Admin Role:</div>
              <div className="font-bold text-amber-400">admin / admin123</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">OPERATOR USERNAME</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">SECURITY PASSCODE</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 text-xs"
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'ACCESS SOC CONSOLE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <span>Need a new organization account?</span>
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-bold">
            Sign Up →
          </Link>
        </div>

      </div>
    </div>
  );
}
