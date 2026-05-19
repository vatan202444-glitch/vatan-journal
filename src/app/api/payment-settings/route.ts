import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export interface PaymentSettings {
  cardNumber: string;
  cardOwner: string;
  bankName: string;
}

const defaults: PaymentSettings = {
  cardNumber: '8600 1234 5678 9012',
  cardOwner: 'VATAN JURNALI',
  bankName: 'Uzcard / Humo',
};

export async function GET() {
  const settings = readData<PaymentSettings>('payment-settings.json', defaults);
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    writeData('payment-settings.json', { ...defaults, ...body });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update payment settings' }, { status: 500 });
  }
}
