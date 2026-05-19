import { NextRequest, NextResponse } from 'next/server';
import { getAdminPassword, getAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (username !== 'admin' || password !== getAdminPassword()) {
      return NextResponse.json({ error: 'Логин ёки пароль нотўғри' }, { status: 401 });
    }
    const token = getAdminToken();
    const response = NextResponse.json({ success: true, token });
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
