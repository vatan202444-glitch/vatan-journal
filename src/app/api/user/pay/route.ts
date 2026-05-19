import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { ReaderUser } from '../auth/route';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('readerToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await request.json();
  const users = readData<ReaderUser[]>('readers.json', []);
  const userIndex = users.findIndex(u => u.id === token);
  
  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const user = users[userIndex];
  
  // Calculate new expiry date
  let expiry = new Date();
  if (user.premiumUntil && new Date(user.premiumUntil) > new Date()) {
    expiry = new Date(user.premiumUntil);
  }
  
  if (plan === 'monthly') {
    expiry.setMonth(expiry.getMonth() + 1);
  } else if (plan === 'yearly') {
    expiry.setFullYear(expiry.getFullYear() + 1);
  } else {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  users[userIndex].premiumUntil = expiry.toISOString();
  writeData('readers.json', users);

  return NextResponse.json({ success: true, premiumUntil: users[userIndex].premiumUntil });
}
