"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Clock, AlertCircle, RefreshCw } from 'lucide-react';
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
      setArticles(data.articles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const leadStory = articles[0];
  const sideStories = articles.slice(1, 4);
  const secondaryStories = articles.slice(4, 8);
  const gridStories = articles.slice(8);

  return (
    <div className="space-y-10 py-6">
      {/* Search / Category filter indicator */}
      {(query || (currentCategory && currentCategory !== 'All')) && (
        <div className="pb-4 border-b-2 border-black flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tight text-[#141414] uppercase">
            {query ? `Search Results: "${query}"` : currentCategory}
          </h1>
          <Link href="/" className="text-sm font-bold text-[#bb1919] hover:underline">
            View All Stories →
          </Link>
        </div>
      )}

      {loading ? (
        <div className="py-32 text-center">
          <RefreshCw className="w-10 h-10 text-[#bb1919] animate-spin mx-auto mb-4" />
          <p className="text-base font-bold text-neutral-600">Loading BBC Prime stories...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-24 text-center bg-[#f6f6f6] border border-[#e6e6e6] p-12">
          <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-[#141414]">No Stories Found</h2>
          <p className="text-sm text-neutral-600 mt-2">Please check back later or refresh feeds.</p>
        </div>
      ) : (
        <>
          {/* Main BBC Hero Section - Big Wide Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#e6e6e6]">
            {/* Left Col: Massive BBC Lead Story */}
            {leadStory && (
              <div className="lg:col-span-8 group">
                <Link href={`/article/${leadStory.slug}`} className="block">
                  <div className="aspect-16/9 w-full overflow-hidden bg-neutral-100 mb-5">
                    <img
                      src={leadStory.imageUrl}
                      alt={leadStory.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#141414] leading-tight group-hover:underline decoration-[#bb1919] decoration-3">
                    {leadStory.title}
                  </h2>
                  <p className="text-base sm:text-lg text-neutral-700 mt-4 leading-relaxed max-w-4xl">
                    {leadStory.summary}
                  </p>
                  <div className="flex items-center text-sm text-neutral-500 font-semibold mt-5 space-x-4">
                    <span className="flex items-center text-neutral-600">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {new Date(leadStory.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>|</span>
                    <span className="text-[#bb1919] font-bold uppercase">{leadStory.category}</span>
                    <span>|</span>
                    <span>{leadStory.source}</span>
                  </div>
                </Link>
              </div>
            )}

            {/* Right Col: 3 BBC Stacked Stories with Clean Dividers */}
            <div className="lg:col-span-4 flex flex-col justify-between divide-y divide-[#e6e6e6] space-y-2">
              {sideStories.map((art) => (
                <article key={art.id} className="py-5 first:pt-0 last:pb-0 group">
                  <Link href={`/article/${art.slug}`} className="block">
                    <div className="aspect-16/10 w-full overflow-hidden bg-neutral-100 mb-3 sm:hidden">
                      <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#141414] leading-snug group-hover:underline decoration-[#bb1919]">
                      {art.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                    <div className="flex items-center text-xs text-neutral-500 font-semibold mt-3 space-x-2">
                      <span className="text-[#bb1919] font-bold uppercase">{art.category}</span>
                      <span>•</span>
                      <span>{art.source}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* BBC 4-Column Horizontal Cards Section */}
          {secondaryStories.length > 0 && (
            <div className="pb-12 border-b border-[#e6e6e6]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {secondaryStories.map((art) => (
                  <article key={art.id} className="group">
                    <Link href={`/article/${art.slug}`} className="block">
                      <div className="aspect-16/10 overflow-hidden bg-neutral-100 mb-4">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#141414] leading-snug group-hover:underline decoration-[#bb1919] line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                      <div className="flex items-center text-xs text-neutral-500 font-semibold mt-3 space-x-2">
                        <span className="text-[#bb1919] font-bold uppercase">{art.category}</span>
                        <span>•</span>
                        <span>{new Date(art.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* More Stories Grid */}
          {gridStories.length > 0 && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-2">
                <h3 className="text-xl font-black uppercase text-[#141414]">More Top Stories</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridStories.map((art) => (
                  <article key={art.id} className="group border-b border-[#e6e6e6] pb-6">
                    <Link href={`/article/${art.slug}`} className="block">
                      <div className="aspect-16/9 overflow-hidden bg-neutral-100 mb-4">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <h4 className="text-lg font-black text-[#141414] group-hover:underline decoration-[#bb1919] line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-sm text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                      <span className="inline-block text-xs font-bold text-[#bb1919] uppercase mt-3">
                        {art.category} • {art.source}
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
