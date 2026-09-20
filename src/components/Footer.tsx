import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <span className="text-xl font-black text-white">PRIME NEWS CHANNEL</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-4">
              <strong>primenewschannel.com</strong> delivers comprehensive, 24/7 automated real-time global news coverage across technology, business, geopolitics, and sports.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Auto-Aggregation Engine Powered &amp; Live Synced.
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-1">
              Top Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/?category=World" className="hover:text-white transition">World News</Link></li>
              <li><Link href="/?category=Technology" className="hover:text-white transition">Technology &amp; AI</Link></li>
              <li><Link href="/?category=Business" className="hover:text-white transition">Business &amp; Markets</Link></li>
              <li><Link href="/?category=Sports" className="hover:text-white transition">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-1">
              Platform &amp; System
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin" className="hover:text-white transition">Admin Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Manage RSS Feeds</Link></li>
              <li><a href="https://primenewschannel.com" className="hover:text-white transition">primenewschannel.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Prime News Channel. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for primenewschannel.com</p>
        </div>
      </div>
    </footer>
  );
}
