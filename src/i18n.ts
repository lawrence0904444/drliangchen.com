export type Lang = 'zh' | 'en';

export const LANGS: Lang[] = ['zh', 'en'];

// 介面文字。中文路徑在 /，英文路徑在 /en/
export const UI = {
  zh: {
    htmlLang: 'zh-Hant-TW',
    site: '陳亮醫師 Liang Chen, MD',
    homeTitle: '陳亮醫師 Liang Chen, MD｜台北慈濟醫院 PGY 醫師',
    titleSuffix: '｜陳亮醫師',
    ogLocale: 'zh_TW',
    ogImageAlt: '陳亮醫師 Liang Chen, MD｜台北慈濟醫院 PGY 醫師',
    siteDescription: 'PGY 醫師陳亮的筆記、工具與隨筆。',
    brand: '陳亮醫師',
    brandSub: 'Liang Chen, MD',
    nav: { blog: '文章', cv: '簡歷', about: '關於我' },
    switchLabel: 'English',
    switchAria: 'Switch to English',
    themeAria: '切換深色／淺色模式',
    all: '全部',
    noPosts: '還沒有文章，敬請期待。',
    allPosts: '所有文章 →',
    latest: '最新文章',
    footer: '本站內容為個人學習筆記與心得，僅供參考，不構成醫療建議，亦不代表任職機構立場。身體不適請就醫。',
    locale: 'zh-TW',
  },
  en: {
    htmlLang: 'en',
    site: 'Liang Chen, MD',
    homeTitle: 'Liang Chen, MD | PGY Physician, Taipei Tzu Chi Hospital',
    titleSuffix: ' | Liang Chen, MD',
    ogLocale: 'en_US',
    ogImageAlt: 'Liang Chen, MD | PGY Physician, Taipei Tzu Chi Hospital',
    siteDescription: 'Notes, tools and essays by Liang Chen, MD, a PGY physician in Taiwan.',
    brand: 'Liang Chen, MD',
    brandSub: '陳亮醫師',
    nav: { blog: 'Posts', cv: 'CV', about: 'About' },
    switchLabel: '中文',
    switchAria: '切換到中文',
    themeAria: 'Toggle dark / light mode',
    all: 'All',
    noPosts: 'No posts yet. Stay tuned.',
    allPosts: 'All posts →',
    latest: 'Latest posts',
    footer: 'Content on this site reflects personal study notes and opinions only. It is not medical advice and does not represent my employer. If you feel unwell, please see a doctor.',
    locale: 'en-US',
  },
} as const;

export const CATEGORY_LABELS = {
  zh: { notes: '筆記', tools: '工具', essays: '隨筆' },
  en: { notes: 'Notes', tools: 'Tools', essays: 'Essays' },
} as const;

// '/cv/' + 'en' → '/en/cv/'
export function localize(path: string, lang: Lang) {
  return lang === 'en' ? `/en${path}` : path;
}

export function langFromPath(path: string): Lang {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh';
}

// 去掉語言前綴：'/en/cv/' → '/cv/'
export function stripLang(path: string) {
  return path.replace(/^\/en(?=\/|$)/, '') || '/';
}
