---
title: MetaInsight 資料上傳教學：從 Excel 到網路統合分析
description: 手把手整理 long／wide 格式資料並上傳到 MetaInsight（v7.1.1），附可直接複製的範例 CSV、Excel 整理技巧與常見錯誤排除。
pubDate: 2026-11-25
category: notes
tags: [實證醫學, 網路統合分析, 研究方法]
draft: false
---

如果你已經會用 RevMan 或 R 做傳統的成對統合分析（pairwise meta-analysis），第一次做網路統合分析（network meta-analysis, NMA）時，最常卡關的通常不是統計模型，而是「檔案一上傳就報錯」。

這篇以台灣臨床醫師與研究生最常用的 **MetaInsight** 為例，介面以 2026 年 6 月更新的 v7.1.1 為準。

網址是 `https://crsu-metainsight.le.ac.uk/MetaInsight/`。**結尾一定要有斜線 `/`**，少了會出現 404。

本文只談三件事：在 Excel 整理資料、轉存成 CSV、上傳後確認資料讀對了。圖表怎麼判讀，之後另寫一篇。

## MetaInsight 是什麼？適合誰用？

MetaInsight 是英國萊斯特大學（University of Leicester）複雜系統評價支援小組（CRSU）開發的網頁工具，不用寫程式。它在背後呼叫 R 的 `netmeta`、`gemtc` 與 `bnma` 套件。

醫學生、PGY、住院醫師或研究生，不論是論文初探還是正式分析，都可以用它快速做出：

- 網絡圖（network plot）
- 森林圖（forest plot）
- 不一致性檢定（inconsistency test）
- 治療排序機率

**優點：**

- 免安裝，介面分成一個個模組，照著點就好。
- 同時支援頻率學派（Frequentist）與貝氏（Bayesian）分析，也能做統合迴歸（meta-regression）。

**缺點：**

- 一次只能分析一個結果指標（outcome）。
- 治療名稱和多臂試驗（multi-arm trial）的欄位格式要求很嚴格。
- 免費的線上伺服器在很多人同時使用時，偶爾會變慢。

> **版本提醒：** MetaInsight 主站已改版為 v7.1.1（2026-06-17 更新），和網路上許多舊教學截圖的 v5／v6 介面不同。舊版暫時保留在 `https://crsu.shinyapps.io/MetaInsight_V6/`。操作請以 v7.1.1 為準。

## 開始前：先萃取好哪些資料？

打開 Excel 之前，先確認你已經從納入的隨機對照試驗（RCT）整理出以下資料：

1. **研究名稱（Study ID）**：每篇研究要有一個不重複的名稱，建議用「第一作者_年份」，例如 `Chen_2021`。
2. **各治療臂（treatment arm）的名稱**：全篇統一用同一套簡稱，**只能用英文字母、數字和底線 `_`**。
3. **結果資料（outcome data）**：
   - **二元結果（binary outcome）**：每一臂的事件人數（events, `R`）和總人數（sample size, `N`）。例如「疼痛緩解達 50% 的人數」。
   - **連續結果（continuous outcome）**：每一臂的總人數（`N`）、平均值（`Mean`）和標準差（`SD`）。
4. **（選填）研究層級的共變數（covariate）與偏誤風險（risk of bias, RoB）**：之後如果想做統合迴歸或匯出 CINeMA 報表，可以先整理平均年齡、追蹤週數或 RoB 評等。

## 選擇資料格式：長格式 vs 寬格式

MetaInsight 支援兩種排法，用哪一種都可以：

- **長格式（long format）**：一列是一個治療臂。有三臂以上的試驗，或要整理很多共變數時，建議用這種。
- **寬格式（wide format）**：一列是一篇研究。如果全是兩臂試驗，又習慣左右並排核對人數，這種也很直覺。

| 資料格式 | 必填欄位名稱 | 備註 |
| --- | --- | --- |
| Binary, long（一列一個治療臂） | `Study, T, R, N` | 多臂試驗最不容易填錯，最推薦 |
| Binary, wide（一列一篇研究） | `Study, T.1, R.1, N.1, T.2, R.2, N.2, ...` | 最多到 `.6`（六臂試驗） |
| Continuous, long（一列一個治療臂） | `Study, T, N, Mean, SD` | 連續結果首選 |
| Continuous, wide（一列一篇研究） | `Study, T.1, Mean.1, SD.1, N.1, T.2, ...` | 兩臂研究的 `.3` 欄位留白 |

## 欄位定義總表

