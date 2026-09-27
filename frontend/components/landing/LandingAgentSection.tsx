'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Cpu, Bell, CheckCircle2, ArrowRight, Zap, Terminal, Sparkles, Layers } from 'lucide-react';

export function LandingAgentSection() {
  const [activeAgent, setActiveAgent] = useState<number>(0);

  const agents = [
    {
      id: 'agent-01',
      name: 'VisionAgent',
      role: 'Continuous Multi-Stream Computer Vision',
      tagline: 'Monitors 16+ CCTV feeds simultaneously at 30 FPS.',
      icon: Eye,
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      input: 'RTSP Stream Feed (Main Gate, Server Vault)',
      output: 'Detected: [Person conf:0.98, Dwell: 34s, Zone: Restricted Perimeter]',
      features: [
        'YOLOv8 hardware-accelerated object detection',
        'Centroid tracking across multi-camera overlaps',
        'Zero false motion triggers from weather/trees'
      ]
    },
    {
      id: 'agent-02',
      name: 'TriageAgent',
      role: '5-Second Contextual Incident Reasoning',
      tagline: 'Translates raw bounding boxes into human threat explanations.',
      icon: Cpu,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      input: 'VisionAgent Event Bounding Box Payload',
      output: 'Risk 88/100 (HIGH): Subject loitering near restricted fence line after hours without valid resident pass.',
      features: [
        '0-100 contextual risk calculation',
        'Generative Gemini 1.5 threat summary',
        'Explainable decision timeline for security leads'
      ]
    },
    {
      id: 'agent-03',
      name: 'DispatchAgent',
      role: 'Autonomous Action & Guard Dispatch',
      tagline: 'Notifies guards and logs immutable audit trails instantly.',
      icon: Bell,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      input: 'Verified High-Risk Triage Payload',
      output: 'Action: Guard Dispatched to Zone 4. Incident #ALT-904 logged to database.',
      features: [
        'Instant SMS & Mobile Guard Alerts',
        '1-click audio deterrent trigger',
        'Automated daily SOC compliance logging'
      ]
    }
  ];

  const current = agents[activeAgent];
  const Icon = current.icon;

  return (
    <section className="py-24 md:py-32 bg-[#080c14] relative overflow-hidden text-slate-100">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-tr from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-16">
        
        {/* Section Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AUTONOMOUS AGENT WORKFLOW</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Agents that automate security <br />
            <span className="font-serif-italic text-blue-400 text-4xl sm:text-6xl font-normal">
              pre-triage to post-dispatch.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            SentinelAI replaces manual camera scrubbing with specialized autonomous AI agents working in unison.
          </p>
        </div>

        {/* Vestris Style Interactive Agent Selector Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => {
            const AgentIcon = agent.icon;
            const isSelected = activeAgent === index;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(index)}
                className={`vestris-card p-6 text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-blue-500/50 bg-slate-900/90 shadow-2xl shadow-blue-500/10'
                    : 'hover:border-white/20 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Status Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-2xl bg-slate-950 border border-white/10 ${agent.color}`}>
                    <AgentIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${agent.badgeColor}`}>
                    {agent.name}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {agent.role}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Explore Workflow</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-blue-400' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Agent Live Execution Canvas */}
        <motion.div
          key={activeAgent}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="vestris-card p-6 sm:p-10 border border-white/10 bg-slate-950/80 backdrop-blur-2xl rounded-3xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Agent Overview */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/20 border border-blue-500/40 rounded-2xl text-blue-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>{current.name}</span>
                    <span className="font-serif-italic text-slate-400 text-lg">Agent</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400">{current.role}</p>
                </div>
              </div>

              <p className="text-base text-slate-300 leading-relaxed font-normal">
                {current.tagline}
              </p>

              {/* Capabilities List */}
              <div className="space-y-3 pt-2">
                {current.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-200 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Simulated Agent Execution Payload */}
            <div className="lg:col-span-6 bg-[#080b12] border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-slate-200">EXECUTING :: {current.id.toUpperCase()}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>

              {/* Input Stream */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">INPUT STREAM</div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
                  {current.input}
                </div>
              </div>

              {/* Output Payload */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">AGENT INFERENCE OUTPUT</div>
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 font-semibold">
                  {current.output}
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
