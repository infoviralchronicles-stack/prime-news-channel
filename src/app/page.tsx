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
  const middleColumn = articles.slice(1, 4);
  const rightColumn = articles.slice(4, 7);
  const lowerBroadsheet = articles.slice(7);

  return (
    <div className="space-y-10 py-6">
      {/* Category / Search Filter Indicator */}
      {(query || (currentCategory && currentCategory !== 'All')) && (
        <div className="pb-3 border-b border-black flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline text-[#111111]">
            {query ? `Search: "${query}"` : currentCategory}
          </h2>
          <Link href="/" className="text-xs uppercase tracking-wider font-sans font-bold text-neutral-500 hover:text-black">
            Full Edition Archive →
          </Link>
        </div>
      )}

      {loading ? (
        <div className="py-32 text-center">
          <RefreshCw className="w-8 h-8 text-neutral-900 animate-spin mx-auto mb-3" />
          <p className="font-serif italic text-neutral-600">Gathering dispatches for today's broadsheet...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-24 text-center border border-neutral-300 p-12 bg-[#fafafa]">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-2xl font-headline font-bold">No Dispatches Found</h3>
          <p className="text-sm font-serif text-neutral-600 mt-2">No stories found matching your inquiry.</p>
        </div>
      ) : (
        <>
          {/* Iconic Washington Post 3-Column Newspaper Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-neutral-300 items-start">
            {/* Left Column (Main Lead Story - 6 Cols) */}
            {leadStory && (
              <div className="lg:col-span-6 lg:border-r lg:border-neutral-300 lg:pr-8 group">
                <Link href={`/article/${leadStory.slug}`} className="block">
                  <div className="aspect-16/10 w-full overflow-hidden bg-neutral-100 mb-4">
                    <img
                      src={leadStory.imageUrl}
                      alt={leadStory.title}
                      className="w-full h-full object-cover group-hover:opacity-95 transition"
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#b00] font-sans">
                    {leadStory.category} • Wire Exclusive
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black font-headline text-[#111111] leading-[1.1] mt-2 group-hover:text-[#0056b3] transition">
                    {leadStory.title}
                  </h2>
                  <p className="text-base sm:text-lg font-serif-body text-[#2a2a2a] mt-3.5 leading-relaxed">
                    {leadStory.summary}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-sans text-neutral-500 space-x-2">
                    <span>By <strong>{leadStory.author || leadStory.source}</strong></span>
                    <span>•</span>
                    <span>{new Date(leadStory.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </Link>
              </div>
            )}

            {/* Middle Column (Secondary Top Reports - 3 Cols) */}
            <div className="lg:col-span-3 lg:border-r lg:border-neutral-300 lg:pr-8 flex flex-col space-y-4 divide-y divide-neutral-200">
              {middleColumn.map((art) => (
                <article key={art.id} className="pt-4 first:pt-0 group">
                  <Link href={`/article/${art.slug}`} className="block">
                    <div className="aspect-16/10 w-full overflow-hidden bg-neutral-200 mb-2.5">
                      <img
                        src={art.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                        alt={art.title}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                      {art.category}
                    </span>
                    <h3 className="text-lg font-bold font-headline text-[#111111] leading-snug group-hover:text-[#0056b3] transition mt-1">
                      {art.title}
                    </h3>
                    <p className="text-xs font-serif-body text-neutral-700 mt-2 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                    <div className="mt-2 text-[11px] text-neutral-500 font-sans">
                      {art.source}
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Right Column (Opinion & Analysis / Quick Headlines - 3 Cols) */}
            <div className="lg:col-span-3 flex flex-col space-y-4 divide-y divide-neutral-200">
              <div className="pb-2 border-b-2 border-black">
                <h3 className="text-xs font-bold uppercase tracking-widest font-sans text-neutral-900">
                  Opinions &amp; Analysis
                </h3>
              </div>
              {rightColumn.map((art) => (
                <article key={art.id} className="pt-4 first:pt-0 group">
                  <Link href={`/article/${art.slug}`} className="block">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#b00] font-sans">
                      {art.category} • Analysis
                    </span>
                    <h4 className="text-base font-bold font-headline text-[#111111] leading-snug group-hover:text-[#0056b3] transition mt-1">
                      {art.title}
                    </h4>
                    <p className="text-xs font-serif-body text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                    <div className="mt-2 text-[11px] text-neutral-500 font-sans">
                      By <strong>{art.author || art.source}</strong>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* Lower Broadsheet: 4-Column Horizontal News Grid */}
          {lowerBroadsheet.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <h3 className="text-xl font-bold font-headline text-[#111111] uppercase tracking-tight">
                  Comprehensive News Index
                </h3>
                <span className="text-xs font-sans text-neutral-500">Autonomous Wire Aggregation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {lowerBroadsheet.map((art) => (
                  <article key={art.id} className="group border-b border-neutral-200 pb-6 flex flex-col justify-between">
                    <Link href={`/article/${art.slug}`} className="block">
                      <div className="aspect-16/10 overflow-hidden bg-neutral-100 mb-3">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-sans">
                        {art.category}
                      </span>
                      <h4 className="text-base font-bold font-headline text-[#111111] group-hover:text-[#0056b3] transition mt-1 line-clamp-3 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-xs font-serif-body text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </Link>
                    <div className="mt-3 pt-2 border-t border-neutral-100 text-[11px] text-neutral-400 font-sans flex justify-between">
                      <span>{art.source}</span>
                      <span>{new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
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
