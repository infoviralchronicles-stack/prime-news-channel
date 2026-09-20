"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Radio, Globe, RefreshCw, Search, ShieldCheck, Zap } from 'lucide-react';

export default function Header() {
  const [breaking, setBreaking] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBreaking();
  }, []);

  const fetchBreaking = async () => {
    try {
      const res = await fetch('/api/news?limit=10');
      const data = await res.json();
      if (data.articles) {
        setBreaking(data.articles.filter((a: any) => a.isBreaking || true).slice(0, 5));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/news', { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'News updated successfully!');
      window.location.reload();
    } catch (e) {
      alert('Failed to sync news.');
    } finally {
      setIsSyncing(false);
    }
  };

  const categories = [
    { name: 'All Stories', href: '/', color: 'text-white' },
    { name: 'Technology', href: '/?category=Technology', color: 'text-cyan-400 hover:text-cyan-300' },
    { name: 'Business', href: '/?category=Business', color: 'text-emerald-400 hover:text-emerald-300' },
    { name: 'World', href: '/?category=World', color: 'text-purple-400 hover:text-purple-300' },
    { name: 'Sports', href: '/?category=Sports', color: 'text-amber-400 hover:text-amber-300' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800 shadow-2xl">
      {/* Top subtle bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/60 px-4 py-1.5 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold tracking-wider text-[10px] border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-ping" /> LIVE BROADCAST
          </span>
          <span className="hidden sm:inline text-slate-400">
            Domain: <strong className="text-slate-200 font-mono">primenewschannel.com</strong>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Publishing...' : 'Auto-Sync Feeds'}
          </button>
          <Link href="/admin" className="text-slate-400 hover:text-white flex items-center transition">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Admin
          </Link>
        </div>
      </div>

      {/* Main Bar: Logo, Nav, Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-600/20 group-hover:scale-105 transition duration-300">
            P
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tighter text-white">PRIME</span>
              <span className="text-2xl font-black tracking-tighter bg-linear-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">NEWS</span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest ml-1">CHANNEL</span>
            </div>
            <p className="text-[10px] tracking-widest text-slate-400 uppercase font-medium">Autonomous Global Journalism</p>
          </div>
        </Link>

        {/* Dynamic Nav Pills */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/90 p-1 rounded-full border border-slate-800">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${cat.color} hover:bg-slate-800`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              window.location.href = `/?q=${encodeURIComponent(searchQuery)}`;
            }
          }}
          className="relative w-full md:w-64"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news, topics..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-full py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
        </form>
      </div>

      {/* Modern High-Voltage Ticker */}
      {breaking.length > 0 && (
        <div className="bg-slate-950 border-t border-b border-slate-800/80 overflow-hidden flex items-center text-xs">
          <div className="bg-linear-to-r from-red-600 to-rose-600 text-white font-black px-4 py-2 flex items-center shrink-0 uppercase tracking-widest text-[11px] shadow-sm">
            <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" /> FLASH
          </div>
          <div className="relative overflow-hidden w-full py-1.5">
            <div className="animate-marquee whitespace-nowrap text-slate-300 font-medium space-x-10">
              {breaking.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/article/${item.slug}`}
                  className="hover:text-cyan-400 transition inline-block mr-8"
                >
                  <span className="text-red-500 font-bold mr-2">●</span>
                  {item.title} <span className="text-slate-500 text-[11px]">({item.source})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
