import { MetadataRoute } from 'next';
import { getStoreData } from '@/lib/newsEngine';
import { AUTHORS_DATA } from '@/lib/authors';

export default function sitemap(): MetadataRoute.Sitemap {
  const store = getStoreData();
  const baseUrl = 'https://primenewschannel.com';

  const articleEntries: MetadataRoute.Sitemap = store.articles.map((art) => ({
    url: `${baseUrl}/article/${art.slug}`,
    lastModified: new Date(art.publishedAt),
    changeFrequency: 'hourly',
    priority: 0.9,
  }));

  const authorEntries: MetadataRoute.Sitemap = Object.keys(AUTHORS_DATA).map((slug) => ({
    url: `${baseUrl}/author/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?category=World`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/?category=Business`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/?category=Technology`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/?category=Sports`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  return [...staticPages, ...authorEntries, ...articleEntries];
}
