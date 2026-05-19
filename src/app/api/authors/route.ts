import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { authors as initialAuthors, Author } from '@/data/authors';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET() {
  try {
    const authors = readData<Author[]>('authors.json', initialAuthors);
    return NextResponse.json(authors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const authors = readData<Author[]>('authors.json', initialAuthors);
    
    const newAuthor: Author = {
      id: `author-${Date.now()}`,
      ...body,
    };
    
    authors.push(newAuthor);
    writeData('authors.json', authors);
    
    return NextResponse.json(newAuthor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const authors = readData<Author[]>('authors.json', initialAuthors);
    
    const index = authors.findIndex(a => a.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }
    
    authors[index] = { ...authors[index], ...body };
    writeData('authors.json', authors);
    
    return NextResponse.json(authors[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update author' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Author ID is required' }, { status: 400 });
    }
    
    const authors = readData<Author[]>('authors.json', initialAuthors);
    const filtered = authors.filter(a => a.id !== id);
    
    writeData('authors.json', filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 });
  }
}
