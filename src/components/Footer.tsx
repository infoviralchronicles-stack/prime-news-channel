import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-neutral-400 border-t-4 border-[#bb1919] mt-20 pt-10 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* BBC Logo Blocks */}
        <div className="flex items-center space-x-1 mb-6">
          <span className="w-6 h-6 bg-white text-black font-black text-sm flex items-center justify-center font-serif">P</span>
          <span className="w-6 h-6 bg-white text-black font-black text-sm flex items-center justify-center font-serif">N</span>
          <span className="w-6 h-6 bg-white text-black font-black text-sm flex items-center justify-center font-serif">C</span>
          <span className="ml-2 font-bold text-white tracking-wider">PRIME NEWS CHANNEL</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-8 border-b border-neutral-800">
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider">Sections</h4>
            <ul className="space-y-2">
              <li><Link href="/?category=World" className="hover:underline hover:text-white">World</Link></li>
              <li><Link href="/?category=Business" className="hover:underline hover:text-white">Business</Link></li>
              <li><Link href="/?category=Technology" className="hover:underline hover:text-white">Technology</Link></li>
              <li><Link href="/?category=Sports" className="hover:underline hover:text-white">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider">Service</h4>
            <ul className="space-y-2">
              <li><Link href="/admin" className="hover:underline hover:text-white">Admin Dashboard</Link></li>
              <li><Link href="/admin" className="hover:underline hover:text-white">RSS Feed Sources</Link></li>
              <li><a href="https://primenewschannel.com" className="hover:underline hover:text-white">primenewschannel.com</a></li>
            </ul>
          </div>

          <div className="col-span-2">
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider">About Prime News Channel</h4>
            <p className="text-neutral-400 leading-relaxed text-xs">
              <strong>primenewschannel.com</strong> delivers comprehensive, 24/7 automated global news coverage. Designed and structured according to world-class BBC News broadcasting principles.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} Prime News Channel. BBC-Style Architecture.</p>
          <p className="mt-2 sm:mt-0">primenewschannel.com</p>
        </div>
      </div>
    </footer>
  );
}
