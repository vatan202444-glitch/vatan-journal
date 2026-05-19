import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = /*turbopackIgnore: true*/ path.join(process.cwd(), 'public', 'uploads');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function scanDir(dir: string, base: string): any[] {
  ensureDir(dir);
  const files: any[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile()) {
        const stat = fs.statSync(fullPath);
        const ext = path.extname(entry.name).toLowerCase();
        const type = ['.jpg','.jpeg','.png','.gif','.webp','.svg'].includes(ext) ? 'image' : ext === '.pdf' ? 'pdf' : 'other';
        files.push({
          name: entry.name,
          path: `/uploads/${path.relative(base, fullPath).replace(/\\/g, '/')}`,
          size: formatSize(stat.size),
          type,
        });
      } else if (entry.isDirectory()) {
        files.push(...scanDir(fullPath, base));
      }
    }
  } catch {}
  return files;
}

export async function GET() {
  const files = scanDir(UPLOAD_DIR, UPLOAD_DIR);
  return NextResponse.json(files);
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const body = await request.json();
  const match = (body.data as string).match(/^data:[^;]+;base64,(.+)$/);
  if (!match) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  ensureDir(UPLOAD_DIR);
  const buffer = Buffer.from(match[1], 'base64');
  const safeName = `${Date.now()}-${body.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = path.join(UPLOAD_DIR, safeName);
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ path: `/uploads/${safeName}`, name: safeName }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  const filePath = new URL(request.url).searchParams.get('path');
  if (!filePath) return NextResponse.json({ error: 'Path required' }, { status: 400 });

  const absPath = /*turbopackIgnore: true*/ path.join(process.cwd(), 'public', filePath);
  if (fs.existsSync(absPath)) {
    fs.unlinkSync(absPath);
  }
  return NextResponse.json({ success: true });
}
