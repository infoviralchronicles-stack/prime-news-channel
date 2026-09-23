import { NextResponse } from 'next/server';
import { getStoreData, fetchAndPublishNews } from '@/lib/newsEngine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const author = searchParams.get('author');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const store = getStoreData();
  let filtered = store.articles;

  if (author) {
    const aLower = author.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    filtered = filtered.filter(a => {
      if (!a.author) return false;
      const slug = a.author.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return slug.includes(aLower) || a.author.toLowerCase().includes(author.toLowerCase());
    });
  }

  if (category && category.toLowerCase() !== 'all') {
    const target = category.toLowerCase();
    filtered = filtered.filter(a => {
      const artCat = (a.category || '').toLowerCase();
      if (target === 'health' || target === 'health & science') {
        return artCat.includes('health') || artCat.includes('science');
      }
      return artCat === target;
    });
  }

  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(qLower) || 
      a.summary.toLowerCase().includes(qLower)
    );
  }

  return NextResponse.json({
    articles: filtered.slice(0, limit),
    lastUpdated: store.lastUpdated,
    total: filtered.length
  });
}

export async function POST() {
  try {
    const result = await fetchAndPublishNews();
    return NextResponse.json({
      success: true,
      message: `Successfully aggregated news! ${result.newCount} new articles published.`,
      result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
