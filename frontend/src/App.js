import React from 'react';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';

export default function App1() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Animated grid background */}
        <div
          className="absolute inset-0
           bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),
           linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]
           bg-[size:4rem_4rem]
           [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]
           opacity-30
           sm:bg-[size:2rem_2rem] md:bg-[size:3rem_3rem]"
        ></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-40 w-72 h-72 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute top-1/4 right-0 w-72 h-72 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>
        
        {/* Scanline effect */}
        <div
          className="absolute inset-0
           bg-[linear-gradient(to_bottom,transparent_50%,rgba(6,182,212,0.03)_50%)]
           bg-[size:100%_4px] pointer-events-none"
        ></div>

        {/* Dashboard with padding only on content, not header */}
        <div className="relative z-10">
          <Dashboard />
        </div>
      </div>
    </AuthProvider>
  );
}