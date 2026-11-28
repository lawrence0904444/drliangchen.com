---
title: 'CINeMA 3.0.1 Upload Tutorial: Rating NMA Evidence Confidence (GRADE)'
description: 'Step-by-step CINeMA 3.0.1 (cinema.med.auth.gr) guide: prepare rob and indirectness CSVs, interpret the contribution matrix and all six GRADE-based domains, and export reports to NMAstudio.'
pubDate: 2026-11-25
updatedDate: 2026-11-28
category: notes
tags: [CINeMA, Network meta-analysis, GRADE, Evidence-based medicine, Research methods]
draft: false
faq:
  - q: 'What is the current CINeMA URL, do I need an account, and are my data saved?'
    a: 'The old URL cinema.ispm.unibe.ch now redirects to https://cinema.med.auth.gr/. CINeMA is free and requires no login, but projects are stored only in your browser localStorage. Always export a .cdb or .cnm backup from Projects when you finish.'
  - q: 'Are rob and indirectness required when uploading a CSV to CINeMA 3.0.1, and how are they coded?'
    a: 'Although the 3.0.0 release notes list rob as optional, the front-end validator in CINeMA 3.0.1 still requires the rob column before an upload succeeds, and including indirectness is recommended. Both are coded per study id using 1/2/3 or L/M/H (low, moderate/some concerns, high), and no cell in the CSV may be left empty.'
  - q: 'Does having no direct head-to-head trial (indirect-only evidence) count as Indirectness?'
    a: 'No. Indirectness assesses whether the included studies PICO elements depart from your review question, regardless of whether two treatments are directly connected in the network plot. Uncertainty from relying solely on indirect evidence is reflected in Imprecision and Incoherence instead.'
  - q: 'How does CINeMA judge No concerns, Some concerns and Major concerns for Imprecision?'
    a: 'CINeMA evaluates the 95% confidence interval against both the line of no effect (such as OR = 1) and the range of equivalence (e.g. 0.800 to 1.250): if the 95% CI lies entirely on one side of the line of no effect or falls completely inside the equivalence range, it is rated No concerns; if it crosses the line of no effect and extends into one clinically important threshold, it is rated Some concerns; if it crosses both thresholds (compatible with clinically important benefit and harm), it is rated Major concerns.'
  - q: 'Why can Heterogeneity be rated Some concerns even when the network tau-squared is 0?'
    a: 'Because the 95% prediction interval (PI) uses a t-distribution with fewer degrees of freedom rather than the normal z = 1.96 used for the 95% CI, the PI is wider even when tau-squared = 0.000. Whenever the 95% PI crosses the line of no effect or threshold and alters the clinical conclusion from the 95% CI, CINeMA rates it Some concerns.'
  - q: 'Why is every row in my exported Report.csv rated High, and how do I import it into NMAstudio?'
    a: 'CINeMA sets every Confidence rating to High by default on the Report page. You must tick the checkboxes inside the yellow and red cells to populate Reason(s) for downgrading and manually change the Confidence rating drop-down before clicking Download Report. You can then upload this CSV under the CINeMA tab in NMAstudio 2.0 to colour the league table.'
---

