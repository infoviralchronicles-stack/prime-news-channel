import { NextResponse } from 'next/server';
import { getStoreData } from '@/lib/newsEngine';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const store = getStoreData();
  const article = store.articles.find(a => a.slug === slug || a.id === slug);

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const related = store.articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 4);

  return NextResponse.json({ article, related });
}
