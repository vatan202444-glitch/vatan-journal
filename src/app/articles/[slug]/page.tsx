import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlugOrId, getIssues, getArticles } from '@/lib/data';
import type { Metadata } from 'next';

export const revalidate = 60; // Revalidate at most every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlugOrId(slug);

  if (!article || article.status === 'draft') {
    return { title: 'Мақола топилмади — VATAN' };
  }

  const desc = article.metaDescription || article.summary;
  return {
    title: `${article.title} — VATAN`,
    description: desc,
    openGraph: {
      title: article.title,
      description: desc,
      type: 'article',
      authors: [article.authorName],
    },
  };
}

import { cookies } from 'next/headers';
import { readData } from '@/lib/storage';
import ArticleActions from '@/components/ArticleActions';
import ArticleTextSettings from '@/components/ArticleTextSettings';
import Image from 'next/image';

interface ReaderUser {
  id: string;
  phone: string;
  name: string;
  passwordHash: string;
  premiumUntil: string | null;
  createdAt: string;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlugOrId(slug);

  if (!article || article.status === 'draft') {
    notFound();
  }

  // Check if user is premium
  let isUserPremium = false;
  const cookieStore = await cookies();
  const token = cookieStore.get('readerToken')?.value;
  if (token) {
    const users = readData<ReaderUser[]>('readers.json', []);
    const user = users.find(u => u.id === token);
    if (user && user.premiumUntil) {
      isUserPremium = new Date(user.premiumUntil) > new Date();
    }
  }

  const showPaywall = article.isPremium && !isUserPremium;

  const issues = getIssues();
  const issue = issues.find((i) => i.id === article.issueId);
  const issueLabel = issue
    ? `VATAN ${issue.year} йил ${issue.issueNumber}-сон`
    : article.issueNumber || 'VATAN журнали';

  // Related articles (same category, excluding current)
  const allArticles = getArticles();
  const related = allArticles
    .filter((a) => a.categorySlug === article.categorySlug && a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  const contentHasHtml = /<[a-z][\s\S]*>/i.test(article.content || '');
  const displayContent = contentHasHtml
    ? article.content
    : article.content.replace(/\n/g, '<br/>');

  const rawHtml =
    article.contentHtml ||
    `<p class="lead">${article.summary}</p><div>${displayContent}</div>`;

  const html = rawHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '');

