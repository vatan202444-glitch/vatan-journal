/** Latin transliteration map for Uzbek Cyrillic titles */
const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
  з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
  я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h', ә: 'a',
  А: 'a', Б: 'b', В: 'v', Г: 'g', Д: 'd', Е: 'e', Ё: 'yo', Ж: 'zh',
  З: 'z', И: 'i', Й: 'y', К: 'k', Л: 'l', М: 'm', Н: 'n', О: 'o',
  П: 'p', Р: 'r', С: 's', Т: 't', У: 'u', Ф: 'f', Х: 'x', Ц: 'ts',
  Ч: 'ch', Ш: 'sh', Щ: 'sh', Ъ: '', Ы: 'y', Ь: '', Э: 'e', Ю: 'yu',
  Я: 'ya', Ў: 'o', Қ: 'q', Ғ: 'g', Ҳ: 'h', Ә: 'a',
};

export function slugify(text: string): string {
  let result = '';
  for (const char of text) {
    result += CYRILLIC_MAP[char] ?? char;
  }
  return result
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'maqola';
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = base;
  let counter = 2;
  while (existing.includes(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}
