"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black mt-24 pt-12 pb-10 text-xs font-sans">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center pb-8 border-b border-neutral-300">
          <Link
            href="/"
            className="inline-block group cursor-pointer"
            onClick={() => {
              if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-black font-masthead text-[#111111] group-hover:text-[#0056b3] transition cursor-pointer">
              Prime News Channel
            </h2>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-b border-neutral-200">
          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">News Sections</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><Link href="/?category=World" className="hover:underline hover:text-black">World</Link></li>
              <li><Link href="/?category=Business" className="hover:underline hover:text-black">Business</Link></li>
              <li><Link href="/?category=Technology" className="hover:underline hover:text-black">Technology</Link></li>
              <li><Link href="/?category=Health" className="hover:underline hover:text-black">Health &amp; Science</Link></li>
              <li><Link href="/?category=Sports" className="hover:underline hover:text-black">Sports</Link></li>
            </ul>
          </div>

                    <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">About &amp; Company</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><Link href="/about" className="hover:underline hover:text-black">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline hover:text-black">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:underline hover:text-black">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline hover:text-black">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">Verification &amp; Ethics</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><Link href="/about" className="hover:underline hover:text-black">Fact-Checking Policy</Link></li>
              <li><Link href="/terms" className="hover:underline hover:text-black">Corrections Policy</Link></li>
              <li><Link href="/privacy" className="hover:underline hover:text-black">Privacy Protection</Link></li>
              <li><Link href="/contact" className="hover:underline hover:text-black">Report a Correction</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">Editorial Mission</h4>
            <p className="text-neutral-600 leading-relaxed text-xs font-serif">
              <strong>primenewschannel.com</strong> delivers unbiased, verified, around-the-clock investigative journalism covering global affairs, economic shifts, emerging technologies, and health sciences.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} Prime News Channel. Broadsheet Edition.</p>
          <p className="mt-2 sm:mt-0 font-mono">primenewschannel.com</p>
        </div>
      </div>
    </footer>
  );
}