MetaInsight 的欄位名稱是固定的，而且**區分大小寫**。系統不會讓你手動對應欄位，所以表頭每個字母、每個大小寫都要完全一樣：

| 欄位名稱 | 適用格式／結果 | 意思 | 型別 | 必填／選填 |
| --- | --- | --- | --- | --- |
| `Study` | 全部 | 研究名稱，不可重複（建議 `作者_年份`） | 文字 | 必填 |
| `T` / `T.1`..`T.6` | Long / Wide | 治療名稱（只能用英數和底線 `_`） | 文字 | 必填 |
| `R` / `R.1`..`R.6` | 二元結果 | 這一臂發生事件的人數 | 整數／數值 | 二元必填 |
| `N` / `N.1`..`N.6` | 二元與連續 | 這一臂的總人數 | 整數 | 必填 |
| `Mean` / `Mean.1`..`Mean.6` | 連續結果 | 這一臂的結果平均值 | 數值 | 連續必填 |
| `SD` / `SD.1`..`SD.6` | 連續結果 | 這一臂的結果標準差 | 數值（> 0） | 連續必填 |
| `covar.<名稱>` | 全部 | 研究層級共變數（給統合迴歸用） | 數值 | 選填 |
| `rob` | 全部 | 研究整體偏誤風險（`1`=低、`2`=中、`3`=高） | 整數（1/2/3） | 選填 |
| `indirectness` | 全部 | 研究的間接性（`1`=低、`2`=中、`3`=高，匯出 CINeMA 用） | 整數（1/2/3） | 選填 |
| `rob.<項目>` | 全部 | 個別 RoB 面向（最多 10 欄，編碼 `1`/`2`/`3`） | 整數（1/2/3） | 選填 |

> **實務提醒：** 官網 `Load data` → `Guidance` 頁面和範例資料，現在都直接填治療名稱。不用再像 v4 以前那樣另外準備 `Number`／`Label` 對照檔。
>
> 如果你手上是 v5.0 以前的舊檔（有 `StudyID` 欄、`T` 用數字編碼），請用左側 `Setup` → `Upgrade old data` 轉換。

## 範例資料：Binary 與 Continuous（Long／Wide）

下面用同一組假想資料示範：「膝退化性關節炎止痛治療」，共 5 篇 RCT、4 種治療（`Placebo`、`Oral_NSAID`、`Topical_NSAID`、`IA_HA`）。其中 `Chen_2021` 是三臂試驗。

- **Binary**：止痛有效的人數。
- **Continuous**：0–10 分的疼痛量表 VAS，分數越低越不痛。

四份範例都已在 MetaInsight v7.1.1 實際上傳成功。後面的操作截圖以 Binary Long 為主。

### 二元結果（Binary）：Long 格式（推薦）

一篇研究有幾個治療臂，就佔幾列。研究層級的欄位（如 `covar.age`），同一篇研究的每一列都要填一模一樣的數值。

```csv
Study,T,R,N,covar.age
Lin_2019,Placebo,12,50,62.5
Lin_2019,Oral_NSAID,28,52,62.5
Wang_2020,Placebo,10,48,64.0
Wang_2020,Topical_NSAID,24,50,64.0
Chen_2021,Placebo,11,55,61.2
Chen_2021,Oral_NSAID,30,54,61.2
Chen_2021,Topical_NSAID,25,53,61.2
Tanaka_2022,Oral_NSAID,26,49,66.8
Tanaka_2022,IA_HA,29,50,66.8
Kim_2023,Placebo,14,60,63.4
Kim_2023,IA_HA,35,61,63.4
```

下載範例：[metainsight-example-long.csv](/files/metainsight-upload-tutorial/metainsight-example-long.csv)

### 二元結果（Binary）：Wide 格式

一篇研究的所有治療臂橫向排開，用 `.1`、`.2`、`.3` 區分不同臂（v7.1.1 最多到 `.6`，也就是六臂試驗）。兩臂試驗的 `.3` 欄位直接留白。

```csv
Study,T.1,R.1,N.1,T.2,R.2,N.2,T.3,R.3,N.3,covar.age
Lin_2019,Placebo,12,50,Oral_NSAID,28,52,,,,62.5
Wang_2020,Placebo,10,48,Topical_NSAID,24,50,,,,64.0
Chen_2021,Placebo,11,55,Oral_NSAID,30,54,Topical_NSAID,25,53,61.2
Tanaka_2022,Oral_NSAID,26,49,IA_HA,29,50,,,,66.8
Kim_2023,Placebo,14,60,IA_HA,35,61,,,,63.4
```

