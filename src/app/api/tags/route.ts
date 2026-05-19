import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Tag { id: string; name: string; slug: string; articleCount: number; color: string; }

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function GET() {
  const tags = readData<Tag[]>('tags.json', []);
  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const body = await request.json();
  const tags = readData<Tag[]>('tags.json', []);
  const newTag: Tag = { id: `tag-${Date.now()}`, name: body.name, slug: slugify(body.name), articleCount: 0, color: body.color || '#1e3a8a' };
  tags.push(newTag);
  writeData('tags.json', tags);
  return NextResponse.json(newTag, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const body = await request.json();
  const tags = readData<Tag[]>('tags.json', []);
  const idx = tags.findIndex(t => t.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  tags[idx] = { ...tags[idx], name: body.name, slug: slugify(body.name), color: body.color || tags[idx].color };
  writeData('tags.json', tags);
  return NextResponse.json(tags[idx]);
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const tags = readData<Tag[]>('tags.json', []);
  writeData('tags.json', tags.filter(t => t.id !== id));
  return NextResponse.json({ success: true });
}
