"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, Share2, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import { Article } from '@/lib/types';

/**
 * Parses markdown into beautiful, semantic HTML elements (h2, h3, bold, lists, paragraphs)
 * eliminating raw '###' or '**' artifacts completely.
 */
function renderFormattedContent(rawContent: string) {
  if (!rawContent) return null;

  // Split by double newlines into blocks
  const blocks = rawContent.split(/\n\n+/);

  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Check for H2 or H3 (strips '###', '##', and any Roman numerals like 'III. ' or numbers '1. ')
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      const cleanHeading = trimmed
        .replace(/^###?\s+/, '')
        .replace(/^[IVXLCDM]+\.\s*/i, '')
        .replace(/^\d+\.\s*/, '')
        .trim();

      return (
        <h2
          key={index}
          className="text-2xl sm:text-3xl font-bold font-headline text-[#111111] pt-6 pb-2 border-b border-neutral-300 mt-6 tracking-tight"
        >
          {cleanHeading}
        </h2>
      );
    }

    // Numbered list item
    if (/^\d+\.\s+\*\*/.test(trimmed)) {
      const lines = trimmed.split('\n');
      return (
        <div key={index} className="space-y-3 pl-2 sm:pl-4 my-4">
          {lines.map((line, lIdx) => {
            const parsedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
              <div
                key={lIdx}
                className="font-serif-body text-base sm:text-lg leading-[1.8] text-neutral-800"
                dangerouslySetInnerHTML={{ __html: parsedLine }}
              />
            );
          })}
        </div>
      );
    }

    // Bullet list item
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n');
      return (
        <ul key={index} className="list-disc list-inside space-y-2 my-4 pl-2 font-serif-body text-base sm:text-lg text-neutral-800">
          {items.map((item, iIdx) => (
            <li key={iIdx} className="leading-relaxed">
              {item.replace(/^-+\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }

    // Standard Paragraph with inline bold parsing
    const formattedParagraph = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return (
      <p
        key={index}
        className="font-serif-body text-base sm:text-lg text-neutral-800 leading-[1.8] my-4"
        dangerouslySetInnerHTML={{ __html: formattedParagraph }}
      />
    );
  });
}

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
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-serif italic text-neutral-600 text-sm">Opening article record...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-24 text-center border border-neutral-300 p-8 max-w-xl mx-auto my-12 bg-[#fafafa]">
        <h2 className="text-2xl font-bold font-headline text-[#111111]">Article Record Not Found</h2>
        <p className="text-xs font-serif text-neutral-600 mt-2 mb-6">This document may have been archived or re-filed.</p>
        <Link href="/" className="inline-flex items-center text-xs uppercase font-sans font-bold bg-black text-white px-4 py-2 hover:bg-neutral-800">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to Front Page
        </Link>
      </div>
    );
  }

  // Structured Data Schema for Google News SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: [
      {
        '@type': 'Person',
        name: article.author || article.source,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Prime News Channel',
      logo: {
        '@type': 'ImageObject',
        url: 'https://primenewschannel.com/icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://primenewschannel.com/article/${article.slug}`,
    },
  };

  return (
    <article className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Schema.org JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumbs & Category Tag */}
      <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs uppercase tracking-wider font-sans font-bold text-neutral-600 hover:text-black">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Prime News Channel
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-[#b00] font-sans">
          {article.category}
        </span>
      </div>

      {/* SEO Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-headline text-[#111111] leading-[1.15]">
        {article.title}
      </h1>

      {/* Summary Deck */}
      <p className="text-lg sm:text-xl font-serif text-neutral-700 leading-relaxed italic border-l-3 border-black pl-4">
        {article.summary}
      </p>

      {/* Author & Publishing Bylines */}
      <div className="flex flex-wrap items-center justify-between text-xs font-sans text-neutral-600 py-3 border-t border-b border-neutral-200 gap-2">
        <div>
          <span>Reported by <strong className="text-black">{article.author || article.source}</strong></span>
          <span className="mx-2">•</span>
          <span>
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
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
          className="flex items-center space-x-1 font-bold text-neutral-800 hover:text-[#0056b3] cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Article</span>
        </button>
      </div>

      {/* Editorial Featured Media */}
      {article.imageUrl && (
        <figure className="space-y-2">
          <div className="aspect-16/10 overflow-hidden bg-neutral-100">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="text-[11px] font-sans text-neutral-500 italic text-right">
            Editorial Wire Photo • Source: {article.source}
          </figcaption>
        </figure>
      )}

      {/* Formatted Broadsheet Content (Clean Semantic HTML) */}
      <div className="pt-2 max-w-3xl">
        {renderFormattedContent(article.content)}

        {/* Verification & Syndicate Footnote */}
        <div className="mt-12 pt-6 border-t border-neutral-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f9f9f9] p-5">
          <div>
            <div className="flex items-center text-xs font-bold font-sans text-neutral-900 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-neutral-900 mr-1.5" />
              Verified Feed Distribution
            </div>
            <p className="text-xs font-serif text-neutral-600 mt-1">
              Autonomous publication on Prime News Channel (primenewschannel.com). Source wire: {article.source}.
            </p>
          </div>
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-black hover:bg-neutral-800 text-white text-xs font-sans font-bold px-4 py-2 transition"
            >
              Original Source <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          )}
        </div>
      </div>

      {/* Related Dispatches */}
      {related.length > 0 && (
        <div className="pt-10 border-t-2 border-black space-y-4">
          <h3 className="text-lg font-bold font-headline uppercase text-neutral-900">
            Related Dispatches in {article.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.slug}`}
                className="group flex gap-4 p-3 border border-neutral-200 hover:border-black transition bg-white"
              >
                <div className="w-28 h-20 shrink-0 bg-neutral-100 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold font-headline text-[#111111] group-hover:text-[#0056b3] transition line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-neutral-500 font-sans mt-2 block">
                    {new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
