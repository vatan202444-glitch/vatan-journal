import { getCategories } from '@/lib/data';
import Link from 'next/link';

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-[#1e3a8a] font-serif mb-4 text-center">
          Журнал рукнлари
        </h1>
        <p className="text-[#64748b] text-center mb-12 max-w-2xl mx-auto">
          Мақолалар категориялари бўйича тайёрланган рукнлар
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 text-center border border-[#e5e7eb]"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-2">{category.name}</h3>
              <p className="text-[#64748b] text-sm mb-4 line-clamp-2">{category.description}</p>
              <span className="text-[#1e3a8a] font-medium">{category.articleCount} мақола</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


