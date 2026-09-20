"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 font-sans">
      <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs uppercase tracking-wider font-bold text-neutral-600 hover:text-black">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Prime News Channel
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-[#b00]">
          Terms of Service
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black font-headline text-[#111111] leading-tight">
          Terms of Service
        </h1>
        <p className="text-xs font-serif italic text-neutral-600">
          Last Updated: September 2026 • primenewschannel.com
        </p>
      </div>

      <div className="font-serif-body text-base text-neutral-800 leading-[1.8] space-y-6">
        <p>
          By accessing and browsing <strong>Prime News Channel (primenewschannel.com)</strong>, you agree to comply with and be bound by the following terms and conditions of usage.
        </p>

        <h2 className="text-xl font-bold font-headline text-[#111111] pt-3 border-b border-neutral-300 pb-1">
          1. Intellectual Property &amp; Attribution
        </h2>
        <p>
          The layout, typography, aggregation architecture, and compiled dispatches presented on this website are the intellectual property of Prime News Channel and respective syndicate wire providers. Content is provided for personal informational purposes.
        </p>

        <h2 className="text-xl font-bold font-headline text-[#111111] pt-3 border-b border-neutral-300 pb-1">
          2. Disclaimer of Warranties
        </h2>
        <p>
          While Prime News Channel employs multi-tier verification filters, all information is provided on an "as is" basis without warranty of any kind. Readers are encouraged to consult primary sources for critical commercial, investment, or legal decisions.
        </p>
      </div>
    </div>
  );
}
