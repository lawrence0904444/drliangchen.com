---
title: CINeMA 上傳教學：一步一步評估網路統合分析的證據可信度
description: 從整理 rob 與 indirectness 欄位、上傳 CSV，到逐一完成六個面向的評估並匯出報告。附範例資料與截圖。
pubDate: 2026-11-25
category: notes
tags: [實證醫學, 網路統合分析, GRADE, 研究方法]
draft: false
---

這是「網路統合分析（network meta-analysis，簡稱 NMA）免費線上工具」系列教學的第三篇。第一篇用 [MetaInsight](/blog/metainsight-upload-tutorial/) 跑統計模型，第二篇用 [NMAstudio](/blog/nmastudio-upload-tutorial/) 畫互動圖表。這一篇要完成投稿前的最後一步：用 **CINeMA（Confidence in Network Meta-Analysis）** 評估每一組治療比較的證據可信度（confidence in evidence）。

CINeMA 由伯恩大學 ISPM 開發，是 Cochrane 推薦用來評估 NMA 證據等級的官方工具。要注意的是，**原網址 `https://cinema.ispm.unibe.ch/` 現在已轉址到 [https://cinema.med.auth.gr/](https://cinema.med.auth.gr/)**。本文的畫面與實測都以目前的 CINeMA 3.0.1 為準。

三套工具可以串在一起用：

- CINeMA 最後匯出的 `.csv` 報告可以上傳回 NMAstudio，讓 league table 依可信度自動上色。
- 新版 CINeMA 也能匯入 MetaInsight 匯出的 `.json`，做法是先用官方 `cinemar` R 套件轉成 `.cnm` 檔。

## CINeMA 是什麼？跟 GRADE 的關係與六個面向

做兩兩比較的統合分析時，我們用 GRADE 的五個面向決定要不要降級。CINeMA 把同樣的概念延伸到 NMA。

不同的地方在於，NMA 的每一個估計值都混合了直接證據與間接證據。所以 CINeMA 會先算出**貢獻矩陣**（contribution matrix），也就是每一組比較的結果中，各篇研究（各條直接比較）分別貢獻了多少百分比的權重。接著再依這些權重，評估以下六個面向：

| 評估面向（中／英文） | 要問的問題 | 系統使用的標籤 |
| --- | --- | --- |
| 1. 研究內偏誤（within-study bias） | 納入研究本身的偏誤風險，會不會影響結果？ | Low risk／Some concerns／High risk |
| 2. 報告偏誤（reporting bias） | 有沒有發表偏誤（publication bias）或選擇性報告？ | Low risk／Some concerns／High risk |
| 3. 間接性（indirectness） | 研究的 PICO 是否偏離你要回答的臨床問題？ | No concerns／Some concerns／Major concerns |
| 4. 不精確性（imprecision） | 95% 信賴區間（CI）有沒有跨過臨床重要門檻？ | No concerns／Some concerns／Major concerns |
| 5. 異質性（heterogeneity） | 把研究間的差異考慮進去後（看 95% 預測區間），結論會不會改變？ | No concerns／Some concerns／Major concerns |
| 6. 不一致性（incoherence） | 直接證據和間接證據得出的結論是否互相矛盾？ | No concerns／Some concerns／Major concerns |

## 開始前準備：需要哪些資料

CINeMA 免費，而且**不需要登入**。資料只暫存在你的瀏覽器（`localStorage`），不會永久存在遠端伺服器，所以做完後一定要匯出 `.cdb` 或 `.cnm` 備份。

上傳前要先準備好兩樣東西：

1. **試驗數據**：目前只支援**二分類結果（binary）**和**連續型結果（continuous）**。存活時間（time-to-event）或發生率（rate）的原始資料不能直接上傳。這類資料要先自己算好效應值（例如 log HR）和標準誤（SE），再用反變異數（inverse variance）格式上傳。
2. **每篇研究的偏誤風險（`rob`）與間接性（`indirectness`）評分**：每篇研究各給一個低、中或高的分數。

## 選擇資料格式：Long、Wide 還是反變異數

CINeMA 只接受 `.csv` 檔，支援 long、wide 與反變異數（inverse variance）三種排列方式，預設欄位如下表。如果你的欄位名稱不一樣，上傳後系統會請你手動對應。

| 資料格式 | 預設欄位名稱 | 備註 |
| --- | --- | --- |
| Binary, long（每列一組治療臂） | `id, t, r, n, rob, indirectness` | 多臂試驗最不容易填錯，最推薦 |
| Binary, wide（每列一組比較） | `id, t1, r1, n1, t2, r2, n2, rob, indirectness` | 三臂以上的試驗要拆成多列 |
| Continuous, long | `id, t, y, sd, n, rob, indirectness` | 連續變項首選 |
| Continuous, wide | `id, t1, y1, sd1, n1, t2, y2, sd2, n2, rob, indirectness` | 連續變項的兩兩比較格式 |
| Inverse variance（任何結果） | `id, t1, t2, effect, se, rob, indirectness` | 適用 log OR／log RR／log HR／MD／SMD |

## 欄位定義與 `rob`／`indirectness` 填寫方式

| 欄位名稱 | 意義 | 型別／數值 | 必填／選填 |
| --- | --- | --- | --- |
| `id` | 研究代碼（同一篇研究的每一列都要一樣） | 建議用純數字 | 必填 |
| `t`（`t1`, `t2`） | 治療名稱（用簡短英數，避免空白與特殊字元） | 文字或數字 | 必填 |
| `r`（`r1`, `r2`） | 發生事件的人數（0 ≤ r ≤ n） | 整數 | Binary 必填 |
| `n`（`n1`, `n2`） | 該治療臂的總人數（n > 0） | 整數 | 必填（IV 除外） |
| `y`（`y1`, `y2`） | 平均值（mean） | 數值 | Continuous 必填 |
| `sd`（`sd1`, `sd2`） | 標準差（SD） | 正數 | Continuous 必填 |
| `effect` | 相對效應值（`t1` vs `t2`） | 數值 | IV 格式必填 |
| `se` | `effect` 的標準誤 | 正數 | IV 格式必填 |
| `rob` | 研究層級的偏誤風險 | `1/2/3` 或 `L/M/U/H` | 實測必填（見下文） |
| `indirectness` | 研究層級的間接性 | `1/2/3` 或 `L/M/U/H` | 實測可不填（但建議填） |

**實測時發現的驗證規則（CINeMA 3.0.1）：**

- **不能有空白格，但可以有 0 事件**：任何欄位只要有一格空白（empty cell），系統就會拒絕上傳。`r = 0` 則沒問題，後端的 `netmeta::pairwise` 會自動處理。
- **字母碼會自動轉成數字**：系統讀檔時會把 `L/l` 轉成 `1`，`M/m/U/u` 轉成 `2`，`H/h` 轉成 `3`。只要同一個 `id` 的各列一致就能通過，但還是建議統一用 `1/2/3`。
- **`rob` 其實還是必填**：3.0.0 的更新說明雖然把 `rob` 改成選填，但目前 3.0.1 的前端驗證仍會檢查 `rob`。少了這一欄就無法上傳。

### RoB 2 對照與 `indirectness` 判斷原則

`rob` 和 `indirectness` 都是**以研究（`id`）為單位**，同一篇研究的多列必須填同一個數字：

| RoB 2 整體評估（Overall） | CINeMA 數字碼 | CINeMA 字母碼 | 顯示顏色 |
| --- | --- | --- | --- |
| Low risk of bias | `1` | `L`（或 `l`） | 綠色 |
| Some concerns | `2` | `M` / `U`（或 `m`/`u`） | 黃色 |
| High risk of bias | `3` | `H`（或 `h`） | 紅色 |

`indirectness` 看的是這篇研究的 **PICO 和你的回顧問題吻不吻合**，跟網絡圖上有沒有直接連線無關：

- 族群、介入劑量、對照組與結果定義都符合：填 `1`
- 有一項要素稍微偏離：填 `2`
- 多項要素明顯偏離，或用的是替代指標：填 `3`

## 範例資料：Binary 與 Continuous（Long／Wide 格式）

以下範例都用同一個網絡：**7 篇研究、4 種治療（`Placebo`、`DrugA`、`DrugB`、`DrugC`）**，其中 **Study 7 是三臂試驗**。這個網絡是連通的，包含兩個封閉迴圈（`Placebo–DrugA–DrugB` 與 `Placebo–DrugB–DrugC`），還有一組完全沒有直接試驗、只能靠間接推估的比較（`DrugA vs DrugC`）。

下面分別示範 Binary 與 Continuous 的 Long 和 Wide 格式。後面的操作截圖都以 Binary 資料為例。

### 二分類結果（Binary）：Long 格式（推薦）

```csv
id,t,r,n,rob,indirectness
1,Placebo,15,60,1,1
1,DrugA,28,60,1,1
2,Placebo,10,50,2,1
2,DrugA,26,50,2,1
3,Placebo,14,65,1,1
3,DrugB,38,65,1,1
4,Placebo,12,55,3,2
4,DrugC,20,55,3,2
5,DrugA,24,55,2,1
5,DrugB,34,55,2,1
6,DrugB,32,50,1,2
6,DrugC,22,50,1,2
7,Placebo,16,70,2,1
7,DrugA,33,70,2,1
7,DrugB,41,70,2,1
```

下載範例：[cinema-example-long.csv](/files/cinema-upload-tutorial/cinema-example-long.csv)

### 二分類結果（Binary）：Wide 格式（三臂試驗拆為 `k(k−1)/2 = 3` 列）

```csv
id,t1,r1,n1,t2,r2,n2,rob,indirectness
1,Placebo,15,60,DrugA,28,60,1,1
2,Placebo,10,50,DrugA,26,50,2,1
3,Placebo,14,65,DrugB,38,65,1,1
4,Placebo,12,55,DrugC,20,55,3,2
5,DrugA,24,55,DrugB,34,55,2,1
6,DrugB,32,50,DrugC,22,50,1,2
7,Placebo,16,70,DrugA,33,70,2,1
7,Placebo,16,70,DrugB,41,70,2,1
7,DrugA,33,70,DrugB,41,70,2,1
```

下載範例：[cinema-example-wide.csv](/files/cinema-upload-tutorial/cinema-example-wide.csv)

### 連續型結果（Continuous）：Long 格式（推薦）

這裡改用 0–10 分疼痛量表（VAS），填入各組的平均值 `y` 與標準差 `sd`。分數越低代表越有效，其他結構完全相同：

```csv
id,t,y,sd,n,rob,indirectness
1,Placebo,6.0,1.5,60,1,1
1,DrugA,4.2,1.4,60,1,1
2,Placebo,5.8,1.6,50,2,1
2,DrugA,4.1,1.5,50,2,1
3,Placebo,6.1,1.5,65,1,1
3,DrugB,3.5,1.4,65,1,1
4,Placebo,5.9,1.6,55,3,2
4,DrugC,4.8,1.5,55,3,2
5,DrugA,4.3,1.4,55,2,1
5,DrugB,3.4,1.3,55,2,1
6,DrugB,3.3,1.4,50,1,2
6,DrugC,4.7,1.5,50,1,2
7,Placebo,6.0,1.5,70,2,1
7,DrugA,4.2,1.4,70,2,1
7,DrugB,3.4,1.3,70,2,1
```

下載範例：[cinema-example-continuous-long.csv](/files/cinema-upload-tutorial/cinema-example-continuous-long.csv)

### 連續型結果（Continuous）：Wide 格式

```csv
id,t1,y1,sd1,n1,t2,y2,sd2,n2,rob,indirectness
1,Placebo,6.0,1.5,60,DrugA,4.2,1.4,60,1,1
2,Placebo,5.8,1.6,50,DrugA,4.1,1.5,50,2,1
3,Placebo,6.1,1.5,65,DrugB,3.5,1.4,65,1,1
4,Placebo,5.9,1.6,55,DrugC,4.8,1.5,55,3,2
5,DrugA,4.3,1.4,55,DrugB,3.4,1.3,55,2,1
6,DrugB,3.3,1.4,50,DrugC,4.7,1.5,50,1,2
7,Placebo,6.0,1.5,70,DrugA,4.2,1.4,70,2,1
7,Placebo,6.0,1.5,70,DrugB,3.4,1.3,70,2,1
7,DrugA,4.2,1.4,70,DrugB,3.4,1.3,70,2,1
```

下載範例：[cinema-example-continuous-wide.csv](/files/cinema-upload-tutorial/cinema-example-continuous-wide.csv)

## 在 Excel 整理並另存 CSV（UTF-8）

1. 第一列放英文欄位名稱。資料前後不要多打空白，儲存格裡也不要有半形逗號。
2. 治療名稱的大小寫要完全一致。例如 `DrugA` 和 `Druga` 會被當成兩個不同的節點。
3. 在 Excel 依 `id` 排序，讓同一篇研究的各列排在一起，再檢查同一個 `id` 的 `rob` 和 `indirectness` 是否完全相同。如果用 wide 格式，也順便確認三臂以上試驗的兩兩配對沒有漏拆或重複。
4. 確認資料最後一列的下方、最右欄的右側，沒有殘留的空白列或空白欄，以免出現 empty cell 錯誤。
5. 另存新檔時選 **「CSV UTF-8 (逗號分隔) (\*.csv)」**。CINeMA 同時支援 `,` 與 `;` 分隔。

## 上傳與 Configuration 設定

打開 [CINeMA（https://cinema.med.auth.gr/）](https://cinema.med.auth.gr/)，點右上角的 **Projects**。

### 步驟 1：建立專案集並上傳 CSV

- **要點哪裡**：在 `Projects` 點 **New Collection**，替專案集取名（例如 `Pain Relief NMA Tutorial`）。新版用 Collection（`.cdb`）來管理多個 Project（`.cnm`），每個 Project 對應一個 outcome。接著點 **Upload Dataset (.csv)**，上傳 `cinema-example-long.csv`。
- **看到什麼**：系統會先顯示自動偵測的結果：`Format: long`、`Outcome: binary`、`7 Studies`、`4 Interventions`、`5 Comparisons`。回到 `Projects` 後，可以把專案改名為 `Pain_Relief_Long`、編輯 `Outcome` 標籤，再點右側的 **Open**。
- **常見錯誤**：出現 `At least one cell is empty...`，表示 Excel 裡有空值或空白列。如果你用了自訂的欄位名稱，上傳後會進入欄位對應頁，手動指定後儲存即可。

![Projects 頁面顯示上傳後的資料摘要、Outcome 欄位與 Open 按鈕](/images/blog/cinema-upload-tutorial/01-projects-upload.png)

*紅框標示上傳用的 `Upload Dataset (.csv)` 按鈕，以及進入分析的 `Open` 按鈕。同一個專案集裡可以管理多個結果指標。*

### 步驟 2：調整網絡圖與設定統計模型（Configuration）

- **要點哪裡**：在 `Configuration` 上方的 **Network Plot**，把 `Edge color by:` 改成 **`Majority RoB`**，再點右側的 **`Redraw`**。這裡也可以設定 `Node size by`、`Edge width by`、`Node color by`，或點 `Save Plot` 存圖。接著往下捲到 **Define your analysis**，依研究計畫書選 **`Random effects`** 與 **`Odds Ratio`**，確認下方已勾選全部 6 組比較，再點 **`Set up your evaluation`**。
- **看到什麼**：網絡圖的連線會依偏誤風險顯示成綠、黃、紅三色，例如 `Placebo–DrugC` 是紅色（高風險）。右側預覽表會展開成 9 列比較，因為三臂的 Study 7 佔了 3 列。
- **常見錯誤**：如果網絡斷開、沒有全部連在一起，`Set up your evaluation` 會無法計算。

![Configuration 網絡圖將連線依 Majority RoB 上色與資料預覽](/images/blog/cinema-upload-tutorial/02-configuration-network-analysis.png)

*在紅框選好 `Edge color by: Majority RoB` 後，一定要點 `Redraw` 才會更新連線顏色。右側可以同時核對 9 列配對資料。*

![在 Define your analysis 設定 Random effects 與 Odds Ratio 後開始運算](/images/blog/cinema-upload-tutorial/02b-configuration-analysis.png)

*確認上方紅框的模型與效應指標，以及勾選的 6 組比較後，點左下紅框的 `Set up your evaluation`。*

### 步驟 3：下載貢獻矩陣與 League Table

- **要點哪裡**：運算完成、出現 `Ready to proceed!` 後，下方會有 **5 個 CSV 下載按鈕**。點 **`Download per comparison contribution matrix`** 與 **`Download league table`**，再按 **`Proceed`**。新版另外提供一份敏感度分析用的 league table，會排除高偏誤及中高偏誤的研究。
- **看到什麼**：CINeMA 3.0.1 不會在網頁上直接展開整張大表格，而是改成讓你下載 CSV。

![運算完成後顯示五個貢獻矩陣與 League Table 匯出鈕及 Proceed 按鈕](/images/blog/cinema-upload-tutorial/03-contribution-matrix.png)

*新版改成從紅框處下載貢獻矩陣 CSV。下載完成後，點右下紅框的 `Proceed` 進入六個面向的評估。*

**怎麼看懂貢獻矩陣？** 打開 `perComparisonContribution.csv` 時先別嚇到。CINeMA 3.0.1 的匯出格式有個小瑕疵：原本應該分欄的數字，**全部被包成一串大括號文字，塞在第二欄**，有時還會出現像 `13.780000000000001` 這種很長的小數。

數值旁邊沒有 `%` 符號，但**每個數字本身就是百分比**，整列加起來約等於 100。以本範例純間接比較 `DrugA:DrugC` 實際匯出的那一格為例：

```text
{"DrugA:DrugB":23.74,"DrugA:Placebo":25.6,"DrugB:DrugC":25.05,"DrugB:Placebo":1.31,"DrugC:Placebo":24.29}
```

拆開整理成表格後，就能看出這組比較背後的證據從哪裡來：

| 直接比較路徑（CSV 原始數值） | 對 `DrugA:DrugC` 的貢獻占比 |
| --- | --- |
| `DrugA:Placebo`（`25.6`） | 25.6% |
| `DrugB:DrugC`（`25.05`） | 25.1% |
| `DrugC:Placebo`（`24.29`） | 24.3% |
| `DrugA:DrugB`（`23.74`） | 23.7% |
| `DrugB:Placebo`（`1.31`） | 1.3% |

簡單說，`DrugA vs DrugC` 沒有 head-to-head 試驗。它的 NMA 估計值大約一半來自 `DrugA–Placebo–DrugC` 這條路徑（25.6% + 24.3%），另一半來自 `DrugA–DrugB–DrugC` 這條路徑（23.7% + 25.1%）。如果這些路徑裡有高偏誤的研究，就會按照這個比例影響這組比較的偏誤評等。

*實用提示：平常判讀不需要自己拆這串文字。下一步 `Within-study bias` 和 `Indirectness` 頁面的堆疊長條圖，就是把這份矩陣畫出來的結果。只有當期刊審稿人要求附上貢獻矩陣的補充表格時，再用 Excel 把這份 CSV 分欄（或貼給 AI 轉成表格）即可。*

## 六個評估面向逐步操作

### 1. Within-study bias（研究內偏誤）

- **做什麼／怎麼選**：畫面會顯示整體的偏誤風險分布（本範例 7 篇：`3 Low`、`3 Moderate`、`1 High`），以及按貢獻百分比畫成的堆疊長條圖。在規則選單選 **`Majority RoB`**（另有 `Average RoB`、`Highest RoB`），再點 **`Proceed`**。
- **看到什麼**：`DrugC:Placebo` 的紅色占比過半，判為 `High risk`；`DrugB:DrugC` 的綠色過半，判為 `Low risk`；其餘 4 組為 `Some concerns`。
- **常見錯誤**：選 `Highest RoB` 時，只要某條路徑用到 1 篇高風險研究，整組比較就會被判紅，容易過度降級。

![Within-study bias 頁面顯示偏誤貢獻長條圖與 Majority RoB 規則](/images/blog/cinema-upload-tutorial/04-within-study-bias.png)

*長條圖中每種顏色的寬度，對應貢獻矩陣的權重。在紅框選好 `Majority RoB` 後，就能核對下方每組比較卡片的判定。*

> **一句話判讀原則**：依貢獻權重，看每組比較主要是被低、中還是高偏誤的研究主導。

### 2. Reporting bias（報告偏誤）

- **做什麼／怎麼選**：先點 **`Set all Low risk`**，再針對有發表偏誤疑慮的比較，在該卡片的下拉選單手動修改。（CINeMA 3.0.1 已把舊版的 `undetected / suspected` 標籤改成 `Low risk / Some concerns / High risk`。）如果你有用 ROB-MEN 評估過報告偏誤，也可以點 **`Upload table ROB-MEN`**，直接匯入它的 Table 2 CSV（須包含 `comparison`、`treat1`、`treat2`、`final` 欄）。設定完點 **`Proceed`**。
- **看到什麼**：批次設定後，會展開 6 張比較卡片，可以逐一微調。
- **常見錯誤**：沒按任何設定鈕就直接跳過，最後會無法完成報告。

![Reporting bias 頁面提供一鍵設定按鈕與 ROB-MEN 表格匯入區](/images/blog/cinema-upload-tutorial/05a-reporting-bias-options.png)

*左邊紅框可以一鍵全部設為 `Low risk`；右邊紅框是新版的 `Upload table ROB-MEN` CSV 上傳區。*

![全部比較設為 Low risk 後展開的 Reporting bias 卡片](/images/blog/cinema-upload-tutorial/05-reporting-bias.png)

*如果某組比較的比較調整漏斗圖（comparison-adjusted funnel plot）不對稱，或你懷疑有未發表的研究，可以直接在該卡片的下拉選單改成 `Some concerns` 或 `High risk`。*

> **一句話判讀原則**：綜合漏斗圖是否對稱、灰色文獻與試驗註冊紀錄，判斷結果是否受到發表偏誤或選擇性報告影響。

### 3. Indirectness（間接性）

- **做什麼／怎麼選**：檢視間接性的分布（`5 low`、`2 moderate`）與長條圖，規則選 **`Majority`**（另有 `Average`、`Highest`），再點 **`Proceed`**。
- **看到什麼**：`DrugB:DrugC` 與 `DrugC:Placebo` 為 `Some concerns`，其餘 4 組為 `No concerns`。
- **常見錯誤**：把「沒有直接比較」（例如 `DrugA:DrugC`）誤當成 indirectness。只能靠間接推估所帶來的不確定性，會反映在 Imprecision，而不是這裡。

![Indirectness 頁面顯示間接性貢獻長條圖與 Majority 規則](/images/blog/cinema-upload-tutorial/06-indirectness.png)

*注意紅框處的 `Selected rule: Majority`，以及長條圖中黃色（中度間接性）占比較高的比較。*

> **一句話判讀原則**：依貢獻權重，加總各研究與你的 PICO 的偏離程度，確認證據是否足以回答你的臨床問題。

### 4. Imprecision（不精確性）

- **做什麼／怎麼選**：在 **`Define clinically important size of effect: Odds ratio`** 輸入臨床上有意義的最小效果門檻，點 **`Set`**，再按 **`Proceed`**。這個門檻沒有公定值，要依臨床專業事先決定；本範例設為 **`1.25`**。
- **看到什麼**：系統會自動算出倒數 **`0.800`**，所以「臨床上沒有差別」的區間是 `0.800–1.250`。前 5 組比較的 95% CI 都只在門檻的同一側（畫面顯示 `does not cross clinically important effect`），判為 `No concerns`。只有純間接比較 **`DrugA:DrugC`**（OR 1.392，95% CI 0.700–2.768）同時跨過 `0.800` 和 `1.250` 兩條線，亮紅燈判為 **`Major concerns`**。
- **常見錯誤**：沿用預設值 `1` 直接按 Set，等於沒有設定「沒有差別」的區間。另一個錯誤是連續型結果（MD）也直接填 1.25，而沒有換成該量表的最小臨床重要差異（MCID）。

![Imprecision 頁面設定臨床重要門檻 1.25 並自動判斷各比較信賴區間](/images/blog/cinema-upload-tutorial/07-imprecision.png)

*在紅框輸入 `1.25` 並點 `Set` 後，可以看到純間接比較 `DrugA:DrugC` 的 95% CI 跨過兩側門檻，被標成紅色 `Major concerns`。*

> **一句話判讀原則**：95% CI 跨過一側的臨床門檻，判 `Some concerns`；同時跨過兩側（同時涵蓋臨床上有意義的好處與壞處），判 `Major concerns`。

### 5. Heterogeneity（異質性）

先釐清兩個名詞：

- **τ²（tau 平方）**：研究間變異（between-study variance）。數值越大，代表各研究的結果彼此差異越大。
- **95% 預測區間（prediction interval，PI）**：預估「下一個新研究」的真實效果可能落在哪個範圍。它把研究間變異也算進去，所以通常比 95% CI 寬。

操作方式：

- **做什麼／怎麼選**：這一頁會自動沿用上一步的 `0.800–1.250`，輸入框會鎖住。下方有一個選填的 **`Select type of intervention and outcome`**，指定治療與結果類型後點 **`View`**，系統會列出過去同類研究常見的 τ² 參考範圍，讓你判斷自己網絡的研究間變異是偏小、正常還是偏大。確認後點 **`Proceed`**。
- **看到什麼**：整個網絡的 τ² = 0.000。部分比較的 I² = 0.0%，但 **`DrugA:DrugB`**（95% CI 0.377–0.900；95% PI 0.329–1.030）和 **`DrugC:Placebo`**（CI 1.166–4.058；PI 0.960–4.928）的預測區間跨進了「臨床上沒有差別」的區間，跟 CI 的結論不同，所以系統自動判為 **`Some concerns`**。
- **重要提醒（Reset 陷阱）**：門檻 `1.25` 旁邊的 **`Reset`**（下圖紅框處）和 Imprecision 頁面共用同一個設定。**按下去並確認後，Imprecision 的門檻也會一起被清掉。**

![Heterogeneity 上方設定區，可點 View 對照同類研究的異質性（τ²）參考範圍並留意 Reset 連動](/images/blog/cinema-upload-tutorial/08-heterogeneity.png)

*千萬不要按到上方紅框的 `Reset`，否則前一步在 `Imprecision` 設好的 `1.25` 會被一起重設回預設值 `1`。*

![Heterogeneity 比較卡片顯示 I²、τ² 參考區間與 95% CI vs 95% PI](/images/blog/cinema-upload-tutorial/08b-heterogeneity-cards.png)

*每張卡片都並列 `Confidence interval` 和 `Prediction interval`。只要兩者跨越門檻的結論不一樣，就會亮黃燈。*

> **一句話判讀原則**：看 95% 預測區間有沒有改變 95% 信賴區間原本對臨床重要性的判讀。

### 6. Incoherence（不一致性）

這一頁檢查的是：直接證據和間接證據給出的答案，有沒有互相矛盾。CINeMA 用兩種檢定：

- **全域檢定（global test）**：設計－治療交互作用檢定（design-by-treatment interaction test），一次檢查整個網絡有沒有不一致。
- **局部檢定（local test）**：SIDE 檢定，也就是節點拆分（node-splitting）。它把某一組比較的直接證據和間接證據拆開，分別估計後再互相比較。兩者的比值稱為 ROR（ratio of odds ratios，直接 OR ÷ 間接 OR），ROR = 1 代表兩者完全一致。

操作方式：

- **做什麼／怎麼選**：不需要另外輸入，直接檢視全域與局部檢定的結果，再點 **`Proceed`**。
- **看到什麼**：全域檢定（隨機效應）χ² = 1.127（df = 5，P = 0.952）。各組比較的 SIDE 檢定 P 值介於 `0.667` 到 `0.835`；純間接比較 `DrugA:DrugC` 顯示 `Not applicable`。全部判為 **`No concerns`**。

**SIDE 的 P 值代表什麼？** 它檢定的虛無假設是「直接證據和間接證據的療效沒有差別」，也就是 ROR = 1。**P 值越小，代表直接與間接證據不一致的統計證據越強。** 這類檢定的統計檢定力（power）偏低，容易漏掉真正的不一致，所以 CINeMA 用比較寬鬆的 `P < 0.10` 當警戒線，而不是 `0.05`。

**判定規則（CINeMA 3.0.1 實測）**

先看這組比較屬於哪一種證據，再查對應的表。

**情況 A：混合證據（同時有直接與間接證據）→ 看該比較的 SIDE P 值**

| SIDE P 值 | 判定 |
| --- | --- |
| `P ≥ 0.10` | **`No concerns`** |
| `P < 0.10` | 進一步比對（見下方說明） |

`P < 0.10` 時，系統會把臨床門檻當成分界線，把數線切成幾個區間，然後看「直接證據的 95% CI」和「間接證據的 95% CI」各自落在哪些區間：

- 兩者落在完全相同的區間：仍為 **`No concerns`**
- 只差 1 個區間：**`Some concerns`**
- 差 2 個以上區間：**`Major concerns`**

**情況 B：只有直接證據或只有間接證據（SIDE 顯示 `Not applicable`）→ 改看全域檢定的 P 值**

| 全域檢定 P 值 | 判定 |
| --- | --- |
| `P > 0.10` | **`No concerns`**（例如本範例 `DrugA:DrugC`，因全域 P = 0.952 判綠燈） |
| `0.05 < P ≤ 0.10` | **`Some concerns`** |
| `P ≤ 0.05`，或網絡中沒有封閉迴圈 | **`Major concerns`** |

- **常見錯誤**：看到純間接比較的卡片顯示 `Not applicable`，就以為系統漏算了。其實這時系統已經自動改用全域檢定的 P 值來評等（情況 B）。不過要注意，如果整個網絡是沒有任何封閉迴圈的星狀網絡（star network），所有比較都會直接被判為 `Major concerns`。若你在臨床上和邏輯上都沒有不一致的疑慮，可以在卡片的下拉選單手動調整。

![Incoherence 頁面顯示全域設計－治療交互作用檢定與局部 SIDE 結果](/images/blog/cinema-upload-tutorial/09-incoherence.png)

*先看上方 Global test 的 P 值（0.952），再核對下方每組比較的直接與間接 OR 比值（ROR）及 P 值。*

> **一句話判讀原則**：先看 SIDE（或全域檢定）的 P 值是否小於 0.10；如果小於 0.10，再看直接和間接的 95% CI 是否導向互相矛盾的臨床結論。

## Report 頁面、匯出報告與上傳到 NMAstudio

進入 **Report** 後，系統會把 6 組比較分成 `Mixed evidence`（混合證據）和 `Indirect evidence`（間接證據）兩類彙整。**新手一定要做這兩件事：**

1. **手動勾選降級理由，並改寫最終評級**：系統預設每一列都是 `High`，降級理由也是空白的。你要點黃色或紅色格子裡的小核取方塊，填入 `Reason(s) for downgrading`，再從 **`Confidence rating`** 下拉選單選 `High`、`Moderate`、`Low` 或 `Very low`。降級時要考慮各面向之間的關聯，不要機械式地一個黃燈降一級。本範例的做法是：
   - `DrugA vs DrugB`：綜合考量後降為 `Low`
   - 只有單一面向黃燈的三組比較：降為 `Moderate`
   - `DrugC vs Placebo`（研究內偏誤高風險，加上多個黃燈）與 `DrugA vs DrugC`（嚴重不精確）：降為 `Very low`
2. **下載報告並備份**：點右上角的 **`Download Report`** 匯出 `.csv`（也可以點 `Export PDF`）。最後記得回到 `Projects` 匯出 `.cdb` 或 `.cnm` 存檔。

![Report 頁面勾選降級理由、選擇最終可信度評級並點擊 Download Report 匯出](/images/blog/cinema-upload-tutorial/10-report-export.png)

*一定要勾選黃、紅格裡的核取方塊，並調整紅框處的 `Confidence rating` 下拉選單。確認右側已列出降級理由後，再按上方紅框的 `Download Report`。*

下載本範例實測匯出的報告：[cinema-example-report.csv](/files/cinema-upload-tutorial/cinema-example-report.csv)

**上傳回 NMAstudio，替 league table 上色：** 回到 [NMAstudio](/blog/nmastudio-upload-tutorial/)，用同一份資料跑完 NMA 模型後，切到頂部的 **CINeMA** 分頁，在對應的結果名稱下上傳這份 `.csv`。NMAstudio 會讀取其中的 `Comparison` 與 `Confidence rating`，自動把 league table 的格子依 `High`、`Moderate`、`Low`、`Very low` 上色。注意兩邊的治療名稱拼字必須完全一致。

## 常見錯誤排除（Troubleshooting）

| 錯誤或異常現象 | 常見原因 | 排除方法 |
| --- | --- | --- |
| 出現 `At least one cell is empty in column ...` | Excel 表格有缺值，或在資料下方、右側誤按空白鍵，留下空白列 | 只複製實際資料區，貼到全新工作表，再另存 CSV UTF-8 |
| 缺少 `rob` 欄而無法上傳 | CINeMA 3.0.1 的驗證程式一定會檢查 `rob` 欄 | 即使只是測試，也請保留 `rob` 欄並填入 `1`/`2`/`3` |
| 提示同一研究的 `rob` 或 `indirectness` 不一致 | 多臂試驗或 wide 格式中，同一 `id` 的多列填了不同數字 | 在 Excel 依 `id` 排序檢查，確保同一 `id` 的每一列都相同 |
| 按 `Set up your evaluation` 後運算失敗 | 網絡沒有完全連通（有斷開），或出現 `n = 0`、`r > n` | 回 `Configuration` 檢查網絡圖是否連成一體，以及數值範圍是否合理 |
| 跳出 `sensitivity analysis not possible ... server_busy` | 主分析與敏感度分析同時送出，伺服器忙碌；或排除中高偏誤研究後，剩下的 Low risk 研究無法連成網絡 | 按 `OK`，只要 `Proceed` 有正常出現，就能繼續主分析。如果需要敏感度分析的表格，等 5–10 秒後點 `Reset your evaluation` 重跑即可 |
| 回到 `Imprecision` 發現門檻歸零 | 在 `Heterogeneity` 或 `Incoherence` 誤按門檻旁的 `Reset` | 這三頁共用同一個門檻，回 `Imprecision` 重新輸入並按 `Set` 即可 |
| 匯出的 `Report.csv` 全部都是 `High` | 忘了在 `Report` 勾選黃、紅格的核取方塊並更改 `Confidence rating` | 回 `Report` 勾選降級理由、修改評級後重新下載 |
| 重開瀏覽器後專案不見了 | 清除了瀏覽器暫存資料，或改用無痕視窗、換了電腦 | CINeMA 只把資料暫存在 `localStorage`，平時一定要匯出 `.cdb` 或 `.cnm` |

## 參考資料

1. Nikolakopoulou A, Higgins JPT, Papakonstantinou T, et al. CINeMA: An approach for assessing confidence in the results of a network meta-analysis. *PLOS Medicine*. 2020;17(4):e1003082. （方法學論文，[PMC7122720](https://pmc.ncbi.nlm.nih.gov/articles/PMC7122720/)）
2. Papakonstantinou T, Nikolakopoulou A, Higgins JPT, Egger M, Salanti G. CINeMA: Software for semiautomated assessment of the confidence in the results of network meta-analysis. *Campbell Systematic Reviews*. 2020;16(1):e1080. （軟體論文，[PMC8356302](https://pmc.ncbi.nlm.nih.gov/articles/PMC8356302/)）
3. CINeMA Web Application（Version 3.0.1）：[https://cinema.med.auth.gr/](https://cinema.med.auth.gr/)（由原網址 `https://cinema.ispm.unibe.ch/` 轉址後的現行網站；原始碼與文件見 [tpapak/cinema](https://github.com/tpapak/cinema)）
