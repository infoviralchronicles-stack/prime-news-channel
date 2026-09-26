"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Search, ShieldCheck, Menu } from 'lucide-react';

// Default headlines available immediately at render so the ticker is instant without delay
const INITIAL_BREAKING = [
  {
    title: "NHS to Suspend Staff Snooping on Patient Records",
    slug: "nhs-to-suspend-staff-snooping-on-patient-records-2026",
    source: "BBC Health News",
  },
  {
    title: "Man City Found Guilty of Breaking Financial Rules",
    slug: "man-city-found-guilty-of-breaking-financial-rules-2026",
    source: "BBC Sport",
  },
  {
    title: "OpenAI Bots Meddled with Multiple US Agency Sites",
    slug: "openai-bots-meddled-with-multiple-us-agency-sites-2026",
    source: "BBC Technology Wire",
  },
  {
    title: "Iran Offers US Deal to Reopen Strait of Hormuz",
    slug: "iran-offers-us-deal-to-reopen-strait-of-hormuz-2026",
    source: "BBC World Service",
  },
  {
    title: "US Backs Musk Bid to Overturn €120m EU Fine",
    slug: "us-backs-musk-bid-overturn-120m-eu-fine-2026",
    source: "BBC Technology Wire",
  },
  {
    title: "Trump & Xi Hold State Dinner Amid Tense Talks",
    slug: "trump-xi-hold-state-dinner-amid-tense-talks-2026",
    source: "BBC World Service",
  },
  {
    title: "Rapid New Test Transforms Brain Tumour Diagnosis",
    slug: "rapid-new-test-transforms-brain-tumour-diagnosis-2026",
    source: "BBC Health",
  },
  {
    title: "Netanyahu Defends Military Action in UN Address",
    slug: "netanyahu-defends-military-action-in-un-address-2026",
    source: "BBC World Service",
  },
  {
    title: "Chelsea Charged by FA Over Discriminatory Chants",
    slug: "chelsea-charged-by-fa-over-discriminatory-chants-2026",
    source: "BBC Sport",
  },
];

export default function Header() {
  const [breaking, setBreaking] = useState<any[]>(INITIAL_BREAKING);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    fetchBreaking();
    const d = new Date();
    setTodayDate(d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const fetchBreaking = async () => {
    try {
      const res = await fetch('/api/news?limit=10');
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        setBreaking(data.articles.slice(0, 5));
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
      alert(data.message || 'Dispatches synchronized successfully!');
      window.location.reload();
    } catch (e) {
      alert('Failed to sync news.');
    } finally {
      setIsSyncing(false);
    }
  };

  const sections = [
    { name: 'Home', href: '/' },
    { name: 'World', href: '/?category=World' },
    { name: 'Business', href: '/?category=Business' },
    { name: 'Technology', href: '/?category=Technology' },
    { name: 'Health & Science', href: '/?category=Health' },
    { name: 'Sports', href: '/?category=Sports' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white">
      {/* Top Utility Bar */}
      <div className="border-b border-[#e2e2e2] px-4 sm:px-8 lg:px-12 py-2 text-[11px] font-sans text-neutral-600">
        <div className="max-w-[1550px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-neutral-900">{todayDate || 'Daily Edition'}</span>
            <span className="hidden sm:inline border-l border-neutral-300 pl-4 font-mono text-neutral-500">
              primenewschannel.com
            </span>
          </div>

          <div className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">
            Independent Digital Newsstand
          </div>
        </div>
      </div>

      {/* Iconic Washington Post Style Masthead */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-4 text-center border-b border-[#d5d5d5]">
        <div className="relative flex flex-col items-center justify-center">
          {/* Main Gothic Title */}
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#111111] font-masthead select-none">
              Prime News Channel
            </h1>
          </Link>
        </div>
      </div>

      {/* WaPo Double Border Horizontal Navigation */}
      <div className="border-b-2 border-black border-t border-neutral-300">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto scrollbar-none py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900">
            {sections.map((sec) => (
              <Link
                key={sec.name}
                href={sec.href}
                className="hover:text-[#0056b3] transition whitespace-nowrap py-1 border-b-2 border-transparent hover:border-black"
              >
                {sec.name}
              </Link>
            ))}
          </nav>

          {/* Minimal Search input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/?q=${encodeURIComponent(searchQuery)}`;
              }
            }}
            className="hidden md:flex items-center relative my-1"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Prime News Channel..."
              className="border border-neutral-300 bg-[#f9f9f9] text-xs px-3 py-1.5 pr-8 focus:outline-none focus:bg-white focus:border-black transition w-56 font-sans"
            />
            <button type="submit" className="absolute right-2 text-neutral-500 hover:text-black cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Breaking News Ticker in WaPo Clean Red Strip */}
      {breaking.length > 0 && (
        <div className="border-b border-[#e2e2e2] bg-[#fbfbfb] px-4 sm:px-8 lg:px-12 flex items-center text-xs">
          <div className="max-w-[1550px] mx-auto w-full flex items-center py-1.5">
            <span className="font-bold text-[#b00] uppercase tracking-wider mr-3 shrink-0 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#b00] mr-1.5 animate-pulse" /> Breaking News:
            </span>
            <div className="relative overflow-hidden w-full">
              <div className="animate-marquee whitespace-nowrap font-serif text-neutral-800 flex items-center">
                {/* First set of breaking headlines */}
                <div className="flex items-center space-x-12 shrink-0 pr-12">
                  {breaking.map((item, idx) => (
                    <Link
                      key={`b1-${idx}`}
                      href={`/article/${item.slug}`}
                      className="hover:underline hover:text-[#0056b3] inline-block font-medium"
                    >
                      {item.title} <span className="text-neutral-400 font-sans text-[11px]">({item.source})</span>
                    </Link>
                  ))}
                </div>
                {/* Duplicated set for seamless continuous marquee loop */}
                <div className="flex items-center space-x-12 shrink-0 pr-12" aria-hidden="true">
                  {breaking.map((item, idx) => (
                    <Link
                      key={`b2-${idx}`}
                      href={`/article/${item.slug}`}
                      className="hover:underline hover:text-[#0056b3] inline-block font-medium"
                    >
                      {item.title} <span className="text-neutral-400 font-sans text-[11px]">({item.source})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
