---
title: NMAstudio 2.0 資料上傳教學：從 Excel 到互動式網路統合分析
description: NMAstudio 2.0（uiocloud.no）怎麼上傳資料？完整教學整理 long、wide 與 inverse-variance CSV、多結果欄位對應、遞移性檢查與匯入 CINeMA，附 4 份範例檔。
pubDate: 2026-11-25
updatedDate: 2026-11-28
category: notes
tags: [NMAstudio, 網路統合分析, 實證醫學, 研究方法]
draft: false
faq:
  - q: '為什麼舊教學的 nmastudioapp.com 連不上出現 503？NMAstudio 2.0 新網址是什麼？'
    a: '舊版網址 nmastudioapp.com 與說明書連結目前皆回傳 503 無法使用。開發團隊於 2026 年發表論文後，目前公開可用的 NMAstudio 2.0 架設在挪威雲端主機：https://nmastudio.uiocloud.no/。'
  - q: 'NMAstudio 2.0 欄位名稱需要像 MetaInsight 一樣完全固定嗎？'
    a: '大部分不需要。NMAstudio 2.0 會在 SETUP 頁面用下拉選單讓你手動對應各欄位角色，所以 Study ID、治療名稱、結果數值與共變數都可以自訂欄名；只有少數特殊欄位（例如治療分類 treat_class）必須使用固定欄名。'
  - q: '同時分析兩個結果指標（例如療效和副作用）時，可以共用同一個人數欄位嗎？'
    a: '不行。NMAstudio 2.0 規定下拉選單中的每個變數都必須對應到檔案裡不同的欄位，就算兩個結果的分母人數完全相同，也要拆成兩個欄位（例如 n_resp 和 n_ae）。此外，連續型與反變異數格式也都需要填入各組人數 n。'
  - q: 'NMAstudio 2.0 遇到 0 事件需要自己手動加 0.5 嗎？'
    a: '不需要。NMAstudio 2.0 會由系統自動處理：只有一組是 0 事件時會自動加 0.5 進行連續性校正，兩組都是 0 事件的研究則會自動排除。'
  - q: 'NMAstudio 2.0 和 MetaInsight 該選哪一個？可以跟 CINeMA 串接嗎？'
    a: '若需要貝氏（Bayesian）模型與統合迴歸，請選 MetaInsight；若需要同時並排比較多個結果、檢查遞移性圖表，並讓 league table 依證據等級自動上色，建議選 NMAstudio 2.0。你可以將 CINeMA 3.0.1 匯出的 Report CSV 直接上傳到 NMAstudio 的 CINeMA 分頁進行上色。'
---

**NMAstudio 2.0 的現行網址是 [https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/)，標準上傳流程為：進入 `SETUP` 後先按左上角 Reset 清空預設範例 → 上傳另存為 CSV UTF-8 的檔案 → 用下拉選單對應變數與各結果獨立的人數欄位 → 勾選效應修飾因子後點擊 `Run Analysis`。** 做網路統合分析（network meta-analysis, NMA）時，你可能會想做到這幾件事：

- 把「主要療效」和「嚴重不良事件」放在同一張聯合比較表（league table）
- 檢查遞移性（transitivity），也就是各組比較的研究族群是否夠相似
- 把 CINeMA 評出的證據確定性直接標在結果圖表上

如果是這樣，**NMAstudio** 會很好用。

> **免費線上 NMA 工具三部曲（第 2 篇）**：第 1 篇先用 [MetaInsight v7.1.1](/blog/metainsight-upload-tutorial/) 跑統計模型；本篇用 **NMAstudio 2.0** 並排比較多結果並做遞移性視覺檢查；第 3 篇用 [CINeMA 3.0.1](/blog/cinema-upload-tutorial/) 完成 GRADE 證據等級評定並匯回上色。

開始前先提醒一件事：舊文獻和教學常寫的網址 `https://www.nmastudioapp.com/`，以及說明書網址 `http://www.nmastudioapp.com/doc`，現在都會出現 503 錯誤，連不上。開發團隊在 2026 年發表論文後，目前公開可用的是 **NMAstudio 2.0**，架設在挪威的雲端主機上：[https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/)。本文以 2.0 版的實際介面和實測結果為準，帶你走完整理資料、上傳、核對的流程。

## 重點整理

