"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, Share2, ExternalLink, ShieldCheck, Tag, ArrowUpRight } from 'lucide-react';
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
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-semibold">Loading article details...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center bg-slate-900 rounded-2xl border border-slate-800 p-8">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-sm text-slate-400 mt-2 mb-6">The story you requested may have been archived.</p>
        <Link href="/" className="inline-flex items-center text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Headlines
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-cyan-400 transition">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Feed
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            {article.category}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Published via {article.source}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800 gap-2">
          <div className="flex items-center space-x-3">
            <span>By <strong className="text-slate-200">{article.author || article.source}</strong></span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {new Date(article.publishedAt).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-full cursor-pointer transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      {article.imageUrl && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 aspect-16/9 relative shadow-2xl">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 right-3 bg-black/70 text-slate-300 text-[10px] px-3 py-1 rounded-full backdrop-blur-md">
            Source: {article.source}
          </div>
        </div>
      )}

      {/* Article Body */}
      <div className="bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="text-lg sm:text-xl font-semibold text-slate-100 leading-relaxed border-l-4 border-cyan-500 pl-4 bg-slate-900/90 py-4 rounded-r-xl">
          {article.summary}
        </div>

        <div className="text-slate-300 leading-relaxed text-base sm:text-lg space-y-4 whitespace-pre-line">
          {article.content}
        </div>

        {/* Source citation */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-5 rounded-2xl">
          <div>
            <div className="flex items-center text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Verified Feed Distribution
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous verification on Prime News Channel (primenewschannel.com).
            </p>
          </div>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-full transition"
            >
              Original Source <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          )}
        </div>
      </div>

      {/* Related Stories */}
      {related.length > 0 && (
        <div className="space-y-4 pt-8">
          <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center">
            <Tag className="w-4 h-4 mr-2 text-cyan-400" /> More in {article.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className="group flex gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="w-24 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-500">
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
