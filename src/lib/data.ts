import { readData, writeData } from '@/lib/storage';
import { normalizeIssuesCovers } from '@/lib/cover-image';
import { articles as seedArticles, type Article } from '@/data/articles';
import { issues as seedIssues, type Issue } from '@/data/issues';
import { categories as seedCategories, type Category } from '@/data/categories';
import { authors as seedAuthors, type Author } from '@/data/authors';

export type { Article, Issue, Category, Author };

export interface HomepageSettings {
  cover: {
    type: 'css' | 'image';
    imageUrl: string;
    year: string;
    issueNumber: string;
    subtitle: string;
    badge: string;
    badgeColor: string;
  };
  featuredArticleId: string;
}

const defaultHomepage: HomepageSettings = {
  cover: {
    type: 'css',
    imageUrl: '',
    year: '2024',
    issueNumber: '01',
    subtitle: 'Нишона сон',
    badge: 'Нишона сон',
    badgeColor: '#b45309',
  },
  featuredArticleId: 'article-002',
};

export function getArticles(): Article[] {
  return readData<Article[]>('articles.json', seedArticles);
}

export function getPublishedArticles(): Article[] {
  return getArticles().filter((a) => a.status !== 'draft');
}

export function getArticleBySlugOrId(slugOrId: string): Article | undefined {
  const articles = getArticles();
  return articles.find((a) => a.slug === slugOrId || a.id === slugOrId);
}

export function getArticlesByCategorySlug(categorySlug: string): Article[] {
  return getPublishedArticles().filter(
    (a) => a.categorySlug === categorySlug || a.categoryName.toLowerCase() === categorySlug
  );
}

export function getFeaturedArticles(): Article[] {
  return getPublishedArticles().filter((a) => a.featured);
}

export function getIssues(): Issue[] {
  const issues = readData<Issue[]>('issues.json', seedIssues);
  const { issues: normalized, changed } = normalizeIssuesCovers(issues);
  if (changed) {
    writeData('issues.json', normalized);
  }
  return normalized;
}

export function getFeaturedIssue(): Issue | undefined {
  return getIssues().find((i) => i.featured) ?? getIssues()[0];
}

export function getCategories(): Category[] {
  return readData<Category[]>('categories.json', seedCategories);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getAuthors(): Author[] {
  return readData<Author[]>('authors.json', seedAuthors);
}

export function getHomepageSettings(): HomepageSettings {
  return readData<HomepageSettings>('homepage.json', defaultHomepage);
}

export function getCategorySlugFromName(name: string): string {
  const cat = getCategories().find((c) => c.name === name);
  if (cat) return cat.slug;
  const map: Record<string, string> = {
    'Иқтисодиёт': 'iqtisodiyot',
    'Тарих': 'tarix',
    'Жамият': 'jamiyat',
    'Маданият': 'madaniyat',
    'Тилшунослик': 'tilshunoslik',
    'Фото': 'foto',
    'Видео': 'video',
  };
  return map[name] || slugifyName(name);
}

function slugifyName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}
