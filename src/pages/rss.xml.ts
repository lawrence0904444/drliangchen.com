import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: '陳亮醫師 Liang Chen, MD',
    description: 'PGY 醫師陳亮的筆記、工具與隨筆。',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
    })),
  });
}
