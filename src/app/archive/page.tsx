import { getIssues } from '@/lib/data';
import IssueCover from '@/components/ui/IssueCover';

export default function ArchivePage() {
  const issues = getIssues();

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-[#1e3a8a] mb-8 font-serif">
          Журнал сонлари
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {issues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="aspect-[3/4] relative bg-gray-100 overflow-hidden">
                <IssueCover
                  coverImage={issue.coverImage}
                  year={issue.year}
                  issueNumber={issue.issueNumber}
                  title={issue.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-semibold text-[#1e293b]">{issue.year}</p>
                <p className="text-[#1e3a8a]">№{issue.issueNumber}</p>
                {issue.title ? (
                  <p className="text-xs text-[#64748b] mt-1 line-clamp-2">{issue.title}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
