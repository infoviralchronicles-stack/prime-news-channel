import { NextResponse } from 'next/server';
import { getStoreData, saveStoreData } from '@/lib/newsEngine';

export async function GET() {
  const store = getStoreData();
  return NextResponse.json({ sources: store.sources });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getStoreData();

    if (body.action === 'add') {
      const newSource = {
        id: 'src-' + Date.now(),
        name: body.name,
        url: body.url,
        category: body.category || 'General',
        enabled: true
      };
      store.sources.push(newSource);
      saveStoreData(store);
      return NextResponse.json({ success: true, sources: store.sources });
    }

    if (body.action === 'delete') {
      store.sources = store.sources.filter(s => s.id !== body.id);
      saveStoreData(store);
      return NextResponse.json({ success: true, sources: store.sources });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
