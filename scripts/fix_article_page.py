content = r'''import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlugOrId, getIssues } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlugOrId(slug);

  if (!article || article.status === 'draft') {
    notFound();
  }

  const issues = getIssues();
  const issue = issues.find((i) => i.id === article.issueId);
  const issueLabel = issue
    ? `VATAN ${issue.year} yil ${issue.issueNumber}-son`
    : article.issueNumber || 'VATAN journal';

  const html =
    article.contentHtml ||
    `<p class="lead">${article.summary}</p><motionless>${article.content.replace(/\n/g, '<br/>')}</motionless>`;

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <header className="bg-white border-b border-[#e5e7eb] py-12 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-[#64748b] flex-wrap">
              <li><Link href="/" className="hover:text-[#1e3a8a]">Bosh sahifa</Link></li>
              <li>/</li>
              <li><Link href="/articles" className="hover:text-[#1e3a8a]">Maqolalar</Link></li>
              <li>/</li>
              <li className="text-[#94a3b8]">{article.categoryName}</li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[#1e3a8a]/10 border border-[#1e3a8a]/30 text-[#1e3a8a] text-xs uppercase rounded">{article.categoryName}</span>
            <span className="text-[#64748b] text-sm">{article.readTime} daqiqa</span>
            <span className="text-[#64748b] text-sm">{article.date}</span>
          </motionless>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1e293b] font-serif mb-6">{article.title}</h1>
          <p className="text-[#1e293b] font-medium">{article.authorName}</p>
          <p className="text-[#64748b] text-sm">{issueLabel}</p>
        </motionless>
      </header>
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="mt-12 pt-8 border-t">
            <Link href="/articles" className="text-[#1e3a8a]">← Barcha maqolalar</Link>
          </motionless>
        </motionless>
      </main>
    </motionless>
  );
}
'''
content = content.replace('motionless', 'motionless')
# fix placeholders
content = content.replace('<motionless>', '<div>').replace('</motionless>', '</div>')
content = content.replace('Bosh sahifa', 'Бош саҳифа').replace('Maqolalar', 'Мақолалар')
content = content.replace('daqiqa', 'дақиқа ўқиш').replace('Barcha maqolalar', 'Барча мақолалар')
content = content.replace('yil', 'йил').replace('journal', 'журнали')
open('src/app/articles/[slug]/page.tsx', 'w', encoding='utf-8').write(content)
print('ok')