- **改用 2.0 新網址**：舊站 `nmastudioapp.com` 已回傳 503，請直接前往 `nmastudio.uiocloud.no`。
- **僅接受 CSV 格式**：不支援直接上傳 `.xlsx`，請在 Excel 另存為 CSV UTF-8（逗號分隔）。
- **多結果不可共用人數欄**：每個變數都要對應不同的欄位（如 `n_resp`、`n_ae`），且連續型與反變異數（`iv`）格式的人數 `n` 實測皆為必填。
- **`treat_class` 上色只支援 Long 格式**：想依藥物分類幫網絡圖節點上色，請用 Long 格式並保留固定欄名 `treat_class`。
- **0 事件由系統自動處理**：單組 0 事件自動加 0.5 校正，雙組 0 事件自動排除。

## NMAstudio 2.0 是什麼？適合誰？

NMAstudio 是一個互動式的 NMA 網頁工具，由巴黎西岱大學（Université Paris Cité）Anna Chaimani 與 Silvia Metelli 團隊開發。它背後用 R 的 `netmeta` 套件，跑頻率學派（Frequentist）的隨機效應模型。

主要優點：

- 可以一次上傳多個結果指標。
- 在網頁上用下拉選單指定欄位，欄位名稱可以自己取。
- 提供遞移性的視覺檢查（箱型圖與散佈圖）。
- 可以匯入 CINeMA 報告，讓表格依證據等級上色。
- 一鍵產生 NMA-KIT 知識轉譯報告。

限制：

- 只支援頻率學派分析，沒有貝氏（Bayesian）排序，也沒有統合迴歸（meta-regression）。
- 有多個結果時，每個變數都要對應到不同的欄位，不能共用。
- 要設定的細節比 MetaInsight 多一些。

## 開始前：要準備哪些資料？

建議先在 Excel 把每篇納入的 RCT 整理好以下資訊：

1. **研究名稱（Study ID）與發表年份（Year）**
   - 每篇研究要有不重複的名稱，例如 `Chen_2021`。
   - `year` 可以不填。有填的話，結果頁會多一條時間軸滑桿，可以看網絡隨年代的變化。
2. **治療名稱（Treatment）與治療分類（Treatment Class，選填）**
   - 先決定好每個治療的簡稱，全表統一。
   - 如果想讓網絡圖的節點依藥物機轉自動上色，可以加一欄 `treat_class`（欄名固定，不能改）。
3. **偏誤風險（risk of bias, `rob`）**
   - 2.0 版為選填，以研究為單位，分低、中、高三級。
   - 可寫成 `1/2/3`、`l/m/h` 或 `L/M/H`。
   - 同一篇研究的每一列都要填一樣的值。
4. **一個或多個結果指標的數據**
   - **二元結果（binary）**：事件人數與總人數。
   - **連續結果（continuous）**：平均值、標準差與**各組人數**。注意：實測 2.0 版連續結果的人數 `n` 也是必填。
   - **反變異數格式（inverse-variance, `iv`）**：兩組比較的效應值 `TE`（例如 log OR 或 MD）、標準誤 `seTE`，以及兩組人數 `n1`、`n2`。
5. **效應修飾因子（effect modifiers，選填）**
   - 例如平均年齡、男性比例、基準疾病嚴重度。
   - 用來檢查遞移性。

## 選擇資料格式：Long、Wide 還是 IV？

NMAstudio 2.0 接受三種 CSV 格式。差別在於「一列代表什麼」，以及多臂試驗（multi-arm trial，三組以上的試驗）要怎麼拆成多列：

- **長格式（long）**：一列是一個治療組，三臂試驗就寫 3 列。**最推薦新手用**：欄名不用加 `1`、`2` 後綴，也完整支援用 `treat_class` 幫節點上色。
- **寬格式（wide）**：一列是一組兩兩比較（pairwise comparison）。所以三臂試驗要拆成 3 列（A vs B、A vs C、B vs C），**不能**另外加一欄 `treat3` 放第三組。
- **反變異數寬格式（`iv`）**：一樣是一列一組比較，但直接填已算好的相對效應 `TE` 和 `seTE`。適合原始論文只提供調整後效應值和信賴區間的情況。

