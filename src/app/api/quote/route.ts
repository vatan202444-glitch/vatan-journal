import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export interface QuoteSettings {
  text: string;
  author: string;
}

const defaultQuote: QuoteSettings = {
  text: 'Жаҳон илм-фани ва маданиятига улкан ҳисса қўшган ўзбек халқининг ўзига хос улфатлари...',
  author: 'Шавкат Мирзиёев',
};

export async function GET() {
  try {
    const quote = readData<QuoteSettings>('quote.json', defaultQuote);
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = (await request.json()) as Partial<QuoteSettings>;
    const current = readData<QuoteSettings>('quote.json', defaultQuote);
    const updated: QuoteSettings = {
      text: body.text ?? current.text,
      author: body.author ?? current.author,
    };
    writeData('quote.json', updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 });
  }
}