下載範例：[metainsight-example-wide.csv](/files/metainsight-upload-tutorial/metainsight-example-wide.csv)

### 連續型結果（Continuous）：Long 格式（推薦）

研究結構和上面完全一樣，只是改用 VAS 的各組平均值 `Mean`、標準差 `SD` 和人數 `N`。分數越低，代表疼痛改善越多。

```csv
Study,T,Mean,SD,N,covar.age
Lin_2019,Placebo,5.9,1.5,50,62.5
Lin_2019,Oral_NSAID,3.9,1.4,52,62.5
Wang_2020,Placebo,5.8,1.6,48,64.0
Wang_2020,Topical_NSAID,4.3,1.5,50,64.0
Chen_2021,Placebo,6.0,1.5,55,61.2
Chen_2021,Oral_NSAID,3.8,1.4,54,61.2
Chen_2021,Topical_NSAID,4.2,1.5,53,61.2
Tanaka_2022,Oral_NSAID,4.0,1.4,49,66.8
Tanaka_2022,IA_HA,3.4,1.4,50,66.8
Kim_2023,Placebo,5.7,1.7,60,63.4
Kim_2023,IA_HA,3.5,1.5,61,63.4
```

下載範例：[metainsight-example-continuous-long.csv](/files/metainsight-upload-tutorial/metainsight-example-continuous-long.csv)

### 連續型結果（Continuous）：Wide 格式

兩臂研究的 `T.3`、`Mean.3`、`SD.3`、`N.3` 四欄都要留白，逗號數量要對齊，不然 `covar.age` 會跑到錯的欄位：

```csv
Study,T.1,Mean.1,SD.1,N.1,T.2,Mean.2,SD.2,N.2,T.3,Mean.3,SD.3,N.3,covar.age
Lin_2019,Placebo,5.9,1.5,50,Oral_NSAID,3.9,1.4,52,,,,,62.5
Wang_2020,Placebo,5.8,1.6,48,Topical_NSAID,4.3,1.5,50,,,,,64.0
Chen_2021,Placebo,6.0,1.5,55,Oral_NSAID,3.8,1.4,54,Topical_NSAID,4.2,1.5,53,61.2
Tanaka_2022,Oral_NSAID,4.0,1.4,49,IA_HA,3.4,1.4,50,,,,,66.8
Kim_2023,Placebo,5.7,1.7,60,IA_HA,3.5,1.5,61,,,,,63.4
```

下載範例：[metainsight-example-continuous-wide.csv](/files/metainsight-upload-tutorial/metainsight-example-continuous-wide.csv)

## Excel 整理與另存 CSV 的技巧

MetaInsight v7.1.1 已經可以直接上傳 `.xlsx`。不過在台灣中文版 Excel 裡，還是建議整理好後**另存為「CSV UTF-8（逗號分隔）（*.csv）」**，比較不會遇到隱藏格式或讀錯工作表的問題。

1. **一次清理所有治療名稱**：用 Excel 的「尋找與取代」，把空白、連字號（`-`）、斜線（`/`）、括號換成底線 `_` 或直接刪掉。例如 `Oral-NSAID` 改成 `Oral_NSAID`。治療名稱不要用中文。
2. **同一篇研究不能有兩臂同名**：MetaInsight **不接受同一篇研究裡有兩臂是相同治療**。如果某試驗比較同一藥物的低劑量和高劑量，命名時就要分開，例如 `Drug_10mg` 和 `Drug_20mg`。不然就要先依研究計畫把這兩臂合併。
3. **寬格式裡兩臂試驗的填法**：兩臂研究的 `T.3`、`R.3`、`N.3` 完全留白，不要填 `NA` 或 `-`。存檔前確認每一列的欄數都對齊。
4. **0 事件（zero events）怎麼處理**：官網在 Binary Long 的說明裡提醒：`N.B. Continuity corrections will need to be applied to cells containing 0 values`，也就是含 0 的格子要先做連續性校正（continuity correction）。
   - 如果只有某一臂事件數是 `0`：上傳前在 Excel 手動做標準的 `0.5` 校正，該研究**每一臂的 `R` 加 `0.5`、`N` 加 `1`**。
   - 如果兩臂事件數都是 `0`：依一般統合分析的原則，這篇通常不納入相對效應的估計。
   - 註：MetaInsight 內建的二元範例檔 `MetaInsight_binary_long.csv` 仍有一筆 `R=0`。上傳後請務必到分析結果和 Log window 再確認一次。