| 資料格式 | 建議欄位（上傳後可自行對應欄名） | 備註 |
| --- | --- | --- |
| Binary, long（每列一個治療組） | `studlab, year, rob, treat, treat_class, r, n` | 多臂試驗最不容易填錯，支援 `treat_class` 上色 |
| Binary, wide（每列一組比較） | `studlab, year, rob, treat1, treat2, r1, n1, r2, n2` | 三臂以上試驗要拆成多列兩兩比較 |
| Continuous, long | `studlab, year, rob, treat, treat_class, y, sd, n` | 連續變項首選（2.0 版 `n` 必填） |
| Continuous, wide | `studlab, year, rob, treat1, treat2, y1, sd1, n1, y2, sd2, n2` | 連續變項的兩兩比較格式（2.0 版 `n1`、`n2` 必填） |
| Wide inverse-variance (`iv`) | `studlab, year, rob, treat1, treat2, TE, seTE, n1, n2` | 用於已算好的效應值（如 log OR、MD、SMD） |

## 欄位定義總表

NMAstudio 2.0 在 `SETUP` 頁面用下拉選單指定每個欄位的角色，所以大多數欄名都可以自己取。只有少數欄位（例如 `treat_class`）必須用固定名稱。

| 欄位角色 | Long 格式 | Wide／IV 格式 | 型別與寫法 | 必填／選填 |
| --- | --- | --- | --- | --- |
| 研究 ID (`studlab`) | 自訂（如 `studlab`） | 自訂（如 `studlab`） | 文字；同一研究各列要完全相同 | 必填 |
| 治療名稱 | `treat`（可自訂） | `treat1`、`treat2`（可自訂） | 文字；避免特殊符號 | 必填 |
| 偏誤風險 (`rob`) | 自訂（如 `rob`） | 自訂（如 `rob`） | `{1,2,3}`、`{l,m,h}` 或 `{L,M,H}` | 選填 |
| 發表年份 (`year`) | 自訂（如 `year`） | 自訂（如 `year`） | 4 位數西元年（整數） | 選填 |
| 二元結果 | 事件數 `r`、人數 `n` | `r1, n1, r2, n2` | 整數；多個結果要用不同欄位 | 二元必填 |
| 連續結果 | 平均 `y`、標準差 `sd`、人數 `n` | `y1, sd1, n1, y2, sd2, n2` | 數值；**實測 2.0 版 `n` 都必填** | 連續必填 |
| 反變異數 (`iv`) | — | `TE, seTE, n1, n2` | 數值；**實測 2.0 版 `n1, n2` 也必填** | IV 必填 |
| 治療分類（固定欄名） | `treat_class` | `treat1_class`、`treat2_class` | 文字；**欄名不能改**（實測寬格式不會幫網絡圖上色） | 選填 |
| 效應修飾因子 | 自訂（如 `mean_age`） | 自訂（如 `mean_age`） | 數值或類別；同一研究各列要相同 | 選填 |
| CINeMA 匯入檔 | 另外在 `CINeMA` 分頁上傳 | 另外在 `CINeMA` 分頁上傳 | CINeMA 匯出的原始 CSV（文獻指出需含 `Comparison`、`Confidence rating`） | 選填 |

## 範例資料：Binary 與 Continuous（Long／Wide）

範例沿用 MetaInsight 教學的資料：膝退化性關節炎 5 篇 RCT，其中 `Chen_2021` 是三臂試驗。

- **Binary**：兩個結果，`Pain_Relief`（疼痛緩解）與 `Adverse_Events`（不良事件）。
- **Continuous**：0–10 分疼痛量表 VAS，分數越低越好。

這四份檔案都已在 NMAstudio 2.0 實測跑完分析。後面步驟的截圖以 Binary Long 為例。

### 二元結果（Binary）：Long 格式（11 列，含兩個結果與 `treat_class`，推薦）

```csv
studlab,year,rob,treat,treat_class,r_resp,n_resp,r_ae,n_ae,mean_age
Lin_2019,2019,L,Placebo,Control,12,50,5,50,62.5
Lin_2019,2019,L,Oral_NSAID,NSAID,28,52,14,52,62.5
Wang_2020,2020,M,Placebo,Control,10,48,4,48,64.0
Wang_2020,2020,M,Topical_NSAID,NSAID,24,50,7,50,64.0
Chen_2021,2021,L,Placebo,Control,11,55,6,55,61.2
Chen_2021,2021,L,Oral_NSAID,NSAID,30,54,15,54,61.2
Chen_2021,2021,L,Topical_NSAID,NSAID,25,53,8,53,61.2
Tanaka_2022,2022,M,Oral_NSAID,NSAID,26,49,13,49,66.8
Tanaka_2022,2022,M,IA_HA,Injection,29,50,6,50,66.8
Kim_2023,2023,H,Placebo,Control,14,60,6,60,63.4
Kim_2023,2023,H,IA_HA,Injection,35,61,7,61,63.4
```

