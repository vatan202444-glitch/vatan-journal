import { getAuthors } from '@/lib/data';
import AuthorCard from '@/components/ui/AuthorCard';

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <div className="min-h-screen bg-[#fcfbf7] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-[#1e3a8a] font-serif mb-4 text-center">
          Муаллифлар
        </h1>
        <p className="text-[#64748b] text-center mb-12 max-w-2xl mx-auto">
          Журналда чоп этилаётган мақолалар муаллифлари
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </div>
  );
}
