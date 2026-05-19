import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface SeoData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  favicon: string;
  googleAnalytics: string;
  robots: string;
}

const defaults: SeoData = {
  title: 'VATAN — Илмий-маърифий журнал',
  description: 'Ўзбекистоннинг илмий-маърифий журнали.',
  keywords: 'vatan, журнал, илмий',
  ogImage: '',
  favicon: '/favicon.ico',
  googleAnalytics: '',
  robots: 'index, follow',
};

export async function GET() {
  const seo = readData<SeoData>('seo.json', defaults);
  return NextResponse.json(seo);
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const body = await request.json();
  writeData('seo.json', { ...defaults, ...body });
  return NextResponse.json({ success: true });
}
