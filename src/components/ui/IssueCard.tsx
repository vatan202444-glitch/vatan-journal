import Link from 'next/link';
import { Issue } from '@/data/issues';

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-[3/4] bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-yellow-400 text-6xl font-bold mb-4">
            VATAN
          </div>
          <div className="text-white text-xl font-semibold mb-2">
            {issue.issueNumber}/{issue.year}
          </div>
          <div className="text-blue-200 text-sm">
            {new Date(issue.date).toLocaleDateString('uz-UZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {issue.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {issue.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {issue.articleCount} мақола
          </span>
        </div>
      </div>
    </div>
  );
}
