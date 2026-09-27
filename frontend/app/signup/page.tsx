'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, Mail, Building, ArrowRight, Play, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [role, setRole] = useState('GUARD');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      localStorage.setItem('sentinel_user', JSON.stringify({ username: fullName || email.split('@')[0], role, orgName }));
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white relative overflow-hidden font-mono">
      
      {/* Background Decorative Grid & Glow */}
      <div className="absolute inset-0 bg-coram-grid opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#0d121c]/90 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10 backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex p-3 bg-blue-600/15 border border-blue-500/30 rounded-2xl text-blue-400 mb-1 hover:border-blue-400/60 transition-colors">
            <Shield className="w-6 h-6 animate-pulse" />
          </Link>
          <h1 className="text-2xl font-black text-white tracking-wider uppercase">
            Sentinel<span className="text-blue-500">AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            Deploy Coram-Grade AI Vision Security
          </p>
        </div>

        {/* 1-Click Interactive Demo Pill */}
        <Link
          href="/demo"
          className="p-3 bg-blue-600/10 border border-blue-500/30 hover:border-blue-400/60 rounded-2xl flex items-center justify-between text-xs text-blue-300 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Play className="w-4 h-4 fill-blue-400 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Test Live Interactive Demo</span>
          </div>
          <span className="text-[10px] text-blue-400 font-bold">No Signup Required →</span>
        </Link>

        {isSuccess ? (
          <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-sm font-bold text-white">ACCOUNT CREATED SUCCESSFULLY</div>
            <div className="text-xs text-slate-300">Redirecting to your SOC Operator Dashboard...</div>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">FULL NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">WORK EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alex@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">ORGANIZATION</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Acme Security"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ROLE</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                >
                  <option value="GUARD">Security Officer</option>
                  <option value="ADMIN">SOC Director</option>
                  <option value="MANAGER">Facility Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">SECURITY PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
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
              <span>{isLoading ? 'CREATING ACCOUNT...' : 'CREATE FREE ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <span>Already registered?</span>
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold">
            Sign In →
          </Link>
        </div>

      </div>
    </div>
  );
}
