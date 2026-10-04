import { NextResponse } from 'next/server';
import { getStoreData } from '@/lib/newsEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


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

  return NextResponse.json(
    { article, related },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

