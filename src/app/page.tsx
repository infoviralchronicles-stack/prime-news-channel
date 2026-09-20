"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
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
      
      // If store is empty, trigger initial fetch
      if (!data.articles || data.articles.length === 0) {
        const syncRes = await fetch('/api/news', { method: 'POST' });
        const syncData = await syncRes.json();
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

  const heroArticle = articles[0];
  const secondaryHero = articles.slice(1, 4);
  const trendingArticles = articles.slice(4, 9);
  const gridArticles = articles.slice(9);

  return (
    <div>
      {/* Search or category indicator */}
      {(query || (currentCategory && currentCategory !== 'All')) && (
        <div className="mb-6 p-4 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {query ? `Search results for: "${query}"` : `Category: ${currentCategory}`}
            </h2>
            <p className="text-xs text-slate-500">{articles.length} news articles found</p>
          </div>
          <Link href="/" className="text-xs font-semibold text-red-600 hover:underline">
            Clear Filters
          </Link>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="w-10 h-10 text-red-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800">Loading Latest News...</h3>
          <p className="text-sm text-slate-500 mt-1">Aggregating live dispatches from verified feeds...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-800">No News Found</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">No articles currently match your search criteria.</p>
          <button
            onClick={() => loadNews()}
            className="bg-red-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            Refresh Feeds
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Lead Story */}
            {heroArticle && (
              <div className="lg:col-span-7 group">
                <Link href={`/article/${heroArticle.slug}`} className="block relative overflow-hidden rounded-xl bg-slate-900 border border-slate-200 shadow-sm aspect-16/10">
                  <img
                    src={heroArticle.imageUrl}
                    alt={heroArticle.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {heroArticle.category}
                      </span>
                      <span className="text-slate-300 text-xs flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {new Date(heroArticle.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug group-hover:text-red-200 transition">
                      {heroArticle.title}
                    </h1>
                    <p className="text-sm text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {heroArticle.summary}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Side Column: Secondary Stories */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {secondaryHero.map((art) => (
                <Link
                  key={art.id}
                  href={`/article/${art.slug}`}
                  className="group flex gap-4 bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition"
                >
                  <div className="w-32 h-24 shrink-0 rounded-lg overflow-hidden relative bg-slate-100">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                        {art.category} • {art.source}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-2 leading-tight mt-1">
                        {art.title}
                      </h3>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center mt-2">
                      <Clock className="w-3 h-3 mr-1 text-slate-600" />
                      {new Date(art.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending & Main News Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
            {/* Main Left Columns: Categorized News Feed */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between border-b-2 border-red-600 pb-2">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-red-600" /> Latest Feed Stories
                </h2>
                {lastUpdated && (
                  <span className="text-xs text-slate-600">
                    Synced: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gridArticles.map((art) => (
                  <article key={art.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col">
                    <Link href={`/article/${art.slug}`} className="block relative aspect-16/9 bg-slate-100 overflow-hidden">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {art.category}
                      </span>
                    </Link>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                          <span className="font-semibold text-slate-700">{art.source}</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(art.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <Link href={`/article/${art.slug}`}>
                          <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition leading-snug line-clamp-2">
                            {art.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-600 font-medium">By {art.author || art.source}</span>
                        <Link href={`/article/${art.slug}`} className="text-red-600 font-bold hover:underline">
                          Read Full →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Right Sidebar: Trending & Quick Dispatches */}
            <div className="lg:col-span-4 space-y-6">
              {/* Trending Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">
                    Trending Highlights
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {trendingArticles.map((art, index) => (
                    <Link
                      key={art.id}
                      href={`/article/${art.slug}`}
                      className="group flex items-start gap-3 py-3"
                    >
                      <span className="text-2xl font-black text-slate-300 group-hover:text-red-600 transition font-serif w-6">
                        0{index + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-red-600 uppercase">
                          {art.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition leading-tight mt-0.5 line-clamp-2">
                          {art.title}
                        </h4>
                        <span className="text-[10px] text-slate-600 mt-1 block">
                          {art.source} • {new Date(art.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Promo / Info Box */}
              <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl p-5 shadow-sm">
                <h4 className="font-black text-lg uppercase tracking-tight">Prime News Channel</h4>
                <p className="text-xs text-red-100 mt-1.5 leading-relaxed">
                  Fast, automated and verified 24/7 global coverage aggregated directly for <strong>primenewschannel.com</strong>.
                </p>
                <div className="mt-4 pt-3 border-t border-red-500/50 flex justify-between items-center text-xs">
                  <span className="bg-red-900/60 px-2 py-1 rounded font-mono">Live Sync Engine</span>
                  <Link href="/admin" className="font-bold underline hover:text-red-200">
                    Feed Manager →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
