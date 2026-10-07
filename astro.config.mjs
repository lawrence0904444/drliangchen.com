import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://drliangchen.com',
  integrations: [
    // i18n：sitemap 內為中英文頁面加上 hreflang 對應
    sitemap({ i18n: { defaultLocale: 'zh', locales: { zh: 'zh-Hant-TW', en: 'en' } } }),
  ],
});