  // Format date nicely in Cyrillic
  let formattedDate = article.date || '';
  if (article.date) {
    const d = new Date(article.date);
    const monthsCyrillic = ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'];
    formattedDate = `${d.getDate()}-${monthsCyrillic[d.getMonth()]}, ${d.getFullYear()}`;
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8f6f0' }}>

      {/* Slim top bar */}
      <div style={{ background: '#1e3a8a' }} className="py-2 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white/80 hover:text-white text-sm font-medium tracking-widest uppercase">
            VATAN
          </Link>
          <Link href="/articles" className="text-white/70 hover:text-white text-xs flex items-center gap-1">
            ← Барча мақолалар
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="pt-14 pb-10" style={{ background: '#f8f6f0' }}>
        <div className="max-w-3xl mx-auto px-6">

          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
              <li><Link href="/" className="hover:text-[#1e3a8a] transition-colors">Бош саҳифа</Link></li>
              <li>›</li>
              <li><Link href="/articles" className="hover:text-[#1e3a8a] transition-colors">Мақолалар</Link></li>
              <li>›</li>
              <li style={{ color: '#1e3a8a' }}>{article.categoryName}</li>
            </ol>
          </nav>

          {/* Kun.uz style Meta info */}
          <div className="flex flex-wrap items-center gap-5 text-[15px] font-medium mb-4" style={{ color: '#888' }}>
            <div className="flex items-center">
              <span>12:00 / {formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              <span>{article.views ?? ((article.title.length * 123) % 4500 + 500)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{article.readTime} дақиқа ўқилади</span>
            </div>
            
            <div className="ml-auto">
              <ArticleTextSettings />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: '#1e293b',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {article.title}
          </h1>

          {/* Summary / Lead */}
          <p
            className="text-xl leading-relaxed mb-8"
            style={{ color: '#475569', fontStyle: 'italic', borderLeft: '3px solid #b45309', paddingLeft: '1.25rem' }}
          >
            {article.summary}
          </p>


        </div>
      </header>

      {/* Article cover image */}
      {article.imageUrl && (
        <div className="max-w-4xl mx-auto px-4 mb-2">
          <div className="relative w-full h-[250px] sm:h-[400px] md:h-[480px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="py-12">
        <div className="max-w-3xl mx-auto px-6">

          {/* Article body */}
          <div className="relative">
            <div
              id="article-content-body"
              className={`article-reading-body transition-all duration-300 ${showPaywall ? 'max-h-[600px] overflow-hidden' : ''}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
            
            {showPaywall && (
              <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none flex flex-col justify-end pb-8">
                <div className="pointer-events-auto bg-white border border-[#e5e7eb] rounded-2xl p-8 shadow-2xl mx-auto max-w-xl text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg text-white">
                    🔒
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e293b] mb-2 font-serif">
                    Ушбу мақола фақат обуначилар учун!
                  </h3>
                  <p className="text-[#64748b] mb-6 leading-relaxed">
                    Мақоланинг тўлиқ матнини ўқиш ва журналнинг барча сонларига чексиз кириш учун обунани расмийлаштиринг.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/login" className="bg-[#1e3a8a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors shadow-md">
                      Обуна бўлиш
                    </Link>
                    <Link href="/login" className="bg-white text-[#1e3a8a] px-8 py-3 rounded-lg font-semibold border-2 border-[#1e3a8a] hover:bg-[#f8fafc] transition-colors">
                      Тизимга кириш
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Decorative end mark (only show if not premium) */}
          {!showPaywall && (
            <div className="flex items-center justify-center my-12 gap-3">
              <div className="h-px flex-1" style={{ background: '#e2ddd4' }} />
              <div className="text-2xl" style={{ color: '#b45309' }}>✦</div>
              <div className="h-px flex-1" style={{ background: '#e2ddd4' }} />
            </div>
          )}

          {/* Author card */}
          <div className="bg-[#f1f5f9] rounded-lg p-5 mb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-xl uppercase bg-[#1e3a8a]">
              {article.authorName.charAt(0)}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-0.5">Тайёрлаган</p>
              <h3 className="text-[16px] font-bold text-[#1e293b]">{article.authorName}</h3>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[#f1f5f9] rounded-lg p-4 flex flex-wrap gap-3 mb-12">
            <Link href={`/articles?category=${article.categorySlug}`} className="bg-white px-4 py-2 text-[14px] font-bold text-[#1e293b] hover:text-[#1e3a8a] transition-colors shadow-sm">
              #{article.categoryName}
            </Link>
            <Link href="/articles" className="bg-white px-4 py-2 text-[14px] font-bold text-[#1e293b] hover:text-[#1e3a8a] transition-colors shadow-sm">
              #Янгиликлар
            </Link>
            <Link href="/articles" className="bg-white px-4 py-2 text-[14px] font-bold text-[#1e293b] hover:text-[#1e3a8a] transition-colors shadow-sm">
              #Муҳим
            </Link>
          </div>

          {/* Rating and Share */}
          <ArticleActions articleTitle={article.title} shortLink={article.shortLink} />

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6" style={{ borderTop: '1px solid #e2ddd4' }}>
            <Link
              href="/articles"
              className="flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: '#1e3a8a' }}
            >
              ← Барча мақолалар
            </Link>
            <Link
              href={`/articles?category=${article.categorySlug}`}
              className="flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: '#1e3a8a' }}
            >
              {article.categoryName} →
            </Link>
          </div>
        </div>
      </main>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="py-16" style={{ background: '#fff', borderTop: '1px solid #e2ddd4' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#b45309' }}>
                Шу рукндан
              </p>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#1e293b' }}>
                Бошқа мақолалар
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.id} href={`/articles/${rel.slug}`} className="group block">
                  <article
                    className="h-full rounded-xl p-6 transition-all duration-300 group-hover:shadow-md"
                    style={{ background: '#f8f6f0', border: '1px solid #e2ddd4' }}
                  >
                    <span
                      className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3"
                      style={{ background: '#b45309', color: '#fff' }}
                    >
                      {rel.categoryName}
                    </span>
                    <h3
                      className="font-bold text-base leading-snug mb-3 group-hover:text-[#1e3a8a] transition-colors"
                      style={{ fontFamily: 'Georgia, serif', color: '#1e293b' }}
                    >
                      {rel.title}
                    </h3>
                    <p className="text-sm line-clamp-2 mb-4" style={{ color: '#64748b' }}>{rel.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#94a3b8' }}>{rel.authorName}</span>
                      <span className="text-xs" style={{ color: '#94a3b8' }}>{rel.readTime} дақ.</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reading styles */}
      <style>{`
        .article-reading-body {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.125rem;
          line-height: 1.95;
          color: #2d3748;
        }
        .article-reading-body p {
          margin-bottom: 1.6rem;
        }
        .article-reading-body p.lead {
          font-size: 1.25rem;
          color: #1e293b;
          font-weight: 500;
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        .article-reading-body h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #1e3a8a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2ddd4;
        }
        .article-reading-body h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .article-reading-body blockquote {
          margin: 2rem 0;
          padding: 1.25rem 1.75rem;
          border-left: 4px solid #b45309;
          background: #fffbf5;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #475569;
          font-size: 1.1rem;
        }
        .article-reading-body blockquote p {
          margin: 0;
        }
        .article-reading-body ul,
        .article-reading-body ol {
          margin: 1.5rem 0;
          padding-left: 1.75rem;
        }
        .article-reading-body li {
          margin-bottom: 0.6rem;
          color: #374151;
        }
        .article-reading-body ul li::marker {
          color: #b45309;
        }
        .article-reading-body a {
          color: #1e3a8a;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .article-reading-body a:hover {
          color: #b45309;
        }
        .article-reading-body strong {
          color: #1e293b;
          font-weight: 700;
        }
        .article-reading-body img {
          width: 100%;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        .article-reading-body hr {
          border: none;
          border-top: 1px solid #e2ddd4;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}
