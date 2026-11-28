import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.resolve('src/content/blog');
const PUBLIC_DIR = path.resolve('public');
const DIST_DIR = path.resolve('dist');

function unquote(value) {
  const s = value.trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1).replace(/''/g, "'").replace(/\\"/g, '"');
  }
  return s;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  const lines = match[1].split(/\r?\n/);
  const data = { tags: [], faq: [] };
  let mode = null; // 'tags' | 'faq'
  let currentFaq = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    if (mode === 'faq') {
      const qMatch = line.match(/^\s+-\s+q:\s*(.*)$/);
      if (qMatch) {
        if (currentFaq) data.faq.push(currentFaq);
        currentFaq = { q: unquote(qMatch[1]), a: '' };
        continue;
      }
      const aMatch = line.match(/^\s+a:\s*(.*)$/);
      if (aMatch && currentFaq) {
        currentFaq.a = unquote(aMatch[1]);
        continue;
      }
    }

    if (mode === 'tags') {
      const itemMatch = line.match(/^\s+-\s+(.*)$/);
      if (itemMatch) {
        data.tags.push(unquote(itemMatch[1]));
        continue;
      }
    }

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;

    if (currentFaq) {
      data.faq.push(currentFaq);
      currentFaq = null;
    }
    mode = null;

    const [, key, rawVal] = kv;
    const val = rawVal.trim();
    if (key === 'faq') {
      mode = 'faq';
      continue;
    }
    if (key === 'tags') {
      if (val.startsWith('[') && val.endsWith(']')) {
        data.tags = val
          .slice(1, -1)
          .split(',')
          .map((t) => unquote(t))
          .filter(Boolean);
      } else if (!val) {
        mode = 'tags';
      }
      continue;
    }
    if (key === 'draft') {
      data.draft = val === 'true';
      continue;
    }
    data[key] = unquote(val);
  }

  if (currentFaq) data.faq.push(currentFaq);
  return { data, body: match[2] };
}

function collectPosts(dir, lang) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => {
      const filePath = path.join(dir, entry.name);
      const slug = entry.name.replace(/\.md$/, '');
      const raw = fs.readFileSync(filePath, 'utf8');
      return { lang, slug, filePath, relPath: path.relative(process.cwd(), filePath), parsed: parseFrontmatter(raw) };
    });
}

const allPosts = [
  ...collectPosts(BLOG_DIR, 'zh'),
  ...collectPosts(path.join(BLOG_DIR, 'en'), 'en'),
];

const errors = [];
const warnings = [];
let checkedCount = 0;
let draftCount = 0;

const publishedKeys = new Set();
const publishedPosts = [];

for (const post of allPosts) {
  if (!post.parsed) {
    errors.push(`[${post.relPath}] 無法解析 frontmatter`);
    continue;
  }
  if (post.parsed.data.draft) {
    draftCount += 1;
    continue;
  }
  publishedKeys.add(`${post.lang}:${post.slug}`);
  publishedPosts.push(post);
}

const hasDist = fs.existsSync(DIST_DIR);
const llmsPath = path.join(DIST_DIR, 'llms.txt');
const llmsContent = hasDist && fs.existsSync(llmsPath) ? fs.readFileSync(llmsPath, 'utf8') : null;

if (!hasDist) {
  warnings.push('尚未找到 dist/ 目錄，略過 HTML JSON-LD 與 dist/llms.txt 驗證（請先執行 npm run build）。');
} else if (llmsContent === null) {
  errors.push('dist/llms.txt 不存在，請檢查 src/pages/llms.txt.ts 是否正確建置。');
}