下載範例：[nmastudio-example-long.csv](/files/nmastudio-upload-tutorial/nmastudio-example-long.csv)

### 二元結果（Binary）：Wide 格式（7 列，三臂試驗拆成 `k(k−1)/2 = 3` 列）

```csv
studlab,year,rob,treat1,treat2,treat1_class,treat2_class,r1_resp,n1_resp,r2_resp,n2_resp,r1_ae,n1_ae,r2_ae,n2_ae,mean_age
Lin_2019,2019,L,Placebo,Oral_NSAID,Control,NSAID,12,50,28,52,5,50,14,52,62.5
Wang_2020,2020,M,Placebo,Topical_NSAID,Control,NSAID,10,48,24,50,4,48,7,50,64.0
Chen_2021,2021,L,Placebo,Oral_NSAID,Control,NSAID,11,55,30,54,6,55,15,54,61.2
Chen_2021,2021,L,Placebo,Topical_NSAID,Control,NSAID,11,55,25,53,6,55,8,53,61.2
Chen_2021,2021,L,Oral_NSAID,Topical_NSAID,NSAID,NSAID,30,54,25,53,15,54,8,53,61.2
Tanaka_2022,2022,M,Oral_NSAID,IA_HA,NSAID,Injection,26,49,29,50,13,49,6,50,66.8
Kim_2023,2023,H,Placebo,IA_HA,Control,Injection,14,60,35,61,6,60,7,61,63.4
```

下載範例：[nmastudio-example-wide.csv](/files/nmastudio-upload-tutorial/nmastudio-example-wide.csv)

### 連續結果（Continuous）：Long 格式（11 列，VAS 疼痛分數，推薦）

這份改用 VAS 疼痛分數：各組平均值 `vas_mean`、標準差 `vas_sd`、總人數 `vas_n`（分數越低代表越不痛）：

```csv
studlab,year,rob,treat,treat_class,vas_mean,vas_sd,vas_n,mean_age
Lin_2019,2019,L,Placebo,Control,5.9,1.5,50,62.5
Lin_2019,2019,L,Oral_NSAID,NSAID,3.9,1.4,52,62.5
Wang_2020,2020,M,Placebo,Control,5.8,1.6,48,64.0
Wang_2020,2020,M,Topical_NSAID,NSAID,4.3,1.5,50,64.0
Chen_2021,2021,L,Placebo,Control,6.0,1.5,55,61.2
Chen_2021,2021,L,Oral_NSAID,NSAID,3.8,1.4,54,61.2
Chen_2021,2021,L,Topical_NSAID,NSAID,4.2,1.5,53,61.2
Tanaka_2022,2022,M,Oral_NSAID,NSAID,4.0,1.4,49,66.8
Tanaka_2022,2022,M,IA_HA,Injection,3.4,1.4,50,66.8
Kim_2023,2023,H,Placebo,Control,5.7,1.7,60,63.4
Kim_2023,2023,H,IA_HA,Injection,3.5,1.5,61,63.4
```

下載範例：[nmastudio-example-continuous-long.csv](/files/nmastudio-upload-tutorial/nmastudio-example-continuous-long.csv)

### 連續結果（Continuous）：Wide 格式（7 列）

