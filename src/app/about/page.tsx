"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Globe, Award, Newspaper } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 font-sans">
      <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs uppercase tracking-wider font-bold text-neutral-600 hover:text-black">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Prime News Channel
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-[#b00]">
          About Our Newsroom
        </span>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black font-headline text-[#111111] leading-tight">
          About Prime News Channel
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-neutral-600 border-l-2 border-black pl-4">
          Independent, verified, autonomous journalism delivered 24 hours a day, 7 days a week.
        </p>
      </div>

      <div className="font-serif-body text-base sm:text-lg text-neutral-800 leading-[1.8] space-y-6">
        <p>
          Founded as a modern digital broadsheet, <strong>Prime News Channel (primenewschannel.com)</strong> operates at the nexus of high-velocity wire journalism, computational verification, and investigative editorial standards. Inspired by the venerable traditions of world-class publishing houses such as <em>The Washington Post</em>, our mission is straightforward: to provide unvarnished, accurate, and comprehensive reporting on the events shaping our planet.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 not-prose font-sans">
          <div className="p-5 border border-neutral-300 bg-[#fafafa]">
            <Globe className="w-6 h-6 text-[#b00] mb-2" />
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wide">24/7 Global Wire</h3>
            <p className="text-xs text-neutral-600 mt-1">Real-time international dispatches aggregated across verified sovereign bureaus.</p>
          </div>
          <div className="p-5 border border-neutral-300 bg-[#fafafa]">
            <ShieldCheck className="w-6 h-6 text-[#b00] mb-2" />
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wide">Strict Verification</h3>
            <p className="text-xs text-neutral-600 mt-1">Algorithmic and editorial filters preventing duplicate coverage or misleading claims.</p>
          </div>
          <div className="p-5 border border-neutral-300 bg-[#fafafa]">
            <Newspaper className="w-6 h-6 text-[#b00] mb-2" />
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wide">Broadsheet Rigor</h3>
            <p className="text-xs text-neutral-600 mt-1">In-depth contextual reporting from macroeconomic policy to cutting-edge AI frontiers.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold font-headline text-[#111111] pt-4 border-b border-neutral-300 pb-2">
          Our Editorial Philosophy
        </h2>
        <p>
          In an era characterized by fragmented media feeds and superficial soundbites, <strong>Prime News Channel</strong> champions depth, analytical clarity, and historical context. Each story published across our World, Technology, Business, and Sports sections is scrutinized for factual consistency, source attribution, and long-term societal relevance.
        </p>
        <p>
          Our continuous automated publishing infrastructure monitors global syndicates around the clock, curating high-impact dispatches while adhering to the highest tenets of fair, transparent, and balanced journalistic practice.
        </p>

        <h2 className="text-2xl font-bold font-headline text-[#111111] pt-4 border-b border-neutral-300 pb-2">
          Editorial Governance &amp; Contact
        </h2>
        <p>
          We welcome inquiries, corrections, and editorial feedback from our readers worldwide. For general correspondence, press inquiries, or editorial submissions, please visit our <Link href="/contact" className="text-[#0056b3] underline font-bold">Contact Us</Link> page.
        </p>
      </div>
    </div>
  );
}
