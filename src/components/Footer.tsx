import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-lg">
                P
              </div>
              <span className="text-xl font-black text-white tracking-tight">PRIME NEWS CHANNEL</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              <strong>primenewschannel.com</strong> delivers autonomous 24/7 global news dispatches, powered by next-gen feed aggregation across tech, finance, and geopolitics.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Autonomous RSS Pipeline • Next.js 16.3 • Vercel Hosted
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/?category=Technology" className="hover:text-cyan-400 transition">Technology &amp; AI</Link></li>
              <li><Link href="/?category=Business" className="hover:text-emerald-400 transition">Business &amp; Markets</Link></li>
              <li><Link href="/?category=World" className="hover:text-purple-400 transition">World News</Link></li>
              <li><Link href="/?category=Sports" className="hover:text-amber-400 transition">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
              Management
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/admin" className="hover:text-cyan-400 transition">Control Panel</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-400 transition">Configure RSS Feeds</Link></li>
              <li><a href="https://primenewschannel.com" className="hover:text-cyan-400 transition">primenewschannel.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Prime News Channel. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-slate-600">primenewschannel.com</p>
        </div>
      </div>
    </footer>
  );
}