5. **想對照官方模板？** 到 `Setup` → `Load data`，選好結果類型和格式後，點左下角 `Download example data`，就能下載對應的官方範例 CSV。共四種：continuous long/wide、binary long/wide。

## 逐步上傳與設定

### 步驟 1：打開首頁，切到 Setup

1. 用瀏覽器打開 `https://crsu-metainsight.le.ac.uk/MetaInsight/`（確認網址最後有 `/`）。
2. 第一次開啟如果跳出 GDPR 隱私權視窗，點 `Accept`。
3. 點頂部導覽列的 `Setup`。

![MetaInsight v7.1.1 首頁畫面，紅框標示版本編號與頂部 Setup 分頁](/images/blog/metainsight-upload-tutorial/01-home.png)
*左側 WORKFLOW 顯示目前版本是 v7.1.1。點上方 Setup 開始匯入資料。*

### 步驟 2：在 Load data 選結果類型與格式

進入 `Setup` 後，左側預設停在 `Load data`。

1. `Select outcome type`：選 `Binary (e.g. Odds Ratio)`。如果是平均值／標準差資料，選 `Continuous`。
2. `Select data format`：選 `Long` 或 `Wide`。
3. 看右側 `Guidance` 分頁：它會依你的選項顯示要填哪些欄位。上傳前先掃一眼，確認表頭沒錯。

![Setup 下 Load data 頁面，紅框標示結果類型、格式選項、檔案選取按鈕與 Guidance 說明分頁](/images/blog/metainsight-upload-tutorial/02-load-data-options.png)
*選好 Binary 和 Long 後，右側 Guidance 會列出必填的欄位名稱。*

### 步驟 3：選檔，再按 Load data

1. 點左側 `Select`，選剛存好的 CSV（或 `.xlsx`）。
2. 等進度條變成紅色的 `Upload complete`。
3. **再按一次下方藍色的 `Load data` 按鈕。** 很多人選完檔案就切走，其實資料還沒載入。

![上傳 Long 格式 CSV 後點擊 Load data，右上角 Log window 顯示上傳成功，中央 Results 呈現 11 列長格式資料](/images/blog/metainsight-upload-tutorial/03-upload-long-table.png)
*右上角 Log window 要出現綠勾「Data has been uploaded successfully」，中央表格要完整列出 5 篇研究、11 個治療臂和 `covar.age`。*

如果你用的是寬格式（例如上面的 `metainsight-example-wide.csv`）：

1. 左側格式先改選 `Wide`。
2. 重新選檔，再按 `Load data`。
3. 中央 `Results` 會顯示 5 列資料。`Chen_2021` 的 `T.3`、`R.3`、`N.3` 應該都有讀到，其他 4 篇兩臂研究則是空白。

![改選 Wide 並上傳寬格式 CSV 後，Results 表格顯示 5 篇研究與三臂試驗的 .3 欄位](/images/blog/metainsight-upload-tutorial/04-upload-wide-table.png)
*寬格式一列代表一篇研究。確認三臂試驗 `Chen_2021` 的第三臂沒有跑到別的欄位。*

### 步驟 4：在 Configure analysis 設定對照組與效應方向

確認資料沒問題後，點左側導覽區的 `Configure analysis`：

1. `Select reference treatment`：從下拉選單選對照組。系統通常會自動選常見的對照名稱，例如 `Placebo`。
2. `Outcome for binary data`：選 `Odds Ratio (OR)`、`Risk Ratio (RR)` 或 `Risk Difference (RD)`。連續結果則選 `MD` 或 `SMD`。
3. `For treatment rankings, ORs less than 1 are:`：**這一步最容易選反。**
   - 預設是 `Desirable`，適合不良事件、死亡率這類「越少越好」的結果。
   - 本範例的結果是「止痛有效人數」，OR > 1 代表療效較好，所以要改選 `Undesirable`，排序才不會顛倒。
4. 確認後，點最下方的 `Configure analysis` 按鈕。

![Configure analysis 設定面板，紅框標示對照組選擇、排序好壞方向設定與 Configure analysis 按鈕](/images/blog/metainsight-upload-tutorial/05-configure-analysis.png)
*依臨床意義確認 OR < 1 是 Desirable 還是 Undesirable，再點下方按鈕。*

## 上傳後怎麼確認資料讀對了？

完成 `Configure analysis` 後，正式分析前先檢查兩個地方：

