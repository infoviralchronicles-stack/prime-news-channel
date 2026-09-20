import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { Article, NewsSource, NewsStoreData } from './types';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'newsStore.json');

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['dc:creator', 'creator']
    ],
  },
});

export function getStoreData(): NewsStoreData {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const initial: NewsStoreData = {
        articles: [],
        lastUpdated: null,
        sources: [
          { id: "bbc-world", name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "World" },
          { id: "bbc-tech", name: "BBC Tech", url: "https://feeds.bbci.co.uk/news/technology/rss.xml", category: "Technology" },
          { id: "bbc-biz", name: "BBC Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml", category: "Business" },
          { id: "techcrunch", name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "Technology" },
          { id: "espn-sports", name: "ESPN Sports", url: "https://www.espn.com/espn/rss/news", category: "Sports" },
          { id: "aljazeera", name: "Al Jazeera English", url: "https://www.aljazeera.com/xml/rss/all.xml", category: "World" }
        ]
      };
      fs.writeFileSync(dataFilePath, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading news store:', error);
    return { articles: [], lastUpdated: null, sources: [] };
  }
}

export function saveStoreData(data: NewsStoreData) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving news store:', error);
  }
}

function cleanHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 100);
}

function extractImage(item: any): string | undefined {
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }
  if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }
  if (item.enclosure && item.enclosure.url && (item.enclosure.type?.includes('image') || item.enclosure.url.match(/\.(jpeg|jpg|gif|png|webp)/i))) {
    return item.enclosure.url;
  }
  // Check img tags inside description or content
  const htmlToSearch = (item.contentEncoded || '') + ' ' + (item.description || '') + ' ' + (item.content || '');
  const match = htmlToSearch.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1];
  }
  return undefined;
}

export async function fetchAndPublishNews(): Promise<{ newCount: number; totalCount: number }> {
  const store = getStoreData();
  const existingUrls = new Set(store.articles.map(a => a.url));
  const existingIds = new Set(store.articles.map(a => a.id));

  const newArticles: Article[] = [];

  for (const source of store.sources) {
    if (source.enabled === false) continue;
    try {
      const feed = await parser.parseURL(source.url);
      if (!feed.items) continue;

      for (const item of feed.items) {
        const itemUrl = item.link || item.guid || '';
        if (!itemUrl || existingUrls.has(itemUrl)) {
          continue;
        }

        const title = item.title?.trim() || '';
        if (!title) continue;

        const summary = cleanHtml(item.contentSnippet || item.description || item.content || '');
        const content = cleanHtml(item.contentEncoded || item.content || item.description || summary);
        const imageUrl = extractImage(item);
        const publishedDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const baseSlug = slugify(title);
        const id = 'pnc-' + Math.random().toString(36).substring(2, 9);
        const slug = `${baseSlug}-${id}`;

        const article: Article = {
          id,
          title,
          slug,
          summary: summary.length > 250 ? summary.substring(0, 247) + '...' : summary,
          content: content || summary,
          url: itemUrl,
          imageUrl: imageUrl || `https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80`,
          source: source.name,
          category: source.category,
          publishedAt: publishedDate,
          author: item.creator || source.name,
          isBreaking: false
        };

        newArticles.push(article);
        existingUrls.add(itemUrl);
        existingIds.add(id);
      }
    } catch (err) {
      console.error(`Failed to fetch feed from ${source.name} (${source.url}):`, err);
    }
  }

  // Combine and sort by publishedAt descending
  const updatedList = [...newArticles, ...store.articles];
  updatedList.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Mark latest 3 articles as Breaking
  updatedList.forEach((art, idx) => {
    art.isBreaking = idx < 3;
  });

  // Keep latest 250 articles to avoid memory bloat
  const finalArticles = updatedList.slice(0, 250);

  store.articles = finalArticles;
  store.lastUpdated = new Date().toISOString();
  saveStoreData(store);

  return {
    newCount: newArticles.length,
    totalCount: store.articles.length
  };
}
