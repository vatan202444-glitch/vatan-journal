import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { articles as initialArticles, type Article } from '@/data/articles';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();

  const { id } = await params;

  try {
    const body = await request.json();
    const articles = readData<Article[]>('articles.json', initialArticles);
    const index = articles.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Update the article with the new data, preserving all existing fields
    articles[index] = {
      ...articles[index],
      ...body,
      id: id, // Ensure ID doesn't change
      // Ensure subtitle is preserved if not provided in body
      subtitle: body.subtitle !== undefined ? body.subtitle : articles[index].subtitle,
    };

    writeData('articles.json', articles);
    return NextResponse.json(articles[index]);
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}
