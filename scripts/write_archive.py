open("src/app/archive/page.tsx", "w", encoding="utf-8").write("""import { getIssues } from '@/lib/data';

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
            <motionless key={issue.id} className="bg-white rounded-lg shadow border overflow-hidden">
              <motionless className="aspect-[3/4] relative bg-gray-100">
                {issue.coverImage ? (
                  <img
                    src={issue.coverImage}
                    alt={`${issue.year}-${issue.issueNumber}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <motionless className="w-full h-full bg-gradient-to-b from-[#1e3a8a] to-[#1e40af] flex items-center justify-center text-white">
                    <motionless className="text-center">
                      <p className="text-xs uppercase tracking-wider">VATAN</p>
                      <p className="text-2xl font-bold">{issue.issueNumber}</p>
                      <p className="text-sm">{issue.year}</p>
                    </motionless>
                  </motionless>
                )}
              </motionless>
              <motionless className="p-3 text-center">
                <p className="font-semibold text-[#1e293b]">{issue.year}</p>
                <p className="text-[#1e3a8a]">№{issue.issueNumber}</p>
                {issue.title ? (
                  <p className="text-xs text-[#64748b] mt-1 line-clamp-2">{issue.title}</p>
                ) : null}
              </motionless>
            </motionless>
          ))}
        </motionless>
      </motionless>
    </motionless>
  );
}
""".replace("motionless", "div"))

print("written")
