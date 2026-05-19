import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export interface ReaderUser {
  id: string;
  phone: string;
  name: string;
  passwordHash: string;
  premiumUntil: string | null; // ISO string if active, null if not
  createdAt: string;
}

export async function GET(request: NextRequest) {
  // Check token (using a simple mock token in cookies: readerToken=userId)
  const token = request.cookies.get('readerToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = readData<ReaderUser[]>('readers.json', []);
  const user = users.find(u => u.id === token);
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { passwordHash, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, phone, password, name } = body;
  const users = readData<ReaderUser[]>('readers.json', []);

  if (action === 'register') {
    if (users.find(u => u.phone === phone)) {
      return NextResponse.json({ error: 'Бу рақам аллақачон рўйхатдан ўтган' }, { status: 400 });
    }
    const newUser: ReaderUser = {
      id: `reader-${Date.now()}`,
      phone,
      name: name || 'Фойдаланувчи',
      passwordHash: password, // NOT SECURE for real prod, but fine for this mock DB
      premiumUntil: null,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeData('readers.json', users);

    const res = NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, phone: newUser.phone, premiumUntil: null } });
    res.cookies.set('readerToken', newUser.id, { path: '/', maxAge: 60*60*24*30 });
    return res;
  }

  if (action === 'login') {
    const user = users.find(u => u.phone === phone && u.passwordHash === password);
    if (!user) {
      return NextResponse.json({ error: 'Рақам ёки парол нотўғри' }, { status: 401 });
    }
    const { passwordHash, ...safeUser } = user;
    const res = NextResponse.json({ success: true, user: safeUser });
    res.cookies.set('readerToken', user.id, { path: '/', maxAge: 60*60*24*30 });
    return res;
  }

  if (action === 'logout') {
    const res = NextResponse.json({ success: true });
    res.cookies.delete('readerToken');
    return res;
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
