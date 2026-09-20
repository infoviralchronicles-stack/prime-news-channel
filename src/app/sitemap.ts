import { MetadataRoute } from 'next';
import { getStoreData } from '@/lib/newsEngine';

export default function sitemap(): MetadataRoute.Sitemap {
  const store = getStoreData();
  const baseUrl = 'https://primenewschannel.com';

  const articleEntries: MetadataRoute.Sitemap = store.articles.map((art) => ({
    url: `${baseUrl}/article/${art.slug}`,
    lastModified: new Date(art.publishedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?category=World`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/?category=Business`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/?category=Technology`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/?category=Sports`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...articleEntries,
  ];
}
