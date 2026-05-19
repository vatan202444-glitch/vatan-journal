import re

path = "src/app/page.tsx"
with open(path, encoding="utf-8") as f:
    t = f.read()

t = t.replace("<motionless>", "").replace("</motionless>", "")
t = t.replace("featuredArticle.category", "featuredArticle.categoryName")
t = t.replace("featuredArticle.author", "featuredArticle.authorName")
t = t.replace("featuredArticle.excerpt", "featuredArticle.summary")
t = t.replace("`/articles/${featuredArticle.id}`", "`/articles/${featuredArticle.slug}`")
t = t.replace("articles.map((article)", "displayArticles.map((article)")
t = t.replace("article.category", "article.categoryName")
t = t.replace("article.excerpt", "article.summary")
t = t.replace("article.author", "article.authorName")
t = t.replace("`/articles/${article.id}`", "`/articles/${article.slug}`")

t = re.sub(
    r"\{featuredArticle\.showBadge && \(\s*<div className=\"inline-flex",
    '<motionless',
    t,
)
t = t.replace('<motionless', '<div className="inline-flex', 1)

old_archive = """{['01/2024', '02/2024', '03/2024', '04/2024'].map((issue, index) => (
              <Link key={issue} href={`/archive/issue-${index + 1}`} className="group">
                <motionless />
              </Link>
            ))}"""

new_archive = """{archivePreview.map((issue) => (
              <Link key={issue.id} href="/archive" className="group">
                <div className="relative aspect-[3/4] bg-white border border-[#e5e7eb] hover:border-[#1e3a8a]/30 transition-all duration-500 p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-lg">
                  <p className="text-[#b45309] text-xs tracking-widest uppercase mb-2">VATAN</p>
                  <p className="text-[#1e293b] text-3xl font-serif">{issue.issueNumber}/{issue.year}</p>
                  <div className="absolute inset-0 bg-[#1e3a8a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></motionless>
                </motionless>
              </Link>
            ))}"""

# simpler archive fix
t = t.replace(
    "{['01/2024', '02/2024', '03/2024', '04/2024'].map((issue, index) => (",
    "{archivePreview.map((issue) => (",
)
t = t.replace("key={issue} href={`/archive/issue-${index + 1}`}", 'key={issue.id} href="/archive"')
t = t.replace(
    '<p className="text-[#1e293b] text-3xl font-serif">{issue}</p>',
    '<p className="text-[#1e293b] text-3xl font-serif">{issue.issueNumber}/{issue.year}</p>',
)

old_btn = """          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                className="px-6 py-2 border border-[#1e3a8a]/30 text-[#64748b] hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all duration-300 text-base tracking-wide rounded font-semibold"
              >"""

new_btn = """          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button type="button" onClick={() => setActiveCategory(null)} className={`px-6 py-2 border rounded font-semibold ${!activeCategory ? 'border-[#1e3a8a] text-[#1e3a8a] bg-[#1e3a8a]/5' : 'border-[#1e3a8a]/30 text-[#64748b]'}`}>Барчаси</button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-6 py-2 border rounded font-semibold transition-all ${activeCategory === cat.slug ? 'border-[#1e3a8a] text-[#1e3a8a] bg-[#1e3a8a]/5' : 'border-[#1e3a8a]/30 text-[#64748b] hover:border-[#1e3a8a] hover:text-[#1e3a8a]'}`}
              >"""

if old_btn in t:
    t = t.replace(old_btn, new_btn)

t = t.replace("</motionless>", "</div>")

with open(path, "w", encoding="utf-8") as f:
    f.write(t)
print("fixed page.tsx")
