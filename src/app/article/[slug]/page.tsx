import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { getStoreData } from '@/lib/newsEngine';
import { getAuthorSlug, getAuthorProfile } from '@/lib/authors';
import ShareButton from '@/components/ShareButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Server-Side Dynamic Metadata for Google Search, Google News & Discover
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const store = getStoreData();
  const article = store.articles.find(a => a.slug === slug || a.id === slug);

  if (!article) {
    return {
      title: 'Article Not Found | Prime News Channel',
      description: 'The requested news article could not be located.',
    };
  }

  const canonicalUrl = `https://primenewschannel.com/article/${article.slug}`;

  return {
    title: `${article.title} | Prime News Channel`,
    description: article.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: canonicalUrl,
      siteName: 'Prime News Channel',
      images: [
        {
          url: article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
          width: 1200,
          height: 800,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author || 'Prime News Wire'],
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Semantic HTML renderer supporting H1, H2, H3, H4 headings cleanly
 */
function renderFormattedContent(rawContent: string) {
  if (!rawContent) return null;

  const rawLines = rawContent.split('\n');
  const blocks: string[] = [];
  let currentGroup: string[] = [];

  const flushGroup = () => {
    if (currentGroup.length > 0) {
      blocks.push(currentGroup.join('\n'));
      currentGroup = [];
    }
  };

  const isListItem = (line: string) => /^(\*|\-|\d+\.)\s+(\*\*)?/.test(line.trim());
  const isHeading = (line: string) => /^#{1,4}\s+|^<h[1-4][^>]*>/i.test(line.trim());
  const isQuote = (line: string) => line.trim().startsWith('> ');

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushGroup();
      continue;
    }

    if (isHeading(trimmed) || isQuote(trimmed)) {
      flushGroup();
      blocks.push(trimmed);
    } else if (isListItem(trimmed)) {
      if (currentGroup.length > 0 && !isListItem(currentGroup[0])) {
        flushGroup();
      }
      currentGroup.push(line);
    } else {
      if (currentGroup.length > 0 && isListItem(currentGroup[0])) {
        flushGroup();
      }
      currentGroup.push(line);
    }
  }
  flushGroup();

  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    const cleanHeadingText = (text: string) => {
      return text
        .replace(/^<h[1-6][^>]*>/i, '')
        .replace(/<\/h[1-6]>$/i, '')
        .replace(/^#+\s*/, '')
        .replace(/^[IVXLCDM]+\.\s*/i, '')
        .replace(/^\d+\.\s*/, '')
        .trim();
    };

    if (trimmed.startsWith('# ') || /^<h1[^>]*>/i.test(trimmed)) {
      return (
        <h1
          key={index}
          className="text-3xl sm:text-4xl font-black font-headline text-[#111111] pt-8 pb-3 mt-8 border-b-2 border-black tracking-tight"
        >
          {cleanHeadingText(trimmed)}
        </h1>
      );
    }

    if (trimmed.startsWith('## ') || /^<h2[^>]*>/i.test(trimmed)) {
      return (
        <h2
          key={index}
          className="text-2xl sm:text-3xl font-bold font-headline text-[#111111] pt-8 pb-3 mt-8 border-b border-neutral-300 tracking-tight"
        >
          {cleanHeadingText(trimmed)}
        </h2>
      );
    }

    if (trimmed.startsWith('### ') || /^<h3[^>]*>/i.test(trimmed)) {
      return (
        <h3
          key={index}
          className="text-xl sm:text-2xl font-bold font-headline text-[#222222] pt-6 pb-2 mt-6 tracking-tight"
        >
          {cleanHeadingText(trimmed)}
        </h3>
      );
    }

    if (trimmed.startsWith('#### ') || /^<h4[^>]*>/i.test(trimmed)) {
      return (
        <h4
          key={index}
          className="text-lg sm:text-xl font-bold font-headline text-neutral-800 pt-4 pb-1 mt-4 tracking-normal"
        >
          {cleanHeadingText(trimmed)}
        </h4>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n');
      return (
        <ul key={index} className="my-6 space-y-2.5 list-disc list-inside pl-2 font-serif-body text-base sm:text-lg text-neutral-800">
          {items.map((item, iIdx) => {
            const cleanItem = item.replace(/^[\*\-]\s*/, '');
            const parsedItem = cleanItem.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black font-semibold">$1</strong>');
            return (
              <li
                key={iIdx}
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: parsedItem }}
              />
            );
          })}
        </ul>
      );
    }

    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      return (
        <figure key={index} className="my-8 py-4 px-6 sm:px-8 border-l-4 border-black text-[#111111] bg-neutral-50">
          <blockquote className="font-headline text-xl sm:text-2xl font-bold leading-snug italic">
            "{quoteText}"
          </blockquote>
        </figure>
      );
    }

    const formatInlineMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-black font-semibold">$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-black font-semibold underline decoration-neutral-400 underline-offset-4 hover:decoration-black hover:text-[#990000] transition-colors">$1</a>');
    };

    const cleanParagraph = trimmed.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '');
    const formattedParagraph = formatInlineMarkdown(cleanParagraph);
    return (
      <p
        key={index}
        className="font-serif-body text-base sm:text-[1.125rem] text-neutral-800 leading-[1.85] my-5"
        dangerouslySetInnerHTML={{ __html: formattedParagraph }}
      />
    );
  });
}

