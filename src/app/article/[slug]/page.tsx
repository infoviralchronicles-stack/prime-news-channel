"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, Share2, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
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
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-semibold">Loading article details...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">The story you requested may have been archived or removed.</p>
        <Link href="/" className="inline-flex items-center text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Headlines
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-red-600 transition">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to All News
      </Link>

      {/* Article Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
            {article.category}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Published via {article.source}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight font-serif">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 gap-2">
          <div className="flex items-center space-x-3">
            <span>By <strong>{article.author || article.source}</strong></span>
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
            className="flex items-center space-x-1 text-slate-600 hover:text-red-600 font-medium cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      {article.imageUrl && (
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-16/9 relative shadow-sm">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
            Source: {article.source}
          </div>
        </div>
      )}

      {/* Article Body */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="text-lg font-semibold text-slate-800 leading-relaxed border-l-4 border-red-600 pl-4 bg-slate-50 py-3 rounded-r">
          {article.summary}
        </div>

        <div className="text-slate-700 leading-relaxed text-base space-y-4 whitespace-pre-line">
          {article.content}
        </div>

        {/* Source citation */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg">
          <div>
            <div className="flex items-center text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
              Verified Feed Distribution
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              This report was verified and auto-published on Prime News Channel (primenewschannel.com).
            </p>
          </div>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Original Source <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          )}
        </div>
      </div>

      {/* Related Stories */}
      {related.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center">
            <Tag className="w-4 h-4 mr-2 text-red-600" /> More in {article.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className="group flex gap-3 bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition"
              >
                <div className="w-24 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-2 leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
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
