import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIES = {
  notes: '筆記',
  tools: '工具',
  essays: '隨筆',
} as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(), // 有填就顯示「最後更新」
    category: z.enum(['notes', 'tools', 'essays']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // 常見問題：會顯示在文末，並輸出 FAQPage 結構化資料
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { blog };