```csv
studlab,year,rob,treat1,treat2,treat1_class,treat2_class,vas_y1,vas_sd1,vas_n1,vas_y2,vas_sd2,vas_n2,mean_age
Lin_2019,2019,L,Placebo,Oral_NSAID,Control,NSAID,5.9,1.5,50,3.9,1.4,52,62.5
Wang_2020,2020,M,Placebo,Topical_NSAID,Control,NSAID,5.8,1.6,48,4.3,1.5,50,64.0
Chen_2021,2021,L,Placebo,Oral_NSAID,Control,NSAID,6.0,1.5,55,3.8,1.4,54,61.2
Chen_2021,2021,L,Placebo,Topical_NSAID,Control,NSAID,6.0,1.5,55,4.2,1.5,53,61.2
Chen_2021,2021,L,Oral_NSAID,Topical_NSAID,NSAID,NSAID,3.8,1.4,54,4.2,1.5,53,61.2
Tanaka_2022,2022,M,Oral_NSAID,IA_HA,NSAID,Injection,4.0,1.4,49,3.4,1.4,50,66.8
Kim_2023,2023,H,Placebo,IA_HA,Control,Injection,5.7,1.7,60,3.5,1.5,61,63.4
```

下載範例：[nmastudio-example-continuous-wide.csv](/files/nmastudio-upload-tutorial/nmastudio-example-continuous-wide.csv)

## 在 Excel 整理與另存 CSV 的注意事項

1. **每個結果都要有自己的人數欄位**
   - NMAstudio 2.0 規定：下拉選單裡的每個變數，都要對應到檔案中不同的欄位。
   - 就算「療效」和「副作用」的分母完全一樣，也要像上面範例一樣拆成 `n_resp` 和 `n_ae`（或 `N` 和 `N2`）。同一欄不能同時給兩個結果用。
2. **研究層級的欄位要一致**
   - 同一篇研究的 `year`、`rob`，以及要拿來檢查遞移性的效應修飾因子（例如 `mean_age`），每一列都要填一樣的值。
   - 沒有資料就留白，不要填 `NA` 這類文字。
   - 小數點一律用半形句點 `.`。
3. **0 事件不用自己處理**
   - 有些舊工具要你先手動算好才能上傳。NMAstudio 2.0 會自動處理，並在分析進度視窗寫明規則：
   - **只有一組是 0 事件**：自動加 **0.5 連續性校正（continuity correction）**。
   - **兩組都是 0 事件**：該研究自動排除。
4. **只能上傳 CSV**
   - 介面上寫著 `* The dataset should be uploaded as the csv format`。
   - 請在 Excel 另存為 **CSV UTF-8（逗號分隔）（*.csv）**，不要直接上傳 `.xlsx`。
5. **可以先下載官方範例參考**
   - 首頁有完整的乾癬範例：158 篇 RCT、20 種藥物，資料來自 Sbidian 等人的 Cochrane 回顧。
   - 可下載 `psoriasis_long_complete.csv`、`variables_explain.pdf`，以及 `SETUP` 頁面裡的 `data format.pdf`。

## 逐步上傳與欄位對應

### 步驟 1：開啟 NMAstudio 2.0，進入 SETUP

開啟 [https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/)。首頁會看到四步驟流程圖和 **Welcome to NMAstudio 2.0** 標題。點右上角導覽列的 **SETUP**。

![NMAstudio 2.0 首頁，紅框標示右上角的 SETUP 分頁](/images/blog/nmastudio-upload-tutorial/01-home.png)
*確認左上角是 NMAstudio 2.0 的標誌，再點右上角 SETUP 開始設定。*

### 步驟 2：清除預設專案、填專案資訊、上傳 CSV

1. 進入 `SETUP` 後，系統可能已載入預設的乾癬範例。先點左上角的**圓形箭頭（Reset）圖示**清空專案，確認視窗按確定後，才能上傳自己的資料。
2. 填寫 `Project title`，按 `OK`。`Protocol link` 雖然有紅字標示必填，但實測留白也能正常分析。
3. 把 CSV 拖進上傳框，或點 `Select a File` 選檔。
4. 在下方選擇格式：**long**、**wide** 或 **iv**。

![SETUP 頁面上方的 Reset 按鈕、專案標題、CSV 上傳框與格式選項](/images/blog/nmastudio-upload-tutorial/02-setup-upload-format.png)
*換資料前一定要先按左上角的 Reset 圖示。看到檔名出現在上傳框旁，再選資料格式。*

### 步驟 3：對應整體變數（Select overall variables）

選好格式後，下方會出現 `Select overall variables`。把 CSV 的欄名依序對應到：

- `study ID`：本例選 `studlab`
- `treat`：本例選 `treat`
- `rob` 與 `year`（選填）

右側紅框提醒：`rob` 只接受 `{1,2,3}`、`{l,m,h}` 或 `{L,M,H}`。

