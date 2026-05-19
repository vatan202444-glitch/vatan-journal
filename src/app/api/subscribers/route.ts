import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Subscriber { id: string; email: string; name?: string; subscribedAt: string; status: 'active' | 'unsubscribed'; }

export async function GET() {
  const subs = readData<Subscriber[]>('subscribers.json', []);
  return NextResponse.json(subs);
}

export async function POST(request: NextRequest) {
  // Allow both admin and public subscription
  const body = await request.json();
  const subs = readData<Subscriber[]>('subscribers.json', []);

  // Check duplicate
  if (subs.find(s => s.email === body.email)) {
    return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
  }

  const newSub: Subscriber = {
    id: `sub-${Date.now()}`,
    email: body.email,
    name: body.name || '',
    subscribedAt: new Date().toISOString(),
    status: 'active',
  };
  subs.unshift(newSub);
  writeData('subscribers.json', subs);
  return NextResponse.json(newSub, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const body = await request.json();
  const subs = readData<Subscriber[]>('subscribers.json', []);
  const idx = subs.findIndex(s => s.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  subs[idx] = { ...subs[idx], ...body };
  writeData('subscribers.json', subs);
  return NextResponse.json(subs[idx]);
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const subs = readData<Subscriber[]>('subscribers.json', []);
  writeData('subscribers.json', subs.filter(s => s.id !== id));
  return NextResponse.json({ success: true });
}
