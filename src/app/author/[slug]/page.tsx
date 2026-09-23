"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Award, BookOpen, Share2 } from 'lucide-react';
import { Article } from '@/lib/types';
import { getAuthorProfile, AuthorProfile } from '@/lib/authors';

export default function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prof = getAuthorProfile(slug);
    setProfile(prof);
    loadAuthorArticles(slug, prof.name);
  }, [slug]);

  const loadAuthorArticles = async (authorSlug: string, authorName: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?author=${encodeURIComponent(authorSlug)}&limit=30`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold font-headline">Correspondent Record Not Found</h2>
        <Link href="/" className="mt-4 inline-block text-xs uppercase font-bold text-[#b00]">
          ← Back to Front Page
        </Link>
      </div>
    );
  }

  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.role,
      description: profile.bio,
      image: profile.avatar,
      worksFor: {
        '@type': 'NewsMediaOrganization',
        name: 'Prime News Channel',
        url: 'https://primenewschannel.com',
      },
      url: `https://primenewschannel.com/author/${profile.slug}`,
    },
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Dynamic SEO Meta Title and Open Graph */}
      <title>{`${profile.name} - ${profile.role} | Prime News Channel`}</title>
      <meta name="description" content={profile.bio} />
      <meta property="og:title" content={`${profile.name} | Prime News Channel`} />
      <meta property="og:description" content={profile.bio} />
      <meta property="og:image" content={profile.avatar} />
      <meta property="og:url" content={`https://primenewschannel.com/author/${profile.slug}`} />
      <link rel="canonical" href={`https://primenewschannel.com/author/${profile.slug}`} />

      {/* Schema.org JSON-LD ProfilePage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      {/* Breadcrumb Navigation */}
      <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs uppercase tracking-wider font-sans font-bold text-neutral-600 hover:text-black"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to Front Page
        </Link>
        <span className="text-[11px] uppercase tracking-widest font-mono text-neutral-500">
          Newsroom Editorial Dossier
        </span>
      </div>

      {/* Author Header Card */}
      <div className="bg-[#fcfcfc] border border-neutral-300 p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Avatar Photo */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shrink-0 border-2 border-neutral-900 shadow-md">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-3xl sm:text-4xl font-black font-headline text-[#111111]">
                {profile.name}
              </h1>
              <span className="inline-flex items-center text-xs font-sans font-bold text-[#b00] uppercase tracking-wider bg-neutral-100 px-2.5 py-1 border border-neutral-200 self-center sm:self-auto">
                {profile.beat}
              </span>
            </div>

            <p className="text-sm font-bold uppercase tracking-wide font-sans text-neutral-700">
              {profile.role}
            </p>

            <p className="text-sm sm:text-base font-serif-body text-neutral-800 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* Meta tags / Credentials */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-sans text-neutral-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {profile.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-neutral-500" />
                {profile.credentials}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Published Works Section Header */}
      <div className="border-b-2 border-black pb-2 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black font-headline text-[#111111] uppercase tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#b00]" />
          Dispatches by {profile.name}
        </h2>
        <span className="text-xs font-sans text-neutral-500 font-bold">
          {articles.length} Published {articles.length === 1 ? 'Dispatch' : 'Dispatches'}
        </span>
      </div>

      {/* Articles Feed */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-serif italic text-neutral-500">Loading correspondent articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center bg-neutral-50 border border-neutral-200 p-8">
          <p className="text-sm font-serif text-neutral-600">No dispatches currently listed for this correspondent.</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200">
          {articles.map((item) => (
            <article key={item.id} className="py-6 first:pt-2 group">
              <Link href={`/article/${item.slug}`} className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[11px] font-sans font-bold uppercase tracking-wider text-[#b00]">
                    <span>{item.category}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500 font-normal">
                      {new Date(item.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-headline text-[#111111] group-hover:text-[#0056b3] transition mt-1 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm font-serif-body text-neutral-700 mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-3 flex items-center text-xs font-sans text-neutral-500 space-x-2">
                    <span className="inline-flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-neutral-400" />
                      {Math.max(1, Math.ceil((item.content ? item.content.split(/\s+/).filter(Boolean).length : 1050) / 200))} min read
                    </span>
                    <span>•</span>
                    <span className="text-[#0056b3] font-medium group-hover:underline">
                      Read Complete Dispatch →
                    </span>
                  </div>
                </div>

                {item.imageUrl && (
                  <div className="w-full sm:w-48 aspect-16/10 overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
