import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface PageData { id: string; title: string; content: string; updatedAt?: string; }

export async function GET() {
  const pages = readData<PageData[]>('pages.json', [
    { id: 'about', title: 'Биз ҳақимизда', content: '' },
    { id: 'contact', title: 'Боғланиш', content: '' },
  ]);
  return NextResponse.json(pages);
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const body = await request.json();
  const pages = readData<PageData[]>('pages.json', []);
  const idx = pages.findIndex(p => p.id === body.id);
  const updated = { id: body.id, title: body.title, content: body.content, updatedAt: new Date().toISOString() };
  if (idx >= 0) { pages[idx] = updated; } else { pages.push(updated); }
  writeData('pages.json', pages);
  return NextResponse.json(updated);
}
