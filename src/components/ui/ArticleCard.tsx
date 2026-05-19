import Link from 'next/link';
import { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {article.categoryName}
          </span>
          <span className="text-gray-500 text-sm">
            {article.issueNumber}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-700 transition-colors">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{article.authorName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{article.readTime} дақиқа ўқиш</span>
            <span>{new Date(article.date).toLocaleDateString('uz-UZ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
