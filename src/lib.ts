import { getCollection, type CollectionEntry } from 'astro:content';
import { UI, type Lang } from './i18n';

// 英文文章放在 src/content/blog/en/，檔名與中文版相同即視為同一篇的翻譯
export function postLang(post: CollectionEntry<'blog'>): Lang {
  return post.id.startsWith('en/') ? 'en' : 'zh';
}

export function postSlug(post: CollectionEntry<'blog'>) {
  return post.id.replace(/^en\//, '');
}

// 已發佈的文章（draft: true 的不會出現在網站上），新到舊排序
export async function getPosts(lang: Lang = 'zh') {
  const posts = await getCollection('blog', (p) => !p.data.draft && postLang(p) === lang);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(d: Date, lang: Lang = 'zh') {
  return d.toLocaleDateString(UI[lang].locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
}
