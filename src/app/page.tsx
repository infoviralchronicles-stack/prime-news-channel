"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, Sparkles, AlertCircle, RefreshCw, Zap, ArrowUpRight } from 'lucide-react';
import { Article } from '@/lib/types';

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = use(searchParams);
  const currentCategory = params.category || 'All';
  const query = params.q || '';

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, [currentCategory, query]);

  const loadNews = async () => {
    setLoading(true);
    try {
      let url = `/api/news?limit=40`;
      if (currentCategory && currentCategory !== 'All') {
        url += `&category=${encodeURIComponent(currentCategory)}`;
      }
      if (query) {
        url += `&q=${encodeURIComponent(query)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.articles || data.articles.length === 0) {
        const syncRes = await fetch('/api/news', { method: 'POST' });
        const retryRes = await fetch(url);
        const retryData = await retryRes.json();
        setArticles(retryData.articles || []);
        setLastUpdated(retryData.lastUpdated);
      } else {
        setArticles(data.articles);
        setLastUpdated(data.lastUpdated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
        return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      case 'business':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'world':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'sports':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    }
  };

  const heroArticle = articles[0];
  const sideArticles = articles.slice(1, 4);
  const bentoGrid = articles.slice(4, 10);
  const remainingGrid = articles.slice(10);

  return (
    <div className="space-y-12 pb-16">
      {/* Category/Query Status */}
      {(query || (currentCategory && currentCategory !== 'All')) && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {query ? `Search: "${query}"` : `Feed: ${currentCategory}`}
            </h2>
            <p className="text-xs text-slate-400">{articles.length} news dispatches found</p>
          </div>
          <Link href="/" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
            Clear Filter ×
          </Link>
        </div>
      )}

      {loading ? (
        <div className="py-32 text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="w-14 h-14 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
            <Zap className="w-6 h-6 text-red-500 absolute inset-0 m-auto animate-pulse" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">Syncing Prime News Stream</h3>
          <p className="text-xs text-slate-400 mt-1">Aggregating real-time verified feeds...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center bg-slate-900 rounded-2xl border border-slate-800 p-8">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white">No Stories Found</h3>
          <p className="text-sm text-slate-400 mt-2 mb-6">No articles currently match your search.</p>
          <button
            onClick={() => loadNews()}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-full transition cursor-pointer"
          >
            Refresh Feed Stream
          </button>
        </div>
      ) : (
        <>
          {/* Top Hero Showcase (Bento Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Massive Hero Card */}
            {heroArticle && (
              <div className="lg:col-span-8 group">
                <Link
                  href={`/article/${heroArticle.slug}`}
                  className="block relative h-full min-h-[420px] rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-2xl hover:border-slate-700 transition duration-500"
                >
                  <img
                    src={heroArticle.imageUrl}
                    alt={heroArticle.title}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6 sm:p-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getCategoryBadgeClass(heroArticle.category)}`}>
                        {heroArticle.category}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {new Date(heroArticle.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {heroArticle.source}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight group-hover:text-cyan-300 transition duration-300">
                      {heroArticle.title}
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 line-clamp-2 mt-3 max-w-3xl leading-relaxed">
                      {heroArticle.summary}
                    </p>

                    <div className="mt-4 flex items-center text-xs font-bold text-cyan-400">
                      <span>Read Story</span>
                      <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Side Column: 3 Sleek Cards */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              {sideArticles.map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/article/${art.slug}`}
                  className="group flex gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition duration-300"
                >
                  <div className="w-28 h-24 shrink-0 rounded-xl overflow-hidden relative bg-slate-800">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 ${getCategoryBadgeClass(art.category)}`}>
                        {art.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-2 leading-snug">
                        {art.title}
                      </h3>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center mt-1">
                      <span>{art.source}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bento Grid: Vibrant Modern Visual Stream */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-black uppercase tracking-tight text-white">
                  Trending Stream &amp; Analysis
                </h2>
              </div>
              {lastUpdated && (
                <span className="text-xs text-slate-400 font-mono">
                  LIVE SYNC: {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bentoGrid.map((art) => (
                <Link
                  key={art.id}
                  href={`/article/${art.slug}`}
                  className="group flex flex-col justify-between bg-slate-900/50 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-slate-700 hover:bg-slate-900 transition duration-300 shadow-lg"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-800">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${getCategoryBadgeClass(art.category)}`}>
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between mb-2">
                        <span className="font-semibold">{art.source}</span>
                        <span>{new Date(art.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <h3 className="font-bold text-white group-hover:text-cyan-400 transition text-base leading-snug line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">By {art.author || art.source}</span>
                      <span className="text-cyan-400 font-bold group-hover:underline flex items-center">
                        Read <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