/**
 * High-Performance Server-Side Rendered (SSR) Article Component
 * Generates 100% pre-rendered HTML for Googlebot and instant indexing.
 */
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const store = getStoreData();
  const article = store.articles.find(a => a.slug === slug || a.id === slug);

  if (!article) {
    notFound();
  }

  const related = store.articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 4);

  const authorSlug = getAuthorSlug(article.author || 'Jonathan Vance');
  const authorProfile = getAuthorProfile(authorSlug);

  // Structured Data Schema for Google Search, Google News & Discover
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://primenewschannel.com/article/${article.slug}`,
    },
    headline: article.title,
    description: article.summary,
    image: [
      article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    ],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: article.category,
    inLanguage: 'en-US',
    wordCount: article.content ? article.content.split(/\s+/).length : 1100,
    author: [
      {
        '@type': 'Person',
        name: authorProfile.name,
        jobTitle: authorProfile.role,
        url: `https://primenewschannel.com/author/${authorProfile.slug}`,
      },
    ],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Prime News Channel',
      url: 'https://primenewschannel.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://primenewschannel.com/favicon.svg',
        width: 64,
        height: 64,
      },
    },
    isAccessibleForFree: true,
  };

  return (
    <article className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Schema.org JSON-LD Pre-rendered for Search Engines */}
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

      {/* Author & Publishing Bylines with Reading Time & Word Count */}
      <div className="flex flex-wrap items-center justify-between text-xs font-sans text-neutral-600 py-3.5 border-t border-b border-neutral-300 gap-3">
        <div className="flex flex-wrap items-center gap-y-1">
          <span>
            Reported by{' '}
            {article.author ? (
              <Link
                href={`/author/${getAuthorSlug(article.author)}`}
                className="text-black font-bold hover:text-[#0056b3] hover:underline transition"
              >
                {article.author}
              </Link>
            ) : (
              <strong className="text-black font-semibold">{article.source}</strong>
            )}
          </span>
          <span className="mx-2 text-neutral-400">•</span>
          <span>
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="mx-2 text-neutral-400">•</span>
          <span className="inline-flex items-center bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-[11px] font-medium border border-neutral-200">
            <Clock className="w-3 h-3 mr-1 text-neutral-500" />
            {Math.max(1, Math.ceil((article.content ? article.content.split(/\s+/).filter(Boolean).length : 1050) / 200))} min read ({article.content ? article.content.split(/\s+/).filter(Boolean).length.toLocaleString() : '1,050'} words)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 font-bold text-xs bg-neutral-900 text-white px-2.5 py-1 rounded hover:bg-black transition"
              title="View Original Source Article"
            >
              <span>Source Link</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}
          <ShareButton title={article.title} />
        </div>
      </div>

      {/* Editorial Featured Media */}
      {article.imageUrl && (
        <figure className="space-y-2">
          <div className="aspect-16/10 overflow-hidden bg-neutral-100 border border-neutral-200">
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

      {/* Formatted Broadsheet Content (Pre-rendered for Google Search) */}
      <div className="pt-2 max-w-3xl">
        {renderFormattedContent(article.content)}

        {/* Correspondent Profile Bio Card */}
        {article.author && (() => {
          const authorProf = getAuthorProfile(article.author);
          return (
            <div className="my-10 p-6 bg-[#fbfbfb] border border-neutral-300 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <Link href={`/author/${authorProf.slug}`} className="shrink-0 group">
                <img
                  src={authorProf.avatar}
                  alt={authorProf.name}
                  className="w-20 h-20 rounded-full object-cover border border-neutral-400 group-hover:border-black transition shadow-sm"
                />
              </Link>
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <Link
                    href={`/author/${authorProf.slug}`}
                    className="font-headline font-bold text-lg sm:text-xl text-[#111111] hover:text-[#0056b3] transition"
                  >
                    About {authorProf.name}
                  </Link>
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#b00]">
                    {authorProf.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-serif-body text-neutral-700 leading-relaxed">
                  {authorProf.bio}
                </p>
                <div className="pt-1">
                  <Link
                    href={`/author/${authorProf.slug}`}
                    className="text-xs font-sans font-bold text-neutral-900 hover:text-[#0056b3] hover:underline"
                  >
                    View All Dispatches by {authorProf.name} →
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}

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