for (const post of publishedPosts) {
  checkedCount += 1;
  const { lang, slug, relPath, parsed } = post;
  const { data, body } = parsed;
  const isZh = lang === 'zh';

  // 1. 基本欄位必填檢查
  for (const field of ['title', 'description', 'pubDate', 'category']) {
    if (!data[field]) errors.push(`[${relPath}] 缺少必填欄位：${field}`);
  }
  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push(`[${relPath}] tags 不可為空`);
  }

  // 2. Title / Description 長度軟性提醒
  if (data.title) {
    if (isZh && data.title.length > 34) {
      warnings.push(`[${relPath}] title 長度 ${data.title.length} 字（建議 ≤ 34 字）`);
    } else if (!isZh && data.title.length > 65) {
      warnings.push(`[${relPath}] title 長度 ${data.title.length} 字元（建議 ≤ 65 字元）`);
    }
  }
  if (data.description) {
    if (isZh && (data.description.length < 40 || data.description.length > 110)) {
      warnings.push(`[${relPath}] description 長度 ${data.description.length} 字（建議 40–110 字）`);
    } else if (!isZh && (data.description.length < 90 || data.description.length > 180)) {
      warnings.push(`[${relPath}] description 長度 ${data.description.length} 字元（建議 90–180 字元）`);
    }
  }

  // 3. 雙語對應提醒
  const otherLang = isZh ? 'en' : 'zh';
  if (!publishedKeys.has(`${otherLang}:${slug}`)) {
    warnings.push(`[${relPath}] 缺少對應的 ${otherLang === 'en' ? '英文版' : '中文版'}（${otherLang}/${slug}.md）`);
  }

  // 4. notes / tools 完整 AEO 檢查
  if (data.category === 'notes' || data.category === 'tools') {
    if (!Array.isArray(data.faq) || data.faq.length < 3) {
      errors.push(`[${relPath}] 分類 ${data.category} 至少需要 3 題 faq（目前 ${(data.faq || []).length} 題）`);
    } else {
      for (const item of data.faq) {
        if (!item.q || !item.a) {
          errors.push(`[${relPath}] faq 存在空白的 q 或 a`);
          continue;
        }
        const mdPattern = /(\*\*|__|`|\[[^\]]+\]\(https?:\/\/)/;
        if (mdPattern.test(item.q) || mdPattern.test(item.a)) {
          errors.push(`[${relPath}] faq 含 Markdown 標記（會污染 JSON-LD）：${item.q}`);
        }
      }
    }

    const firstParagraph = body.trim().split(/\r?\n\r?\n/)[0] || '';
    if (!firstParagraph.trim().startsWith('**')) {
      warnings.push(`[${relPath}] 建議第一段使用粗體 Answer-First 直答句開頭`);
    }
    if (!/(\/en)?\/blog\//.test(body)) {
      warnings.push(`[${relPath}] 文內尚未包含站內文章互連（/blog/ 或 /en/blog/）`);
    }
  }

  // 5. 圖片 alt 與靜態資源存在檢查
  for (const imgMatch of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const [, alt, src] = imgMatch;
    if (!alt.trim()) {
      errors.push(`[${relPath}] 圖片缺少 alt 描述：${src}`);
    }
  }
  for (const assetMatch of body.matchAll(/\(\/(images|files)\/[^)\s]+\)/g)) {
    const assetRel = assetMatch[0].slice(2, -1); // e.g. images/...
    const assetFull = path.join(PUBLIC_DIR, assetRel);
    if (!fs.existsSync(assetFull)) {
      errors.push(`[${relPath}] 找不到參考資源檔案：public/${assetRel}`);
    }
  }

  // 6. 英文版標點與未清理註解檢查
  if (!isZh) {
    if (body.includes('／') || (data.title || '').includes('／') || (data.description || '').includes('／')) {
      errors.push(`[${relPath}] 英文版不可殘留全形斜線「／」`);
    }
    if (/[，。：；（）]/.test(body)) {
      warnings.push(`[${relPath}] 英文版內文疑有全形中文標點（，。：；（）），請確認是否為刻意引用`);
    }
  }
  if (/<!--\s*(TODO|待補|截圖待補|Screenshot to be added)/i.test(body)) {
    warnings.push(`[${relPath}] 內文仍殘留待補 HTML 註解`);
  }

  // 7. 若 dist/ 存在，驗證建置後的 JSON-LD 與 llms.txt 收錄
  if (hasDist) {
    const htmlPath = isZh
      ? path.join(DIST_DIR, 'blog', slug, 'index.html')
      : path.join(DIST_DIR, 'en', 'blog', slug, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      errors.push(`[${relPath}] 找不到建置後的 HTML：${path.relative(process.cwd(), htmlPath)}`);
    } else {
      const html = fs.readFileSync(htmlPath, 'utf8');
      const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      if (scripts.length === 0) {
        errors.push(`[${relPath}] 建置後 HTML 缺少 JSON-LD`);
      } else {
        const types = new Set();
        for (const s of scripts) {
          try {
            const parsedJson = JSON.parse(s[1].replace(/\\u003c/g, '<'));
            const items = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
            for (const item of items) types.add(item['@type']);
          } catch (err) {
            errors.push(`[${relPath}] JSON-LD 解析失敗：${err.message}`);
          }
        }
        if (!types.has('BlogPosting')) errors.push(`[${relPath}] 建置後 HTML 缺少 BlogPosting JSON-LD`);
        if (!types.has('BreadcrumbList')) errors.push(`[${relPath}] 建置後 HTML 缺少 BreadcrumbList JSON-LD`);
        if (Array.isArray(data.faq) && data.faq.length > 0 && !types.has('FAQPage')) {
          errors.push(`[${relPath}] 有設定 faq 但建置後 HTML 缺少 FAQPage JSON-LD`);
        }
      }
    }

    if (llmsContent !== null) {
      const expectedPath = isZh ? `/blog/${slug}/` : `/en/blog/${slug}/`;
      if (!llmsContent.includes(expectedPath)) {
        errors.push(`[${relPath}] dist/llms.txt 未收錄 ${expectedPath}`);
      }
    }
  }
}

console.log(`SEO／AEO 檢查完成：已檢查 ${checkedCount} 篇已發佈文章（略過 ${draftCount} 篇草稿）。`);
if (warnings.length > 0) {
  console.log(`\n[WARN] ${warnings.length} 項提醒：`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length > 0) {
  console.error(`\n[ERROR] ${errors.length} 項錯誤：`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n結果：0 ERROR，檢查通過。');
