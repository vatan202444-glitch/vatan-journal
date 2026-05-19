import fs from 'fs';
import path from 'path';
import type { Issue } from '@/data/issues';

const UPLOAD_BASE = /*turbopackIgnore: true*/ path.join(process.cwd(), 'public', 'uploads');
const ISSUES_UPLOAD_DIR = path.join(UPLOAD_BASE, 'issues');
const HOMEPAGE_UPLOAD_DIR = UPLOAD_BASE;

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Base64 data URL ni public/uploads/ ga файл қилиб сақлайди */
export function persistCoverImage(
  coverImage: string | undefined,
  id: string,
  subDir: 'issues' | 'homepage' = 'issues'
): string {
  if (!coverImage?.trim()) return '';

  // Аллақачон URL йўли
  if (coverImage.startsWith('/') && !coverImage.startsWith('/data:')) {
    return coverImage;
  }

  const match = coverImage.match(/^data:image\/([\w+.-]+);base64,(.+)$/);
  if (!match) return coverImage;

  const mime = match[1].toLowerCase();
  const base64 = match[2].replace(/\s/g, '');
  const ext =
    mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';

  const uploadDir = subDir === 'issues' ? ISSUES_UPLOAD_DIR : HOMEPAGE_UPLOAD_DIR;
  ensureDir(uploadDir);
  const filename = `${id}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(filePath, buffer);

  return subDir === 'issues'
    ? `/uploads/issues/${filename}`
    : `/uploads/${filename}`;
}

/** JSON ичидаги base64 ларни файлга кўчириб, URL сақлайди */
export function normalizeIssuesCovers(issues: Issue[]): {
  issues: Issue[];
  changed: boolean;
} {
  let changed = false;
  const normalized = issues.map((issue) => {
    if (issue.coverImage?.startsWith('data:image')) {
      changed = true;
      return {
        ...issue,
        coverImage: persistCoverImage(issue.coverImage, issue.id),
      };
    }
    return issue;
  });
  return { issues: normalized, changed };
}

export function isDisplayableCover(coverImage?: string): boolean {
  if (!coverImage?.trim()) return false;
  if (coverImage.startsWith('data:image')) return true;
  if (coverImage.startsWith('/uploads/')) return true;
  // Мавжуд бўлмаган seed йўлларини текшириш
  if (coverImage.startsWith('/images/')) {
    const publicDir = /*turbopackIgnore: true*/ path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, coverImage);
    return fs.existsSync(filePath);
  }
  return coverImage.startsWith('/');
}
