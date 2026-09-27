'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, AlertTriangle, Search, Play, Maximize2, Sparkles, ArrowLeft, ChevronRight, Bell 
} from 'lucide-react';

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'LIVE' | 'ALERT' | 'STANDBY';
  fps: number;
  aiDetections: number;
  videoUrl: string;
  boxes: Array<{ label: string; conf: number; top: string; left: string; width: string; height: string; color: string }>;
}

export default function DemoPage() {
  const [activeLayout, setActiveLayout] = useState<'2x2' | '1x1'>('2x2');
  const [selectedCam, setSelectedCam] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertCount, setAlertCount] = useState(3);
  const [simulatedAlerts, setSimulatedAlerts] = useState([
    { id: 'ALT-904', camera: 'CAM-01 Main Gate', threat: 'Unidentified Vehicle Loitering > 5m', severity: 'HIGH', time: '10:44:12 AM' },
    { id: 'ALT-903', camera: 'CAM-04 Server Room', threat: 'After-Hours Access Anomaly', severity: 'CRITICAL', time: '10:41:05 AM' },
    { id: 'ALT-902', camera: 'CAM-03 Perimeter Fence', threat: 'Fence Perimeter Proximity Motion', severity: 'MEDIUM', time: '10:35:50 AM' },
  ]);

  const [cameras] = useState<CameraFeed[]>([
    {
      id: 'CAM-01',
      name: 'Main Gate Entrance',
      location: 'Building A - North Gate',
      status: 'ALERT',
      fps: 30,
      aiDetections: 4,
      videoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'Person 98%', conf: 0.98, top: '25%', left: '30%', width: '18%', height: '45%', color: 'border-rose-500 text-rose-400 bg-rose-500/10' },
        { label: 'Vehicle 94%', conf: 0.94, top: '50%', left: '55%', width: '35%', height: '38%', color: 'border-amber-500 text-amber-400 bg-amber-500/10' }
      ]
    },
    {
      id: 'CAM-02',
      name: 'South Loading Dock',
      location: 'Logistics Hub',
      status: 'LIVE',
      fps: 30,
      aiDetections: 2,
      videoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'Forklift 96%', conf: 0.96, top: '40%', left: '20%', width: '28%', height: '35%', color: 'border-blue-500 text-blue-400 bg-blue-500/10' }
      ]
    },
    {
      id: 'CAM-03',
      name: 'Perimeter Fence Line',
      location: 'East Boundary',
      status: 'LIVE',
      fps: 29,
      aiDetections: 1,
      videoUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'Motion 89%', conf: 0.89, top: '35%', left: '60%', width: '15%', height: '30%', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' }
      ]
    },
    {
      id: 'CAM-04',
      name: 'Server Room Vault',
      location: 'HQ Floor 3',
      status: 'ALERT',
      fps: 30,
      aiDetections: 3,
      videoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'Person 99%', conf: 0.99, top: '20%', left: '42%', width: '22%', height: '60%', color: 'border-rose-500 text-rose-400 bg-rose-500/10' },
        { label: 'Badge Override', conf: 0.91, top: '15%', left: '45%', width: '16%', height: '18%', color: 'border-amber-400 text-amber-300 bg-amber-400/10' }
      ]
    }
  ]);

  const triggerSimulatedThreat = () => {
    const newId = `ALT-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert = {
      id: newId,
      camera: 'CAM-01 Main Gate',
      threat: 'AI Flagged: Unauthorized Tailgating Detected',
      severity: 'CRITICAL',
      time: new Date().toLocaleTimeString()
    };
    setSimulatedAlerts([newAlert, ...simulatedAlerts]);
    setAlertCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Bar - Coram AI Command Aesthetic */}
      <header className="h-14 border-b border-white/10 bg-[#0b101d]/90 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-wide text-white font-mono">
              Sentinel<span className="text-blue-500">AI</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono uppercase">
              Interactive Demo
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>4 CAMERAS ONLINE</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">120 FPS TOTAL</span>
          </div>
        </div>

        {/* AI Search Input Bar */}
        <div className="hidden lg:flex items-center relative w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="AI Search: 'Show people in red jacket' or 'Server room motion'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 font-mono"
          />
          <Sparkles className="w-3.5 h-3.5 text-blue-400 absolute right-3" />
        </div>

        {/* Controls & Account Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerSimulatedThreat}
            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate AI Alert</span>
          </button>

          <Link
            href="/signup"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Camera Selector Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#090d16] hidden md:flex flex-col">
          <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">CAMERA NETWORK</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">4 Active</span>
          </div>

          <div className="p-2 space-y-1 overflow-y-auto flex-1 font-mono">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCam(selectedCam === cam.id ? null : cam.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  selectedCam === cam.id
                    ? 'bg-blue-600/15 border-blue-500/50 text-white'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{cam.id}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    cam.status === 'ALERT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {cam.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-200 truncate">{cam.name}</div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1">
                  <span>{cam.location}</span>
                  <span>{cam.fps} FPS</span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Info Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 font-mono text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>AI DETECTIONS</span>
              <span className="text-blue-400">10 Objects</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Coram AI Vision Engine tracking person, vehicle, and perimeter motion in real-time.
            </div>
          </div>
        </aside>

        {/* Center Grid Area */}
        <main className="flex-1 bg-[#070a12] p-4 flex flex-col gap-4 overflow-y-auto">
          
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-2xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">LAYOUT:</span>
              <button
                onClick={() => setActiveLayout('2x2')}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  activeLayout === '2x2' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                2x2 Grid
              </button>
              <button
                onClick={() => setActiveLayout('1x1')}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  activeLayout === '1x1' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Focus 1x1
              </button>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>AI Bounding Boxes: ENABLED</span>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className={`grid gap-4 flex-1 ${
            activeLayout === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          }`}>
            {cameras
              .filter((c) => !selectedCam || c.id === selectedCam)
              .map((cam) => (
                <div
                  key={cam.id}
                  className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden group hover:border-blue-500/50 transition-all flex flex-col min-h-[260px]"
                >
                  {/* Video Header Bar */}
                  <div className="absolute top-0 left-0 right-0 z-20 p-2.5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/60 text-white font-bold border border-white/10">
                        {cam.id}
                      </span>
                      <span className="text-slate-200 font-semibold">{cam.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-600/80 text-white font-bold text-[10px]">
                        {cam.fps} FPS
                      </span>
                      <button className="p-1 rounded bg-black/60 text-slate-300 hover:text-white">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Simulated Stream Box */}
                  <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
                    <img
                      src={cam.videoUrl}
                      alt={cam.name}
                      className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* AI Object Bounding Boxes Overlay */}
                    {cam.boxes.map((box, i) => (
                      <div
                        key={i}
                        className={`absolute border-2 rounded-md ${box.color} animate-pulse pointer-events-none transition-all`}
                        style={{
                          top: box.top,
                          left: box.left,
                          width: box.width,
                          height: box.height
                        }}
                      >
                        <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] font-bold border border-white/10 whitespace-nowrap">
                          {box.label}
                        </span>
                      </div>
                    ))}

                    {/* Live Indicator */}
                    <div className="absolute bottom-2 left-2 z-20 px-2 py-1 rounded-lg bg-black/70 border border-white/10 font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>LIVE FEED</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>

        {/* Right Alert Triage Panel */}
        <aside className="w-80 border-l border-white/10 bg-[#090d16] hidden lg:flex flex-col font-mono">
          <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-slate-300">REAL-TIME ALERT STREAM</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
              {alertCount} Alerts
            </span>
          </div>

          <div className="p-3 space-y-3 overflow-y-auto flex-1">
            {simulatedAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold">{alt.id}</span>
                  <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                    {alt.severity}
                  </span>
                </div>
                <div className="text-xs text-white font-semibold">{alt.threat}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>{alt.camera}</span>
                  <span>{alt.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
            <div className="text-xs font-bold text-white">Ready for full deployment?</div>
            <div className="text-[11px] text-slate-400">Connect your existing RTSP / IP camera streams in minutes.</div>
            <Link
              href="/signup"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <span>Get Started Free</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
