"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 font-sans">
      <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs uppercase tracking-wider font-bold text-neutral-600 hover:text-black">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Prime News Channel
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-[#b00]">
          Legal &amp; Privacy
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black font-headline text-[#111111] leading-tight">
          Privacy Policy
        </h1>
        <p className="text-xs font-serif italic text-neutral-600">
          Last Updated: September 2026 • Official Documentation for primenewschannel.com
        </p>
      </div>

      <div className="font-serif-body text-base text-neutral-800 leading-[1.8] space-y-6">
        <p>
          At <strong>Prime News Channel (primenewschannel.com)</strong>, we are committed to respecting and protecting the privacy of our readership. This Privacy Policy outlines our data handling practices regarding information collected when accessing our broadsheet digital platform.
        </p>

        <h2 className="text-xl font-bold font-headline text-[#111111] pt-3 border-b border-neutral-300 pb-1">
          1. Information We Collect
        </h2>
        <p>
          We do not require user account registration to read our articles. We may automatically log non-personally identifiable technical telemetry such as browser type, operating system version, access timestamps, and referring URLs strictly to optimize layout responsiveness and monitor traffic loads.
        </p>

        <h2 className="text-xl font-bold font-headline text-[#111111] pt-3 border-b border-neutral-300 pb-1">
          2. Cookies &amp; Web Beacons
        </h2>
        <p>
          Our service uses standard session cookies to remember user search criteria and reading preferences. Third-party partners (such as analytics providers or advertising networks compliant with Google policies) may utilize cookies to measure programmatic performance.
        </p>

        <h2 className="text-xl font-bold font-headline text-[#111111] pt-3 border-b border-neutral-300 pb-1">
          3. Contact Inquiries
        </h2>
        <p>
          Information submitted voluntarily through our <Link href="/contact" className="text-[#0056b3] underline font-bold">Contact Desk</Link> (including name and email address) is used solely to respond to reader inquiries and is never shared, leased, or sold to third-party commercial marketing entities.
        </p>
      </div>
    </div>
  );
}
