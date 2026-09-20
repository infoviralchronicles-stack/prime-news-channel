"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Search, ShieldCheck } from 'lucide-react';

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
    { name: 'Home', href: '/' },
    { name: 'World', href: '/?category=World' },
    { name: 'Business', href: '/?category=Business' },
    { name: 'Technology', href: '/?category=Technology' },
    { name: 'Sports', href: '/?category=Sports' },
  ];

  return (
    <header className="bg-white border-b border-[#e6e6e6]">
      {/* Top Black Bar with BBC Style Blocks Logo & Utility */}
      <div className="bg-black text-white px-4 sm:px-8 lg:px-12 py-3.5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* BBC 3-Box Signature Logo */}
            <Link href="/" className="flex items-center space-x-1.5">
              <span className="w-8 h-8 bg-white text-black font-black text-xl flex items-center justify-center font-serif">P</span>
              <span className="w-8 h-8 bg-white text-black font-black text-xl flex items-center justify-center font-serif">N</span>
              <span className="w-8 h-8 bg-white text-black font-black text-xl flex items-center justify-center font-serif">C</span>
              <span className="ml-3 text-base font-black tracking-widest hidden sm:inline text-white">PRIME NEWS</span>
            </Link>
            <span className="hidden md:inline text-xs text-neutral-400 border-l border-neutral-700 pl-4 font-mono">
              primenewschannel.com
            </span>
          </div>

          <div className="flex items-center space-x-5 text-xs font-semibold">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center bg-[#bb1919] hover:bg-[#8f1313] text-white px-3.5 py-1.5 text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'FETCHING...' : 'LIVE SYNC'}
            </button>
            <Link href="/admin" className="text-neutral-300 hover:text-white flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-[#bb1919]" /> Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* BBC Red Bar with Brand & Category Links */}
      <div className="bg-[#bb1919] text-white px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center overflow-x-auto scrollbar-none">
            <Link href="/" className="py-4 pr-8 text-3xl font-black tracking-tight border-r border-[#8f1313] mr-6 whitespace-nowrap">
              NEWS
            </Link>
            <nav className="flex space-x-2 sm:space-x-8 text-base font-bold whitespace-nowrap">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="py-4 hover:border-b-4 hover:border-white transition border-b-4 border-transparent px-2"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/?q=${encodeURIComponent(searchQuery)}`;
              }
            }}
            className="hidden md:flex items-center relative my-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search BBC Prime..."
              className="bg-[#8f1313] text-white placeholder-neutral-200 text-sm px-4 py-2 pr-10 focus:outline-none focus:bg-white focus:text-black transition w-64"
            />
            <button type="submit" className="absolute right-3 text-white hover:text-black cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* BBC Red Live Breaking Ticker */}
      {breaking.length > 0 && (
        <div className="bg-[#f6f6f6] border-b border-[#e6e6e6] overflow-hidden flex items-center text-sm px-4 sm:px-8 lg:px-12">
          <div className="max-w-[1600px] mx-auto w-full flex items-center">
            <div className="bg-[#bb1919] text-white font-black px-4 py-2 flex items-center shrink-0 uppercase tracking-wider text-xs">
              <span className="w-2 h-2 rounded-full bg-white mr-2 animate-ping" /> BREAKING
            </div>
            <div className="relative overflow-hidden w-full py-2 pl-4">
              <div className="animate-marquee whitespace-nowrap text-[#141414] font-bold space-x-12">
                {breaking.map((item, idx) => (
                  <Link
                    key={idx}
                    href={`/article/${item.slug}`}
                    className="hover:underline hover:text-[#bb1919] inline-block mr-12"
                  >
                    {item.title} <span className="text-neutral-500 font-normal text-xs">| {item.source}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
