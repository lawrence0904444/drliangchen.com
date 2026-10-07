# drliangchen.com

陳亮醫師的個人網站，用 [Astro](https://astro.build) 建置，部署在 GitHub Pages。

## 日常操作

```bash
npm run dev      # 本機預覽 http://localhost:4321（存檔即時更新）
npm run build    # 建置到 dist/
```

## 寫文章

在 `src/content/blog/` 新增一個 `.md` 檔，檔名就是網址（`my-post.md` → `/blog/my-post/`）：

```markdown
---
title: 文章標題
description: 一句話摘要（會出現在列表與搜尋結果）
pubDate: 2026-10-20
category: notes        # notes 筆記 / tools 工具 / essays 隨筆
tags: [實證醫學]
draft: true            # 草稿不會發佈；寫完改 false 或刪掉這行
---

內文用 Markdown 寫。
```

### 英文版（選擇性）

網站分中文（`/`）與英文（`/en/`）兩套。要提供某篇的英文版，在 `src/content/blog/en/` 放一個**同檔名**的 `.md`（`en/my-post.md` → `/en/blog/my-post/`），frontmatter 格式相同、內容寫英文。

- 有英文版的文章，頁首「English／中文」按鈕會直接切換到對應的那篇
- 沒有英文版的文章不會出現在英文版文章列表；在該篇按 English 會回到英文文章列表
- 分類名稱、RSS（`/en/rss.xml`）英文版會自動處理

## 要填的地方

- `src/data/cv.ts`：簡歷資料，中英文共用（改一次，`/cv/` 與 `/en/cv/` 一起更新；空的區塊不會顯示）
- `src/pages/about.astro`、`src/pages/en/about.astro`：關於我（中、英各一份）
- `src/i18n.ts`：頁首、頁尾、分類名稱等介面文字

## 第一次部署（只要做一次）

1. 在 GitHub 建一個新的 repo（例如 `drliangchen.com`），把這個資料夾 push 上去（分支 `main`）
2. Repo → Settings → Pages → Source 選 **GitHub Actions**
3. 同一頁 Custom domain 填 `drliangchen.com`，等 DNS 生效後勾選 **Enforce HTTPS**
4. 到網域註冊商的 DNS 設定新增：

| 類型 | 名稱 | 值 |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<你的 GitHub 帳號>.github.io` |

之後每次 push 到 `main`，GitHub Actions 會自動建置並更新網站。

## 發文前檢查

- 病例已徹底去識別化（日期、科別、罕見診斷組合也算）
- 沒有招攬病患、療效保證等醫療廣告用語
- 沒有以醫院名義發言
