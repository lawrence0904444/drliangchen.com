# drliangchen.com 專案規範（AI 寫作與 SEO／AEO 預設指南）

本專案是陳亮醫師（Liang Chen, MD）的雙語個人網站（Astro 靜態建置，部署於 GitHub Pages；中文 `/`、英文 `/en/`）。所有給使用者的回覆與繁體中文文章一律使用台灣繁體中文用語。

## 網站技術架構重點

- **結構化資料（JSON-LD）**：[src/components/PostPage.astro](src/components/PostPage.astro) 會自動為每篇文章輸出 `BlogPosting` 與 `BreadcrumbList`；只要 frontmatter 填寫 `faq`，會自動在文末渲染常見問題區塊並輸出 `FAQPage` JSON-LD。
- **AI 探索檔（llms.txt）**：[src/pages/llms.txt.ts](src/pages/llms.txt.ts) 會在建置時自動收錄所有已發佈文章（`draft: false`），不需手動維護。
- **Sitemap 與 hreflang**：[astro.config.mjs](astro.config.mjs) 會自動產生含中英 `hreflang` 對應的 `sitemap-index.xml`。

## 新增與修訂文章預設工作流

1. **預設一律雙語**：新增文章時，除非使用者明確指定只寫中文，否則**預設一律同時產出繁體中文版與英文版**：
   - 中文版：`src/content/blog/<slug>.md`
   - 英文版：`src/content/blog/en/<slug>.md`（必須使用完全相同的 `<slug>`，頁首語言切換鈕與 `hreflang` 才會互連）
2. **Slug 與更新日期規範**：
   - 新文章檔名使用小寫英數與連字號（kebab-case，例如 `my-new-post.md`）。
   - **修訂已發佈文章時，絕對不要更改原檔名／slug**，以免破壞已收錄連結；改為在 frontmatter 填寫或更新 `updatedDate: YYYY-MM-DD`。
3. **跨語系連結與標點**：
   - 中文版站內文章連結使用 `/blog/<slug>/`，英文版必須對應為 `/en/blog/<slug>/`。
   - 英文版嚴禁殘留全形中文標點（特別是全形斜線 `／`，以及全形 `，。：；（）`）。

## SEO／AEO 寫作規範（依分類差異化）

### 1. 所有已發佈文章必填（`notes`、`tools`、`essays`）

- **`title`**：包含核心關鍵字（工具教學建議含版本號），控制長度以利搜尋結果完整顯示（中文建議 ≤ 32 字；英文建議 ≤ 60 字元）。
- **`description`**：直覺呈現文章能解決的問題或重點內容（中文建議 60–95 字；英文建議 120–160 字元）。若 YAML 值內含半形冒號 `: `，務必用單引號或雙引號包覆。
- **`tags`**：必須包含主題與工具／核心名詞本身（例如 `MetaInsight`、`NMAstudio`、`CINeMA`、`Cochrane`）。
- **圖片與資源**：每張圖片皆須填寫具體描述畫面的 `alt` 文字，並確認對應檔案存在於 `public/images/`（範例檔存在於 `public/files/`）。
- **外部連結**：確認為現行有效網址，不引用已知停用或舊轉址網址。

### 2. `notes`（筆記）與 `tools`（工具）強制完整 AEO 結構

- **Answer-First 開頭**：第一段以**粗體一句話**直接回答文章核心問題或完整操作流程，讓搜尋引擎摘要與 AI 引擎能直接擷取。
- **重點整理（Key points）**：在文章前段提供 4–5 點條列式重點摘要。
- **系列導覽與站內互連**：若屬系列文章，於文首放置統一導覽 blockquote，並於文末互連相關站內文章。
- **結構化 FAQ（`faq` frontmatter）**：撰寫 4–6 題高搜尋意圖的真實問答。
  - `q` 與 `a` **必須為純文字，嚴禁任何 Markdown 符號**（如 `**`、反引號 `` ` ``、`[文字](網址)`），避免污染 `FAQPage` JSON-LD。

### 3. `essays`（隨筆）

- 保留自然散文節奏；須符合上述基礎 SEO（`title`、`description`、`tags`、圖片 `alt`），Answer-First、重點整理與 `faq` 為選填。

## 醫師發文合規檢查（發佈前必檢）

- 病例已徹底去識別化（日期、科別、罕見診斷組合皆須檢查）。
- 不含招攬病患、療效保證等醫療廣告用語。
- 不以醫院名義發言，維持個人學習筆記與臨床心得立場。

## 發佈前驗證與 Git 注意事項

1. 每次新增或修改文章後，**必須執行以下指令**並確認零 ERROR（軟性 WARN 可依情境評估）：
   ```bash
   npm run build
   npm run check:seo
   ```
2. **禁止將私人或暫存未追蹤檔加入 Git**（例如根目錄的 `github-recovery-codes.txt`、`preview-*.html`）。建立 commit 時僅明確 `git add` 本次異動檔案。
