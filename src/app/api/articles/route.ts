import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { articles as initialArticles, type Article } from '@/data/articles';
import { slugify, uniqueSlug } from '@/lib/slug';
import { getCategorySlugFromName } from '@/lib/data';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

function enrichArticle(body: Partial<Article>, existing?: Article): Article {
  const title = body.title || existing?.title || 'Мақола';
  const all = readData<Article[]>('articles.json', initialArticles);
  const slugs = all.filter((a) => a.id !== existing?.id).map((a) => a.slug);
  const slug =
    body.slug ||
    existing?.slug ||
    uniqueSlug(slugify(title), slugs);

  const categoryName = body.categoryName || existing?.categoryName || 'Жамият';
  const summary =
    body.summary ||
    existing?.summary ||
    (body.content || '').slice(0, 200) ||
    title;

  // If content is edited via admin panel, it won't send contentHtml. 
  // We should clear the old contentHtml so the new content takes effect.
  const newContent = body.content ?? existing?.content ?? '';
  let newContentHtml = body.contentHtml ?? existing?.contentHtml;
  
  // If content changed and no new contentHtml is provided, clear the old contentHtml
  if (body.content !== undefined && body.content !== existing?.content && !body.contentHtml) {
    newContentHtml = '';
  }

  return {
    id: existing?.id || `article-${Date.now()}`,
    slug,
    title,
    subtitle: body.subtitle || existing?.subtitle,
    summary,
    content: newContent,
    contentHtml: newContentHtml,
    authorId: body.authorId || existing?.authorId || '',
    authorName: body.authorName || existing?.authorName || '',
    categoryId: body.categoryId || existing?.categoryId || '',
    categoryName,
    categorySlug:
      body.categorySlug ||
      existing?.categorySlug ||
      getCategorySlugFromName(categoryName),
    issueId: body.issueId || existing?.issueId || '',
    issueNumber: body.issueNumber || existing?.issueNumber || '',
    date: body.date || existing?.date || new Date().toISOString().split('T')[0],
    readTime: body.readTime ?? existing?.readTime ?? 10,
    featured: body.featured ?? existing?.featured ?? false,
    status: body.status || existing?.status || 'draft',
    isPremium: body.isPremium ?? existing?.isPremium ?? false,
    imageUrl: body.imageUrl ?? existing?.imageUrl,
    shortLink: body.shortLink ?? existing?.shortLink,
    views: body.views ?? existing?.views ?? 0,
    metaDescription: body.metaDescription ?? existing?.metaDescription,
    publishAt: body.publishAt ?? existing?.publishAt,
  };
}

// Auto-publish scheduled articles
function autoPublishScheduled(articles: Article[]): boolean {
  const now = new Date();
  let changed = false;
  for (const article of articles) {
    if (article.publishAt && article.status === 'draft') {
      const publishDate = new Date(article.publishAt);
      if (publishDate <= now) {
        article.status = 'published';
        article.publishAt = undefined;
        changed = true;
      }
    }
  }
  return changed;
}

export async function GET() {
  try {
    const articles = readData<Article[]>('articles.json', initialArticles);
    // Auto-publish scheduled articles
    if (autoPublishScheduled(articles)) {
      writeData('articles.json', articles);
    }
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const articles = readData<Article[]>('articles.json', initialArticles);
    const newArticle = enrichArticle(body);
    articles.unshift(newArticle);
    writeData('articles.json', articles);
    return NextResponse.json(newArticle, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const articles = readData<Article[]>('articles.json', initialArticles);
    const index = articles.findIndex((a) => a.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    articles[index] = enrichArticle(body, articles[index]);
    writeData('articles.json', articles);
    return NextResponse.json(articles[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }
    const articles = readData<Article[]>('articles.json', initialArticles);
    writeData(
      'articles.json',
      articles.filter((a) => a.id !== id)
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
