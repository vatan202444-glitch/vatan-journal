import Link from 'next/link';
import { Author } from '@/data/authors';

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">
              {author.name.charAt(0)}
            </span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              <Link href={`/authors/${author.id}`} className="hover:text-blue-700 transition-colors">
                {author.name}
              </Link>
            </h3>
            
            <p className="text-blue-600 text-sm font-medium mb-2">
              {author.specialization}
            </p>
            
            <p className="text-gray-600 text-sm line-clamp-2">
              {author.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
