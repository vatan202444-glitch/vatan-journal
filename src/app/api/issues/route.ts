import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { persistCoverImage, normalizeIssuesCovers } from '@/lib/cover-image';
import { issues as initialIssues, Issue } from '@/data/issues';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function loadIssues(): Issue[] {
  const issues = readData<Issue[]>('issues.json', initialIssues);
  const { issues: normalized, changed } = normalizeIssuesCovers(issues);
  if (changed) {
    writeData('issues.json', normalized);
  }
  return normalized;
}

export async function GET() {
  try {
    return NextResponse.json(loadIssues());
  } catch {
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const issues = readData<Issue[]>('issues.json', initialIssues);

    const id = `issue-${Date.now()}`;
    const coverImage = persistCoverImage(body.coverImage, id);

    const newIssue: Issue = {
      ...body,
      id,
      coverImage,
      date: body.date || `${body.year}-${String(body.issueNumber).padStart(2, '0')}-15`,
    };

    issues.push(newIssue);
    writeData('issues.json', issues);

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('POST /api/issues error:', error);
    return NextResponse.json(
      { error: 'Failed to create issue', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const issues = readData<Issue[]>('issues.json', initialIssues);

    const index = issues.findIndex((i) => i.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const coverImage = body.coverImage?.startsWith('data:image')
      ? persistCoverImage(body.coverImage, body.id)
      : body.coverImage ?? issues[index].coverImage;

    issues[index] = { ...issues[index], ...body, coverImage };
    writeData('issues.json', issues);

    return NextResponse.json(issues[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Issue ID is required' }, { status: 400 });
    }

    const issues = readData<Issue[]>('issues.json', initialIssues);
    writeData(
      'issues.json',
      issues.filter((i) => i.id !== id)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 });
  }
}
