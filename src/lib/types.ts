export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  url: string;
  imageUrl?: string;
  source: string;
  category: 'World' | 'Technology' | 'Business' | 'Sports' | 'General';
  publishedAt: string;
  author?: string;
  isBreaking?: boolean;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: 'World' | 'Technology' | 'Business' | 'Sports' | 'General';
  enabled?: boolean;
}

export interface NewsStoreData {
  articles: Article[];
  lastUpdated: string | null;
  sources: NewsSource[];
}
