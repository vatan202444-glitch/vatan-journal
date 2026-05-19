import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getArticlesByCategorySlug } from '@/lib/data';
import ArticleCard from '@/components/ui/ArticleCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategorySlug(slug);

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12">
      <div className="container mx-auto px-4">
        <nav className="text-sm text-[#64748b] mb-6">
          <Link href="/" className="hover:text-[#1e3a8a]">
            Бош саҳифа
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-[#1e3a8a]">
            Рукнлар
          </Link>
          <span className="mx-2">/</span>
          <span>{category.name}</span>
        </nav>

        <h1 className="text-4xl font-extrabold text-[#1e3a8a] font-serif mb-4">
          {category.icon} {category.name}
        </h1>
        <p className="text-[#64748b] mb-10 max-w-2xl">{category.description}</p>

        {articles.length === 0 ? (
          <p className="text-[#64748b]">Ушбу рукнда ҳали мақола йўқ.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