![Select overall variables 的下拉選單，右側為 rob 的編碼規則](/images/blog/nmastudio-upload-tutorial/03-overall-variables.png)
*欄名可以自己取，只要對應正確就能讀取。同一研究各列的 rob 要一致。*

### 步驟 4：設定結果數量與各結果的欄位

1. 在 `Enter the number of outcomes:` 輸入結果數量。本例輸入 `2`，按 `OK`。
2. 有 2 個以上結果時，勾選要一起放進聯合比較表的兩個結果。只有 1 個結果就勾 `Skip`。
3. 設定 Outcome 1：`binary`，命名 `Pain_Relief`，選 `OR`、`beneficial`，對應 `r_resp` 和 `n_resp`。
4. 點 **Next**，設定 Outcome 2：`Adverse_Events`，選 `OR`、`harmful`，對應 `r_ae` 和 `n_ae`。

如果用的是上面的連續結果範例檔：結果數量輸入 `1`，聯合比較表勾 `Skip`；類型選 `continuous`，再選 `MD`、`harmful`，依序對應 `vas_mean`、`vas_sd`、`vas_n`。

![設定兩個結果的名稱、效應量方向與 Outcome 1 的欄位對應，右側提示各欄不能重複選](/images/blog/nmastudio-upload-tutorial/04-outcome-mapping.png)
*右側提醒：每個下拉選單都要選不同的欄位。如果 Next 按不下去，多半是漏填或選到重複的欄位。*

### 步驟 5：勾選效應修飾因子，執行分析

所有結果設定完後，下方會出現 `Select potential effect modifiers`。

1. 勾選想在遞移性圖表中檢視的變數。本例勾 `mean_age`；不需要檢查就勾 `Skip`。
2. 捲到最底部，點 **Run Analysis**。

![勾選效應修飾因子 mean_age 的區塊](/images/blog/nmastudio-upload-tutorial/05-effect-modifiers.png)
*勾選要檢查的共變數（如 `mean_age`）或勾 Skip，最底部的 Run Analysis 才能點。*

接著會跳出 `Running data analysis` 進度視窗，裡面有四個項目：Network meta-analysis、Pairwise meta-analysis、League table, Consistency and Ranking、Funnel plot。四項都出現綠色勾勾後，會自動跳到結果頁。

![Running data analysis 視窗，顯示 0 事件的自動校正規則，四項分析都已打勾完成](/images/blog/nmastudio-upload-tutorial/06-running-analysis.png)
*視窗也寫明系統用 `netmeta` 隨機效應模型：單組 0 事件自動加 0.5 校正，兩組都是 0 事件的研究則排除。*

## 上傳後怎麼確認資料讀對了？

畫面會跳到上方的 **RESULTS** 分頁，預設停在 `Data & Transitivity`。建議做三項快速檢查：

1. **看左側網絡圖是否連通、顏色是否正確**
   - 預設的 `Circle` 排版可能會切到邊緣節點。可以點左上角 **Graph Options** → `Graph Layout`，改成 **Cose**。
   - 再把 `Node colour` 改成 **By class**，節點就會依 `treat_class` 分色。
   - 確認網絡完整連通：`Placebo`、`Oral_NSAID`、`Topical_NSAID`、`IA_HA` 之間沒有斷開。
2. **看右側 `Converted Data` 是否正確拆開多臂試驗**
   - 點開 `Converted Data` 分頁，確認三臂試驗 `Chen_2021` 已拆成 3 列兩兩比較：`Placebo vs Oral_NSAID`、`Placebo vs Topical_NSAID`、`Oral_NSAID vs Topical_NSAID`。
   - 確認 `TE1`、`TE2` 有正常算出來。

![RESULTS 頁面的網絡圖與右側 Converted Data，節點依治療分類上色，三臂試驗已拆成三列比較](/images/blog/nmastudio-upload-tutorial/07-results-network-converted.png)
*左上角 Graph Options 可調整排版（Cose）和分類上色（By class）；右側可核對系統轉換後的兩兩比較。*

3. **切到 `Imported Data` 核對原始資料**
   - 點右側的 `Imported Data` 分頁，確認長格式的 11 列（5 篇研究）都在，沒有亂碼或數值錯位。
   - 往下捲還能看到 `mean_age` 的遞移性箱型圖和散佈圖。

