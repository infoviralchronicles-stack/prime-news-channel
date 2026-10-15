'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

export default function ShareButton({ title }: { title?: string }) {
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: title || 'Prime News Channel Article',
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center space-x-1.5 font-bold text-neutral-800 hover:text-[#0056b3] cursor-pointer transition"
      title="Share article"
    >
      <Share2 className="w-3.5 h-3.5" />
      <span>Share</span>
    </button>
  );
}
