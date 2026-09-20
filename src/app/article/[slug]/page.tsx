"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, Share2, ExternalLink, ShieldCheck } from 'lucide-react';
import { Article } from '@/lib/types';

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data.article);
        setRelated(data.related || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="w-8 h-8 border-4 border-[#bb1919] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-neutral-600 font-bold text-sm">Loading BBC Prime article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center bg-[#f6f6f6] border border-[#e6e6e6] p-8 max-w-xl mx-auto my-12">
        <h2 className="text-xl font-black text-[#141414]">Story Not Available</h2>
        <p className="text-xs text-neutral-600 mt-2 mb-6">The report could not be found or has been updated.</p>
        <Link href="/" className="inline-flex items-center text-xs font-bold bg-[#bb1919] text-white px-4 py-2 hover:bg-[#8f1313]">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="border-b border-[#e6e6e6] pb-3 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs font-bold text-neutral-600 hover:text-[#bb1919]">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> BBC PRIME NEWS
        </Link>
        <span className="text-xs font-bold text-[#bb1919] uppercase tracking-wider">
          {article.category}
        </span>
      </div>

      {/* BBC Article Title */}
      <h1 className="text-3xl sm:text-5xl font-black text-[#141414] leading-tight tracking-tight">
        {article.title}
      </h1>

      {/* Author & Timestamp Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-600 py-3 border-t border-b border-[#e6e6e6] gap-2">
        <div className="flex items-center space-x-3">
          <span>By <strong>{article.author || article.source}</strong></span>
          <span>•</span>
          <span className="flex items-center text-neutral-500">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1 font-bold text-neutral-700 hover:text-[#bb1919] cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Big Hero Image */}
      {article.imageUrl && (
        <div className="bg-neutral-100 aspect-16/9 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="space-y-6 max-w-3xl">
        <p className="text-lg sm:text-xl font-bold text-[#141414] leading-relaxed">
          {article.summary}
        </p>

        <div className="text-neutral-800 text-base sm:text-lg leading-relaxed space-y-4 whitespace-pre-line font-serif">
          {article.content}
        </div>

        {/* Verification / Source Citation */}
        <div className="mt-8 pt-6 border-t border-[#e6e6e6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f6f6f6] p-4">
          <div>
            <div className="flex items-center text-xs font-bold text-neutral-900">
              <ShieldCheck className="w-4 h-4 text-[#bb1919] mr-1.5" />
              Published via Prime News Channel (primenewschannel.com)
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">Original wire reporting: {article.source}</p>
          </div>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#141414] hover:bg-black text-white text-xs font-bold px-3.5 py-2 transition"
            >
              Original Source <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          )}
        </div>
      </div>

      {/* Related BBC Stories */}
      {related.length > 0 && (
        <div className="pt-8 border-t-2 border-black space-y-4">
          <h3 className="text-base font-black uppercase text-[#141414]">Related BBC Prime Stories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className="group flex gap-3 p-2 hover:bg-[#f6f6f6] transition"
              >
                <div className="w-24 h-16 shrink-0 bg-neutral-100 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#141414] group-hover:underline decoration-[#bb1919] line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
