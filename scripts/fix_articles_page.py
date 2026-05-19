open("src/app/articles/page.tsx", "w", encoding="utf-8").write("""import { getPublishedArticles } from '@/lib/data';
import ArticleCard from '@/components/ui/ArticleCard';

export const dynamic = 'force-dynamic';

export default function ArticlesPage() {
  const articles = getPublishedArticles();

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-[#1e3a8a] font-serif mb-4 text-center">
          Мақолалар
        </h1>
        <p className="text-[#64748b] text-center mb-12 max-w-2xl mx-auto">
          Журналда чоп этилган барча мақолалар рўйхати
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
""")

print("ok")
