"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Radio, Globe, RefreshCw, Search, ShieldCheck } from 'lucide-react';

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

  const categories = ['All', 'World', 'Technology', 'Business', 'Sports'];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner with live clock and Quick sync */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-red-500 font-semibold uppercase tracking-wider text-[10px]">
            <Radio className="w-3 h-3 mr-1 animate-pulse" /> LIVE STREAM
          </span>
          <span className="hidden sm:inline border-l border-slate-700 pl-3">
            Domain: <strong className="text-white font-mono">primenewschannel.com</strong>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 rounded text-xs font-medium transition cursor-pointer disabled:opacity-50"
            title="Fetch Latest RSS Feeds Now"
          >
            <RefreshCw className={`w-3 h-3 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Auto-Publishing...' : 'Sync Live Feeds'}
          </button>
          <Link href="/admin" className="hover:text-white flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-400" /> Admin
          </Link>
        </div>
      </div>

      {/* Main Logo & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-2xl shadow-md">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-950 font-serif">PRIME</span>
              <span className="text-2xl font-bold tracking-tight text-red-600">NEWS</span>
            </div>
            <p className="text-[10px] tracking-widest text-slate-600 uppercase font-semibold">CHANNEL • 24/7 GLOBAL BROADCAST</p>
          </div>
        </Link>

        {/* Search */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              window.location.href = `/?q=${encodeURIComponent(searchQuery)}`;
            }
          }}
          className="relative w-full md:w-80"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news, topics, keywords..."
            className="w-full bg-slate-100 border border-slate-300 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Category Navigation */}
      <div className="bg-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-4 py-2 text-sm font-semibold uppercase tracking-wide">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/' : `/?category=${cat}`}
                className="px-3 py-1 rounded hover:bg-red-800 transition whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </nav>
          <div className="hidden lg:flex items-center text-xs text-red-100 space-x-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Auto-Curated Feeds</span>
          </div>
        </div>
      </div>

      {/* Breaking News Marquee */}
      {breaking.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 overflow-hidden flex items-center text-xs">
          <div className="bg-red-600 text-white font-bold px-3 py-1.5 flex items-center shrink-0 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 mr-1 animate-bounce" /> Breaking
          </div>
          <div className="relative overflow-hidden w-full py-1.5">
            <div className="animate-marquee whitespace-nowrap text-slate-800 font-medium space-x-8">
              {breaking.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/article/${item.slug}`}
                  className="hover:underline hover:text-red-600 inline-block mr-8"
                >
                  🔴 {item.title} ({item.source})
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
