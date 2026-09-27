import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
});

const instrumentSerif = Instrument_Serif({ 
  weight: ['400'], 
  style: ['italic', 'normal'],
  subsets: ['latin'], 
  variable: '--font-serif' 
});

export const metadata: Metadata = {
  title: 'SentinelAI — Autonomous AI Agents for Physical Security & Camera Triage',
  description: 'AI-powered security platform that automates multi-camera monitoring, 5-second alert triage, threat explanation, and guard dispatch.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${instrumentSerif.variable}`}>
      <body className="bg-[#080c14] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

