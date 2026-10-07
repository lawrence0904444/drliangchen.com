// 結構化資料（JSON-LD）：讓搜尋引擎與 AI 認得「這個網站的陳亮」是哪一位。
// 個人資料集中在這裡，各頁面以 @id 參照同一個 Person。
import { localize, UI, type Lang } from './i18n';

export const SITE_URL = 'https://drliangchen.com';
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PHOTO = '/images/liang-chen.jpg';

export const PROFILES = {
  orcid: 'https://orcid.org/0009-0004-2855-8011',
  linkedin: 'https://www.linkedin.com/in/liang-lawrence-chen/',
  github: 'https://github.com/lawrence0904444',
};

const abs = (path: string) => new URL(path, SITE_URL).href;

export function personLd(lang: Lang) {
  const zh = lang === 'zh';
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: zh ? '陳亮' : 'Liang Chen',
    alternateName: zh
      ? ['Liang Chen', 'Lawrence Chen', 'Liang (Lawrence) Chen']
      : ['陳亮', 'Lawrence Chen', 'Liang (Lawrence) Chen'],
    honorificSuffix: 'MD',
    jobTitle: zh ? '一般醫學訓練（PGY）醫師' : 'Postgraduate Year (PGY) Physician',
    url: abs(localize('/', lang)),
    image: abs(PHOTO),
    email: 'mailto:me@drliangchen.com',
    worksFor: {
      '@type': 'Hospital',
      name: zh ? '佛教慈濟醫療財團法人台北慈濟醫院' : 'Taipei Tzu Chi Hospital, Buddhist Tzu Chi Medical Foundation',
      address: { '@type': 'PostalAddress', addressLocality: 'New Taipei City', addressCountry: 'TW' },
    },
    alumniOf: { '@type': 'CollegeOrUniversity', name: zh ? '慈濟大學醫學系' : 'Tzu Chi University School of Medicine' },
    knowsAbout: zh
      ? ['復健醫學', '疼痛醫學', '運動醫學', '實證醫學', '系統性回顧與統合分析']
      : ['Physical Medicine and Rehabilitation', 'Pain Medicine', 'Sports Medicine', 'Evidence-Based Medicine', 'Systematic Reviews and Meta-Analysis'],
    memberOf: [
      { '@type': 'Organization', name: 'Cochrane', url: 'https://www.cochrane.org/' },
      { '@type': 'Organization', name: 'International Society of Physical and Rehabilitation Medicine (ISPRM)', url: 'https://www.isprm.org/' },
    ],
    sameAs: Object.values(PROFILES),
  };
}

export function websiteLd(lang: Lang) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: abs('/'),
    name: UI[lang].site,
    inLanguage: [UI.zh.htmlLang, UI.en.htmlLang],
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

// 「快速認識」問答 → FAQPage
export function faqLd(facts: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: facts.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

// 個人介紹頁（首頁、簡歷、關於我）：ProfilePage 的主體就是這個 Person
export function profilePageLd(lang: Lang, path: string, extra: object[] = []) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfilePage', '@id': `${abs(path)}#page`, url: abs(path), inLanguage: UI[lang].htmlLang, isPartOf: { '@id': WEBSITE_ID }, mainEntity: { '@id': PERSON_ID } },
      personLd(lang),
      websiteLd(lang),
      ...extra,
    ],
  };
}
