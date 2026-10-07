import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { UI, localize, type Lang } from './i18n';
import { getPosts, postSlug } from './lib';

export async function feed(context: APIContext, lang: Lang) {
  const posts = await getPosts(lang);
  return rss({
    title: UI[lang].site,
    description: UI[lang].siteDescription,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: localize(`/blog/${postSlug(p)}/`, lang),
    })),
  });
}
