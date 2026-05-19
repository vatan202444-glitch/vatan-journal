import { NextRequest } from 'next/server';

const DEFAULT_TOKEN = 'vatan-admin-token';

export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN || DEFAULT_TOKEN;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'admin';
}

export function verifyAdminRequest(request: NextRequest): boolean {
  const expected = getAdminToken();
  const headerToken = request.headers.get('x-admin-token')?.trim();
  const cookieToken = request.cookies.get('adminToken')?.value?.trim();
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '').trim();
  
  const tokens = [headerToken, cookieToken, authHeader].filter(Boolean);
  const isValid = tokens.some(t => t === expected);
  
  if (!isValid) {
    console.log('Auth failed. Expected:', expected, 'Header:', headerToken, 'Cookie:', cookieToken, 'Auth:', authHeader);
  }
  
  return isValid;
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
