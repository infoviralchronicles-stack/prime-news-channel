import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black mt-24 pt-12 pb-10 text-xs font-sans">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center pb-8 border-b border-neutral-300">
          <h2 className="text-3xl sm:text-4xl font-black font-masthead text-[#111111]">
            The Prime News Post
          </h2>
          <p className="italic text-xs text-neutral-500 font-serif mt-1">
            Democracy Dies in Darkness
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-b border-neutral-200">
          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">News Sections</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><Link href="/?category=World" className="hover:underline hover:text-black">World</Link></li>
              <li><Link href="/?category=Business" className="hover:underline hover:text-black">Business &amp; Finance</Link></li>
              <li><Link href="/?category=Technology" className="hover:underline hover:text-black">Technology &amp; Science</Link></li>
              <li><Link href="/?category=Sports" className="hover:underline hover:text-black">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">Newsroom Operations</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><Link href="/admin" className="hover:underline hover:text-black">Admin Panel</Link></li>
              <li><Link href="/admin" className="hover:underline hover:text-black">RSS Feeds Sync</Link></li>
              <li><a href="https://primenewschannel.com" className="hover:underline hover:text-black">primenewschannel.com</a></li>
            </ul>
          </div>

          <div className="col-span-2">
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">Editorial Standards</h4>
            <p className="text-neutral-600 leading-relaxed text-xs font-serif">
              <strong>primenewschannel.com</strong> is operated under the Washington Post-inspired investigative broadsheet paradigm. Articles are programmatically aggregated, checked against duplicate fingerprints, and curated around the clock.
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