1. **核對資料表和筆數**：在 `Load data` 的 `Results` 分頁，把顯示筆數調成 `25`（或翻頁）。確認：
   - 研究數、治療臂總數都對。
   - 三臂試驗沒有少列，也沒有多出空白列。
   - `covar.` 開頭的共變數，在同一篇研究的每一臂數值都一樣。
2. **看 Summary 摘要與網絡圖**：
   - 點頂部 `Summary` → `Characterise the data` → `Generate tables`，核對研究數和治療數。
   - 再到 `Summary` → `Network plots` → `Generate plots`，確認所有治療節點連成一個完整的網絡（connected network）。如果大小寫打錯（例如 `Placebo` 和 `placebo`），同一個治療會被拆成兩個互不相連的節點。

<!-- 截圖待補：Summary -> Characterise the data 資料摘要表與 Summary -> Network plots 網絡圖（實測期間 v7.1.1 線上伺服器於點擊 Configure analysis 後持續停留在「Configuring analysis...」並回傳 configured_data 錯誤） -->

資料都確認無誤後，就可以依需求點頂部的分頁開始分析：

- `Frequentist`：森林圖、League table、不一致性檢定。
- `Bayesian`：MCMC 模擬、SUCRA 排序、節點分裂法（node-splitting）。
- `Covariate`：如果有上傳 `covar.<名稱>` 欄，可以在這裡做統合迴歸。

## 常見錯誤排除

| 遇到的狀況 | 常見原因 | 解決方式 |
| --- | --- | --- |
| 打開官網顯示 `404 Page not found` | 網址最後少了斜線 `/` | 改用完整網址 `https://crsu-metainsight.le.ac.uk/MetaInsight/` |
| 上傳後 Log window 顯示治療名稱錯誤 | 治療名稱有空白、中文、連字號 `-` 或特殊符號 | 在 Excel 把 `T` 欄全部改成只有英數和底線 `_`（如 `Oral_NSAID`） |
| 錯誤訊息說有重複的治療臂 | 同一篇研究有兩列的 `T` 名稱相同 | 用劑量區分命名（如 `Drug_Low`、`Drug_High`），或先合併這兩臂的數據 |
| 找不到欄位或讀不到共變數 | 欄位名稱大小寫錯（如 `study`、`mean`），或少了 `covar.` 前綴 | 照定義表改表頭：`Study`、`T`、`R`、`N`、`Mean`、`SD`、`covar.age` |
| 載入後無法分析，或只看到預設資料 | 選完檔案忘了按藍色 `Load data` 按鈕 | 等紅色進度條顯示 `Upload complete` 後，再按 `Load data` |
| 超過 6 臂的試驗報錯 | MetaInsight 目前一篇試驗最多 6 臂 | 確認臂數不超過 6，或依臨床定義合併相近的劑量組 |
| 按 `Configure analysis` 後一直轉圈 | v7.1.1 線上伺服器偶爾 SockJS 連線中斷，或後端太忙 | 重新整理頁面再試，或暫時改用官網公告的舊版 `https://crsu.shinyapps.io/MetaInsight_V6/` |

## 延伸閱讀與工具選擇

如果你想用同一份資料**同時比較兩個結果（例如療效和副作用），並直接套用 CINeMA 證據等級上色**，可以接著看下一篇：[NMAstudio 資料上傳教學：從 Excel 到互動式網路統合分析](/blog/nmastudio-upload-tutorial/)。

簡單說：**MetaInsight 的強項是內建貝氏 MCMC 模型和共變數統合迴歸；NMAstudio 2.0 則擅長同時呈現多個結果，並整合 CINeMA。**

## 參考資料

1. Owen RK, Bradbury N, Xin Y, Cooper N, Sutton A. MetaInsight: An interactive web-based tool for analyzing, interrogating, and visualizing network meta-analyses using R-shiny and netmeta. *Research Synthesis Methods*. 2019;10(4):569–581. DOI: [10.1002/jrsm.1373](https://doi.org/10.1002/jrsm.1373)（[PMC6973101](https://pmc.ncbi.nlm.nih.gov/articles/PMC6973101/)）
2. MetaInsight 官方網頁應用程式（v7.1.1）：[https://crsu-metainsight.le.ac.uk/MetaInsight/](https://crsu-metainsight.le.ac.uk/MetaInsight/)（官方範例檔可在 `Setup` → `Load data` 點 `Download example data` 下載）
3. MetaInsight v6 暫時備援站（官方公告的過渡期連結）：[https://crsu.shinyapps.io/MetaInsight_V6/](https://crsu.shinyapps.io/MetaInsight_V6/)