**To use CINeMA 3.0.1 (current URL: [https://cinema.med.auth.gr/](https://cinema.med.auth.gr/)): prepare a CSV with `rob` and `indirectness` and no empty cells, create a Collection and upload the file, set the model under Configuration, work through the six GRADE-based domains using the contribution matrix, then tick reasons for downgrading and set final ratings on the Report page before exporting CSV and `.cdb`/`.cnm` backups.** This is the third post in my series on free online tools for network meta-analysis (NMA). The first post used [MetaInsight v7.1.1](/en/blog/metainsight-upload-tutorial/) to fit the statistical models, and the second used [NMAstudio 2.0](/en/blog/nmastudio-upload-tutorial/) to draw interactive plots. This post covers the last step before submission: using **CINeMA (Confidence in Network Meta-Analysis)** to rate the confidence in the evidence for each treatment comparison.

> **Free Online NMA Tools Trilogy (Part 3):** Part 1 ([MetaInsight v7.1.1](/en/blog/metainsight-upload-tutorial/)) handles statistical modelling and Bayesian analysis; Part 2 ([NMAstudio 2.0](/en/blog/nmastudio-upload-tutorial/)) handles multi-outcome comparisons and visual transitivity checks; Part 3 (this post, **CINeMA 3.0.1**) handles six-domain GRADE confidence ratings that can be imported back into NMAstudio.

CINeMA was developed at ISPM, University of Bern, and is the official tool Cochrane recommends for rating the certainty of NMA evidence. Note that **the old address `https://cinema.ispm.unibe.ch/` now redirects to [https://cinema.med.auth.gr/](https://cinema.med.auth.gr/)**. All screenshots and tests in this post use the current version, CINeMA 3.0.1.

The three tools work together:

- The `.csv` report you export from CINeMA at the end can be uploaded back into NMAstudio, which then colours the league table by confidence rating.
- The new CINeMA can also import the `.json` file exported from MetaInsight. You first convert it to a `.cnm` file with the official `cinemar` R package.

## Key points

- **Updated URL**: the legacy `cinema.ispm.unibe.ch` address redirects to `cinema.med.auth.gr`.
- **Browser-only storage**: no login is needed, but projects live only in `localStorage`—always export a `.cdb` or `.cnm` backup.
- **No empty cells and `rob` required**: any blank cell rejects the upload, and the 3.0.1 front-end validator still checks for `rob` (use `1/2/3`).
- **Avoid `Reset` on Heterogeneity**: `Imprecision`, `Heterogeneity` and `Incoherence` share the same clinical threshold; clicking `Reset` clears it across all three tabs.
- **Downgrade manually on `Report`**: every row defaults to `High`; tick the yellow/red checkboxes and adjust the `Confidence rating` drop-downs before downloading.

## What is CINeMA? How it relates to GRADE, and the six domains

In a pairwise meta-analysis, we use the five GRADE domains to decide whether to rate down. CINeMA extends the same idea to NMA.

The difference is that every NMA estimate mixes direct and indirect evidence. So CINeMA first calculates a **contribution matrix**: for each comparison, it shows what percentage of the result comes from each study (each direct comparison). It then uses these weights to assess six domains:

| Domain | The question to ask | Labels used by the software |
| --- | --- | --- |
| 1. Within-study bias | Could the risk of bias in the included studies affect the result? | Low risk / Some concerns / High risk |
| 2. Reporting bias | Is there publication bias or selective reporting? | Low risk / Some concerns / High risk |
| 3. Indirectness | Do the studies' PICO elements differ from the clinical question your review asks? | No concerns / Some concerns / Major concerns |
| 4. Imprecision | Does the 95% confidence interval (CI) cross a clinically important threshold? | No concerns / Some concerns / Major concerns |
| 5. Heterogeneity | Once between-study differences are taken into account (via the 95% prediction interval), does the conclusion change? | No concerns / Some concerns / Major concerns |
| 6. Incoherence | Do the direct and indirect evidence point to conflicting conclusions? | No concerns / Some concerns / Major concerns |

## Before you start: what data you need

CINeMA is free and **does not require an account**. Your data are only stored temporarily in your browser (`localStorage`), not permanently on a remote server, so always export a `.cdb` or `.cnm` backup when you finish.

Prepare two things before uploading:

1. **Trial data**: CINeMA currently supports only **binary** and **continuous** outcomes. Raw time-to-event or rate data cannot be uploaded directly. For these, calculate the effect size (for example, log HR) and its standard error (SE) yourself, then upload them in inverse variance format.
2. **A risk of bias (`rob`) and indirectness (`indirectness`) score for each study**: give every study one score of low, moderate or high for each.

## Choosing a data format: long, wide or inverse variance

CINeMA accepts only `.csv` files and supports three layouts: long, wide and inverse variance. The default column names are listed below. If your headers are named differently, the software will ask you to map them by hand after upload.

| Data format | Default column names | Notes |
| --- | --- | --- |
| Binary, long (one row per treatment arm) | `id, t, r, n, rob, indirectness` | Hardest to get wrong with multi-arm trials; recommended |
| Binary, wide (one row per comparison) | `id, t1, r1, n1, t2, r2, n2, rob, indirectness` | Trials with three or more arms must be split into several rows |
| Continuous, long | `id, t, y, sd, n, rob, indirectness` | First choice for continuous outcomes |
| Continuous, wide | `id, t1, y1, sd1, n1, t2, y2, sd2, n2, rob, indirectness` | Pairwise layout for continuous outcomes |
| Inverse variance (any outcome) | `id, t1, t2, effect, se, rob, indirectness` | For log OR / log RR / log HR / MD / SMD |

## Column definitions and how to fill in `rob` and `indirectness`

| Column | Meaning | Type / values | Required / optional |
| --- | --- | --- | --- |
| `id` | Study ID (must be the same on every row of a study) | Plain numbers recommended | Required |
| `t` (`t1`, `t2`) | Treatment name (short and alphanumeric; avoid spaces and special characters) | Text or number | Required |
| `r` (`r1`, `r2`) | Number of people with the event (0 ≤ r ≤ n) | Integer | Required for binary |
| `n` (`n1`, `n2`) | Total number of people in the arm (n > 0) | Integer | Required (except IV) |
| `y` (`y1`, `y2`) | Mean | Number | Required for continuous |
| `sd` (`sd1`, `sd2`) | Standard deviation (SD) | Positive number | Required for continuous |
| `effect` | Relative effect (`t1` vs `t2`) | Number | Required for IV format |
| `se` | Standard error of `effect` | Positive number | Required for IV format |
| `rob` | Study-level risk of bias | `1/2/3` or `L/M/U/H` | Required in practice (see below) |
| `indirectness` | Study-level indirectness | `1/2/3` or `L/M/U/H` | Optional in practice (but recommended) |

**Validation rules found in testing (CINeMA 3.0.1):**

- **No empty cells, but zero events are fine**: if any cell in any column is empty, the upload is rejected. `r = 0` is fine; the back end (`netmeta::pairwise`) handles it automatically.
- **Letter codes are converted to numbers**: when reading the file, the software converts `L/l` to `1`, `M/m/U/u` to `2` and `H/h` to `3`. The file passes as long as all rows of the same `id` match, but I still recommend using `1/2/3` throughout.
- **`rob` is still effectively required**: the 3.0.0 release notes made `rob` optional, but the front-end validator in the current 3.0.1 still checks for it. Without this column, the upload fails.

### Mapping RoB 2 and judging `indirectness`

Both `rob` and `indirectness` are set **per study (`id`)**, so every row of the same study must have the same number:

| RoB 2 overall judgement | CINeMA number code | CINeMA letter code | Colour shown |
| --- | --- | --- | --- |
| Low risk of bias | `1` | `L` (or `l`) | Green |
| Some concerns | `2` | `M` / `U` (or `m`/`u`) | Yellow |
| High risk of bias | `3` | `H` (or `h`) | Red |

`indirectness` asks whether **the study's PICO matches your review question**. It has nothing to do with whether two nodes are directly connected in the network plot:

- Population, intervention dose, comparator and outcome definition all match: enter `1`
- One element differs slightly: enter `2`
- Several elements differ clearly, or a surrogate outcome is used: enter `3`

## Example data: binary and continuous (long and wide formats)

All examples use the same network: **7 studies and 4 treatments (`Placebo`, `DrugA`, `DrugB`, `DrugC`)**, where **Study 7 is a three-arm trial**. The network is connected and contains two closed loops (`Placebo–DrugA–DrugB` and `Placebo–DrugB–DrugC`). It also has one comparison with no direct trials at all, which can only be estimated indirectly (`DrugA vs DrugC`).

Below are the long and wide formats for both binary and continuous outcomes. The screenshots later in the post use the binary data.

### Binary outcome: long format (recommended)

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

Download the example: [cinema-example-long.csv](/files/cinema-upload-tutorial/cinema-example-long.csv)

### Binary outcome: wide format (the three-arm trial is split into `k(k−1)/2 = 3` rows)

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

Download the example: [cinema-example-wide.csv](/files/cinema-upload-tutorial/cinema-example-wide.csv)

### Continuous outcome: long format (recommended)

Here the outcome is a 0–10 pain scale (VAS), with each group's mean `y` and standard deviation `sd`. Lower scores mean the treatment works better. Everything else has the same structure:

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

Download the example: [cinema-example-continuous-long.csv](/files/cinema-upload-tutorial/cinema-example-continuous-long.csv)

### Continuous outcome: wide format

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

Download the example: [cinema-example-continuous-wide.csv](/files/cinema-upload-tutorial/cinema-example-continuous-wide.csv)

## Preparing the file in Excel and saving as CSV (UTF-8)

1. Put the English column names in the first row. Don't add extra spaces before or after values, and don't use commas inside cells.
2. Treatment names must match exactly, including capitalisation. For example, `DrugA` and `Druga` become two different nodes.
3. Sort by `id` in Excel so all rows of the same study sit together, then check that `rob` and `indirectness` are identical for each `id`. If you use the wide format, also check that the pairwise rows for trials with three or more arms are complete, with no gaps or duplicates.
4. Make sure there are no leftover blank rows below the last row of data or blank columns to the right of the last column, to avoid the empty cell error.
5. When saving, choose **"CSV UTF-8 (Comma delimited) (\*.csv)"**. CINeMA accepts both `,` and `;` as delimiters.

## Upload and Configuration

Open [CINeMA (https://cinema.med.auth.gr/)](https://cinema.med.auth.gr/) and click **Projects** in the top-right corner.

### Step 1: Create a collection and upload the CSV

- **Where to click**: In `Projects`, click **New Collection** and give it a name (for example, `Pain Relief NMA Tutorial`). The new version uses a Collection (`.cdb`) to hold several Projects (`.cnm`), one per outcome. Then click **Upload Dataset (.csv)** and upload `cinema-example-long.csv`.
- **What you see**: The software first shows what it detected: `Format: long`, `Outcome: binary`, `7 Studies`, `4 Interventions`, `5 Comparisons`. Back in `Projects`, you can rename the project to `Pain_Relief_Long`, edit the `Outcome` label, and then click **Open** on the right.
- **Common mistakes**: `At least one cell is empty...` means your Excel sheet has a missing value or a blank row. If you used your own column names, you will be taken to a column-mapping page after upload; map the columns and save.

![The Projects page showing the uploaded data summary, the Outcome field and the Open button](/images/blog/cinema-upload-tutorial/01-projects-upload.png)

*The red boxes mark the `Upload Dataset (.csv)` button and the `Open` button that starts the analysis. One collection can hold several outcomes.*

### Step 2: Adjust the network plot and set up the model (Configuration)

- **Where to click**: In the **Network Plot** at the top of `Configuration`, set `Edge color by:` to **`Majority RoB`** and click **`Redraw`** on the right. You can also set `Node size by`, `Edge width by` and `Node color by` here, or click `Save Plot` to save the image. Then scroll down to **Define your analysis**, choose **`Random effects`** and **`Odds Ratio`** as planned in your protocol, check that all 6 comparisons are selected below, and click **`Set up your evaluation`**.
- **What you see**: The edges in the network plot are coloured green, yellow or red by risk of bias; for example, `Placebo–DrugC` is red (high risk). The preview table on the right expands to 9 rows of comparisons, because the three-arm Study 7 takes up 3 rows.
- **Common mistakes**: If the network is disconnected, `Set up your evaluation` cannot run the analysis.

![The Configuration network plot with edges coloured by Majority RoB, and the data preview](/images/blog/cinema-upload-tutorial/02-configuration-network-analysis.png)

*After selecting `Edge color by: Majority RoB` in the red box, you must click `Redraw` for the edge colours to update. You can check the 9 pairwise rows on the right at the same time.*

![Setting Random effects and Odds Ratio in Define your analysis before running the analysis](/images/blog/cinema-upload-tutorial/02b-configuration-analysis.png)

*Check the model and effect measure in the top red box and the 6 selected comparisons, then click `Set up your evaluation` in the bottom-left red box.*

### Step 3: Download the contribution matrix and league table

- **Where to click**: When the analysis finishes and `Ready to proceed!` appears, **5 CSV download buttons** show up below. Click **`Download per comparison contribution matrix`** and **`Download league table`**, then click **`Proceed`**. The new version also offers a sensitivity-analysis league table that excludes high and moderate-to-high risk of bias studies.
- **What you see**: CINeMA 3.0.1 does not display the full tables on the web page. Instead, you download them as CSV files.

![After the analysis finishes, five export buttons for the contribution matrix and league table, plus the Proceed button](/images/blog/cinema-upload-tutorial/03-contribution-matrix.png)

*In the new version you download the contribution matrix CSV from the red box. Once downloaded, click `Proceed` in the bottom-right red box to start the six-domain assessment.*

**How to read the contribution matrix.** Don't be alarmed when you open `perComparisonContribution.csv`. CINeMA 3.0.1 has a small export glitch: numbers that should be in separate columns are **all packed into one string of text in curly brackets in the second column**, sometimes with long decimal tails like `13.780000000000001`.

There is no `%` sign, but **each number is a percentage**, and each row adds up to about 100. Here is the actual exported cell for the indirect-only comparison `DrugA:DrugC` in this example:

```text
{"DrugA:DrugB":23.74,"DrugA:Placebo":25.6,"DrugB:DrugC":25.05,"DrugB:Placebo":1.31,"DrugC:Placebo":24.29}
```

Laid out as a table, it shows where the evidence for this comparison comes from:

| Direct comparison (raw CSV value) | Share of contribution to `DrugA:DrugC` |
| --- | --- |
| `DrugA:Placebo` (`25.6`) | 25.6% |
| `DrugB:DrugC` (`25.05`) | 25.1% |
| `DrugC:Placebo` (`24.29`) | 24.3% |
| `DrugA:DrugB` (`23.74`) | 23.7% |
| `DrugB:Placebo` (`1.31`) | 1.3% |

In plain terms, there are no head-to-head trials of `DrugA vs DrugC`. About half of its NMA estimate comes through the `DrugA–Placebo–DrugC` path (25.6% + 24.3%), and the other half through the `DrugA–DrugB–DrugC` path (23.7% + 25.1%). If these paths include high risk of bias studies, they affect the bias rating of this comparison in proportion to these weights.

*Tip: you don't normally need to unpack this string yourself. The stacked bar charts on the `Within-study bias` and `Indirectness` pages in the next step are this same matrix, drawn as a chart. Only if a journal reviewer asks for the contribution matrix as a supplementary table do you need to split this CSV into columns in Excel (or paste it into an AI tool to turn it into a table).*

## The six domains, step by step

### 1. Within-study bias

- **What to do / what to choose**: The page shows the overall risk of bias distribution (in this example, 7 studies: `3 Low`, `3 Moderate`, `1 High`) and a stacked bar chart weighted by contribution percentage. In the rule menu, choose **`Majority RoB`** (the others are `Average RoB` and `Highest RoB`), then click **`Proceed`**.
- **What you see**: `DrugC:Placebo` is more than half red and is rated `High risk`; `DrugB:DrugC` is more than half green and is rated `Low risk`; the other 4 comparisons are `Some concerns`.
- **Common mistakes**: With `Highest RoB`, any comparison whose evidence includes even 1 high-risk study is rated red, which easily leads to rating down too much.

![The Within-study bias page showing the bias contribution bar chart and the Majority RoB rule](/images/blog/cinema-upload-tutorial/04-within-study-bias.png)

*The width of each colour in the bar chart matches the contribution matrix weights. After selecting `Majority RoB` in the red box, check the rating on each comparison card below.*

> **Rule of thumb**: Using the contribution weights, see whether each comparison is driven mainly by low, moderate or high risk of bias studies.

### 2. Reporting bias

- **What to do / what to choose**: First click **`Set all Low risk`**, then change the drop-down on the card of any comparison where you suspect publication bias. (CINeMA 3.0.1 has replaced the old `undetected / suspected` labels with `Low risk / Some concerns / High risk`.) If you have assessed reporting bias with ROB-MEN, you can also click **`Upload table ROB-MEN`** to import its Table 2 CSV directly (it must have `comparison`, `treat1`, `treat2` and `final` columns). Click **`Proceed`** when done.
- **What you see**: After the bulk setting, 6 comparison cards appear, and you can adjust each one.
- **Common mistakes**: If you skip this page without clicking any setting button, you won't be able to complete the report.

![The Reporting bias page with a one-click setting button and the ROB-MEN table import area](/images/blog/cinema-upload-tutorial/05a-reporting-bias-options.png)

*The left red box sets everything to `Low risk` in one click; the right red box is the new `Upload table ROB-MEN` CSV upload.*

![Reporting bias cards after setting all comparisons to Low risk](/images/blog/cinema-upload-tutorial/05-reporting-bias.png)

*If the comparison-adjusted funnel plot for a comparison looks asymmetric, or you suspect unpublished studies, change that card's drop-down to `Some concerns` or `High risk`.*

> **Rule of thumb**: Consider funnel plot symmetry, grey literature and trial registry records together to judge whether the result is affected by publication bias or selective reporting.

### 3. Indirectness

- **What to do / what to choose**: Review the indirectness distribution (`5 low`, `2 moderate`) and the bar chart, choose the **`Majority`** rule (the others are `Average` and `Highest`), then click **`Proceed`**.
- **What you see**: `DrugB:DrugC` and `DrugC:Placebo` are `Some concerns`; the other 4 comparisons are `No concerns`.
- **Common mistakes**: Treating "no direct comparison" (such as `DrugA:DrugC`) as indirectness. The uncertainty that comes from relying only on indirect evidence shows up under Imprecision, not here.

![The Indirectness page showing the indirectness contribution bar chart and the Majority rule](/images/blog/cinema-upload-tutorial/06-indirectness.png)

*Note `Selected rule: Majority` in the red box, and the comparisons with a large yellow (moderate indirectness) share in the bar chart.*

> **Rule of thumb**: Using the contribution weights, add up how far each study departs from your PICO, and check whether the evidence can answer your clinical question.

### 4. Imprecision

- **What to do / what to choose**: In **`Define clinically important size of effect: Odds ratio`**, enter the smallest effect you consider clinically important, click **`Set`**, then click **`Proceed`**. There is no standard value for this threshold; decide it in advance based on clinical expertise. This example uses **`1.25`**.
- **What you see**: The software automatically calculates the reciprocal, **`0.800`**, so the range of equivalence ("no clinically important difference") is `0.800–1.250`. For the first 5 comparisons, the 95% CI lies **entirely on one side of the line of no effect (`OR = 1`)** (for instance `0.377–0.900` for `DrugA:DrugB` is wholly below 1, and `1.166–4.058` for `DrugC:Placebo` is wholly above 1). Even where one end enters `0.800–1.250`, not crossing `1` leaves the clinical direction unambiguous, so the card says `does not cross clinically important effect` and rates them `No concerns`. Only the indirect-only comparison **`DrugA:DrugC`** (OR 1.392, 95% CI `0.700–2.768`) crosses `1` as well as both `0.800` and `1.250`, so it turns red as **`Major concerns`**.
- **Common mistakes**: Clicking Set with the default value `1`, which means no "no difference" range at all. Another mistake is entering 1.25 for a continuous outcome (MD) instead of converting it to the minimal clinically important difference (MCID) for that scale.

![The Imprecision page with the clinically important threshold set to 1.25 and the confidence interval of each comparison judged automatically](/images/blog/cinema-upload-tutorial/07-imprecision.png)

*After entering `1.25` in the red box and clicking `Set`, the first five comparisons remain green because none cross the line of no effect (`OR = 1`), whereas `DrugA:DrugC` crosses both thresholds and is marked red as `Major concerns`.*

> **Rule of thumb**: If the 95% CI lies entirely on one side of the line of no effect (`OR = 1`) or falls completely within the range of equivalence, rate `No concerns`. If it crosses the line of no effect and extends into one clinically important threshold, rate `Some concerns`. If it crosses both thresholds (covering both clinically important benefit and harm), rate `Major concerns`.

### 5. Heterogeneity

First, two terms:

- **τ² (tau-squared)**: the between-study variance. The larger it is, the more the study results differ from each other.
- **95% prediction interval (PI)**: the range in which the true effect of a new study is likely to fall. It includes between-study variation and uses a t-distribution with fewer degrees of freedom (rather than the normal z = 1.96 used for the 95% CI), so **even when the network τ² = 0, the 95% PI is still wider than the 95% CI**.

How to use the page:

- **What to do / what to choose**: This page automatically reuses the `0.800–1.250` range from the previous step, and the input box is locked. Below it is an optional **`Select type of intervention and outcome`**. Choose the type of intervention and outcome and click **`View`**, and the software lists the typical τ² range seen in similar past studies. This helps you judge whether the between-study variance in your network is small, typical or large. Then click **`Proceed`**.
- **What you see**: The overall τ² for the network is 0.000. Some comparisons have I² = 0.0%, but for **`DrugA:DrugB`** (95% CI `0.377–0.900`; 95% PI `0.329–1.030`) and **`DrugC:Placebo`** (CI `1.166–4.058`; PI `0.960–4.928`), the 95% prediction interval **crosses the line of no effect (`OR = 1`)** into the range of equivalence. This changes the conclusion from the 95% CI, so the software rates them **`Some concerns`**.
- **Important (the Reset trap)**: The **`Reset`** button next to the `1.25` threshold (red box in the image below) shares its setting with the Imprecision page. **If you click it and confirm, the Imprecision threshold is cleared as well.**

![The Heterogeneity settings area, where you can click View to compare against the typical τ² range of similar studies; note the linked Reset button](/images/blog/cinema-upload-tutorial/08-heterogeneity.png)

*Do not click `Reset` in the top red box, or the `1.25` you set on the `Imprecision` page will also be reset to the default `1`.*

![Heterogeneity comparison cards showing I², the τ² reference range, and the 95% CI vs the 95% PI](/images/blog/cinema-upload-tutorial/08b-heterogeneity-cards.png)

*Each card shows the `Confidence interval` and `Prediction interval` side by side. Whenever the two lead to different conclusions about the thresholds, the card turns yellow.*

> **Rule of thumb**: Check whether the 95% prediction interval changes what the 95% confidence interval told you about clinical importance.

### 6. Incoherence

This page checks whether the direct and indirect evidence give conflicting answers. CINeMA uses two kinds of test:

- **Global test**: the design-by-treatment interaction test, which checks the whole network for incoherence at once.
- **Local test**: the SIDE test, also called node-splitting. For a given comparison, it separates the direct evidence from the indirect evidence, estimates each, and compares them. The ratio between them is the ROR (ratio of odds ratios: direct OR ÷ indirect OR). An ROR of 1 means the two agree completely.

How to use the page:

- **What to do / what to choose**: Nothing to enter. Review the global and local test results, then click **`Proceed`**.
- **What you see**: The global test (random effects) gives χ² = 1.127 (df = 5, P = 0.952). The SIDE P values for the comparisons range from `0.667` to `0.835`; the indirect-only comparison `DrugA:DrugC` shows `Not applicable`. All comparisons are rated **`No concerns`**.

**What does the SIDE P value mean?** Its null hypothesis is that the direct and indirect evidence show the same treatment effect, that is, ROR = 1. **The smaller the P value, the stronger the statistical evidence that the direct and indirect evidence disagree.** These tests have low statistical power and can easily miss real incoherence, so CINeMA uses a more lenient warning threshold of `P < 0.10` instead of `0.05`.

**Rating rules (tested in CINeMA 3.0.1)**

First identify which type of evidence the comparison has, then use the matching table.

**Case A: mixed evidence (both direct and indirect) → use that comparison's SIDE P value**

| SIDE P value | Rating |
| --- | --- |
| `P ≥ 0.10` | **`No concerns`** |
| `P < 0.10` | Compare further (see below) |

When `P < 0.10`, the software uses the clinical thresholds as cut-points that divide the scale into zones. It then checks which zones the 95% CI of the direct evidence and the 95% CI of the indirect evidence each fall into:

- Both fall in exactly the same zones: still **`No concerns`**
- They differ by 1 zone: **`Some concerns`**
- They differ by 2 or more zones: **`Major concerns`**

**Case B: only direct or only indirect evidence (SIDE shows `Not applicable`) → use the global test P value**

| Global test P value | Rating |
| --- | --- |
| `P > 0.10` | **`No concerns`** (for example, `DrugA:DrugC` in this example is green because the global P = 0.952) |
| `0.05 < P ≤ 0.10` | **`Some concerns`** |
| `P ≤ 0.05`, or no closed loops in the network | **`Major concerns`** |

- **Common mistakes**: Seeing `Not applicable` on an indirect-only card and assuming the software skipped it. In fact, it has automatically used the global test P value instead (Case B). Be aware, though, that if the whole network is a star network with no closed loops, every comparison is rated `Major concerns` automatically. If you have no clinical or logical reason to suspect incoherence, you can change the rating in the card's drop-down.

![The Incoherence page showing the global design-by-treatment interaction test and the local SIDE results](/images/blog/cinema-upload-tutorial/09-incoherence.png)

*First look at the Global test P value at the top (0.952), then check the ratio of direct to indirect OR (ROR) and the P value for each comparison below.*

> **Rule of thumb**: First check whether the SIDE (or global) P value is below 0.10. If it is, check whether the direct and indirect 95% CIs lead to conflicting clinical conclusions.

## The Report page, exporting the report, and uploading to NMAstudio

On the **Report** page, the software groups the 6 comparisons into `Mixed evidence` and `Indirect evidence`. **Beginners must do these two things:**

1. **Tick the reasons for rating down and change the final rating by hand**: By default every row is `High` and the reasons are blank. Click the small checkboxes in the yellow or red cells to fill in `Reason(s) for downgrading`, then choose `High`, `Moderate`, `Low` or `Very low` from the **`Confidence rating`** drop-down. Consider how the domains relate to each other instead of mechanically dropping one level per yellow light. In this example:
   - `DrugA vs DrugB`: rated down to `Low` after considering its concerns together
   - The three comparisons with a yellow light in only one domain: rated down to `Moderate`
   - `DrugC vs Placebo` (high risk of within-study bias plus several yellow lights) and `DrugA vs DrugC` (serious imprecision): rated down to `Very low`
2. **Download the report and back up**: Click **`Download Report`** in the top-right corner to export a `.csv` (or click `Export PDF`). Finally, go back to `Projects` and export a `.cdb` or `.cnm` file.

![On the Report page, tick the reasons for rating down, choose the final confidence rating, and click Download Report to export](/images/blog/cinema-upload-tutorial/10-report-export.png)

*Be sure to tick the checkboxes in the yellow and red cells and adjust the `Confidence rating` drop-down in the red box. Once the reasons are listed on the right, click `Download Report` in the top red box.*

Download the report exported in this example: [cinema-example-report.csv](/files/cinema-upload-tutorial/cinema-example-report.csv)

**Upload back to NMAstudio to colour the league table:** Go back to [NMAstudio](/en/blog/nmastudio-upload-tutorial/) and run the NMA on the same data. Open the **CINeMA** tab at the top and upload this `.csv` under the matching outcome name. NMAstudio reads its `Comparison` and `Confidence rating` columns and colours each cell of the league table as `High`, `Moderate`, `Low` or `Very low`. Treatment names must be spelled exactly the same in both tools.

## Troubleshooting

| Error or problem | Common cause | Fix |
| --- | --- | --- |
| `At least one cell is empty in column ...` | Missing values in the Excel sheet, or a stray space typed below or to the right of the data, leaving a blank row | Copy only the actual data range into a new worksheet and save it as CSV UTF-8 again |
| Upload rejected because the `rob` column is missing | The CINeMA 3.0.1 validator always checks for the `rob` column | Keep the `rob` column and fill it with `1`/`2`/`3`, even when just testing |
| Warning that `rob` or `indirectness` is inconsistent within a study | In a multi-arm trial or wide format, rows with the same `id` have different numbers | Sort by `id` in Excel and make sure every row of the same `id` matches |
| The analysis fails after clicking `Set up your evaluation` | The network is not fully connected, or there is `n = 0` or `r > n` | Go back to `Configuration` and check that the network is connected and the values are in range |
| `sensitivity analysis not possible ... server_busy` appears | The main and sensitivity analyses were sent at the same time and the server is busy; or, after excluding moderate-to-high risk of bias studies, the remaining Low risk studies no longer form a connected network | Click `OK`. As long as `Proceed` appears, you can continue with the main analysis. If you need the sensitivity analysis table, wait 5–10 seconds and click `Reset your evaluation` to run it again |
| The threshold resets to its default when you return to `Imprecision` | You clicked `Reset` next to the threshold on `Heterogeneity` or `Incoherence` | These three pages share the same threshold (resetting restores `1` for OR/RR and `0` for MD/SMD). Go back to `Imprecision`, enter it again and click `Set` |
| Every row in the exported `Report.csv` is `High` | You forgot to tick the yellow and red checkboxes and change the `Confidence rating` on `Report` | Go back to `Report`, tick the reasons, change the ratings and download again |
| The project is gone after reopening the browser | You cleared your browser data, or switched to a private window or another computer | CINeMA only stores data in `localStorage`, so always export a `.cdb` or `.cnm` file |

## Further reading and trilogy recap

If you are starting from data preparation or statistical modelling, check the earlier posts in this series:

- Part 1 (Bayesian/Frequentist models and meta-regression): [MetaInsight v7.1.1 Data Upload Tutorial: From Excel to NMA](/en/blog/metainsight-upload-tutorial/)
- Part 2 (Multi-outcome league tables, transitivity checks, and importing CINeMA ratings): [NMAstudio 2.0 Data Upload Tutorial: From Excel to Interactive NMA](/en/blog/nmastudio-upload-tutorial/)

## References

1. Nikolakopoulou A, Higgins JPT, Papakonstantinou T, et al. CINeMA: An approach for assessing confidence in the results of a network meta-analysis. *PLOS Medicine*. 2020;17(4):e1003082. (Methods paper, [PMC7122720](https://pmc.ncbi.nlm.nih.gov/articles/PMC7122720/))
2. Papakonstantinou T, Nikolakopoulou A, Higgins JPT, Egger M, Salanti G. CINeMA: Software for semiautomated assessment of the confidence in the results of network meta-analysis. *Campbell Systematic Reviews*. 2020;16(1):e1080. (Software paper, [PMC8356302](https://pmc.ncbi.nlm.nih.gov/articles/PMC8356302/))
3. CINeMA Web Application (Version 3.0.1): [https://cinema.med.auth.gr/](https://cinema.med.auth.gr/) (the current site that `https://cinema.ispm.unibe.ch/` redirects to; source code and documentation at [tpapak/cinema](https://github.com/tpapak/cinema))