![切到 Imported Data 分頁，核對上傳的 11 列原始資料](/images/blog/nmastudio-upload-tutorial/08-results-imported-data.png)
*在這裡逐列核對原始數據、偏誤風險編碼和年齡，沒問題再去看結果。*

資料確認無誤後，可以用上方的 `Select results to display` 下拉選單切換：

- `League tables`：可並排顯示 `Pain_Relief` 和 `Adverse_Events` 兩個結果的表格
- `Ranking`
- `Consistency & Reporting bias`

如果你已經在 [CINeMA 網頁系統](https://cinema.med.auth.gr/) 做完證據確定性評估（操作步驟見第 3 篇：[CINeMA 3.0.1 上傳教學](/blog/cinema-upload-tutorial/)），可以切到上方的 **CINeMA** 分頁，依各結果名稱分別上傳報告 CSV。League table 就會依證據確定性自動上色。

![CINeMA 分頁，每個結果各有一個報告上傳區](/images/blog/nmastudio-upload-tutorial/09-cinema-tab.png)
*要整合多個結果的證據等級，請在這裡依結果名稱，分別上傳對應的 CINeMA 匯出報告。*

## 常見錯誤排除

| 狀況 | 常見原因 | 解決方式 |
| --- | --- | --- |
| 打開 `nmastudioapp.com` 出現 503 錯誤 | 舊網址已停止服務 | 改用 NMAstudio 2.0 的網址 [https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/) |
| 設定到一半，`Next` 或 `Run Analysis` 沒出現 | 選到重複的欄位；連續或 IV 格式漏填人數 `n`；只有 1 個結果卻沒勾 `Skip` | 確認每個結果都有自己的人數欄位；連續和 IV 格式都有對應 `n` 或 `n1`、`n2`；只有 1 個結果時，在聯合比較表那一步勾 `Skip` |
| 同一研究出現錯誤訊息 | 同一研究各列的 `rob`、`year` 或效應修飾因子不一致 | 回 Excel 把同一研究每一列的 `rob`、年份和共變數改成一樣 |
| 寬格式的三臂試驗匯入失敗 | 自己加了 `treat3`、`r3` 欄位 | 寬格式的三臂試驗必須拆成 3 列兩兩比較 |
| 上傳新檔後還是顯示舊資料 | 上一輪的專案沒有清空 | 點 `SETUP` 左上角的 Reset 圖示，或重新整理、重開瀏覽器分頁後再上傳 |
| 寬格式選 `By class` 後節點沒變色 | 實測 2.0 版寬格式不會依 `treat1_class`、`treat2_class` 上色 | 如果需要依藥物分類上色，改用 Long 格式加上 `treat_class` 欄位 |

## 延伸閱讀與工具比較

如果你的研究需要**貝氏 NMA**，或要對共變數做**統合迴歸**，建議搭配第 1 篇：[MetaInsight v7.1.1 資料上傳教學：從 Excel 到網路統合分析](/blog/metainsight-upload-tutorial/)；想完成 **GRADE 證據確定性評估**並將評級匯回 NMAstudio 上色，請接著看第 3 篇：[CINeMA 3.0.1 上傳教學：評估網路統合分析 GRADE 證據可信度](/blog/cinema-upload-tutorial/)。

一句話區分：**MetaInsight 強在貝氏模型與統合迴歸；NMAstudio 2.0 強在多結果並排呈現，以及整合 CINeMA 證據等級。**

## 參考資料

1. Yu T, Metelli S, Papakonstantinou T, Chaimani A. NMAstudio 2.0: An interactive tool for network meta-analysis to enhance understanding, interpretation, and communication of the findings. *Research Synthesis Methods*. 2026;17(4):1–14. DOI: [10.1017/rsm.2026.10074](https://doi.org/10.1017/rsm.2026.10074)
2. Metelli S, Chaimani A. NMAstudio web-application: A brief tutorial（1.0 版操作指南與 CINeMA 報表欄位說明）：[https://silviametelli.com/NMAstudio_tutorial.pdf](https://silviametelli.com/NMAstudio_tutorial.pdf)
3. NMAstudio 2.0 官方網頁應用程式：[https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/)（內附資料格式說明 `data format.pdf` 與乾癬範例資料 `psoriasis_long_complete.csv`）
