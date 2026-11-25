---
title: 'Uploading Data to NMAstudio: From Excel to an Interactive Network Meta-Analysis'
description: A step-by-step guide to preparing long, wide or inverse-variance data and uploading it to NMAstudio 2.0, with multi-outcome setup, example CSV files and troubleshooting.
pubDate: 2026-11-25
category: notes
tags: [Evidence-based medicine, Network meta-analysis, Research methods]
draft: false
---

In a network meta-analysis (NMA), you may want to:

- Put the main efficacy outcome and serious adverse events in the same league table
- Check transitivity, that is, whether the studies behind each comparison are similar enough
- Show the CINeMA certainty-of-evidence ratings directly on your results

If so, **NMAstudio** is a very handy tool.

One thing to know first: the address that older papers and tutorials give, `https://www.nmastudioapp.com/`, and the manual at `http://www.nmastudioapp.com/doc`, both return a 503 error and cannot be reached.

After the team published its 2026 paper, the version that is publicly available is **NMAstudio 2.0**, hosted on a cloud server in Norway: [https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/). This post follows the actual 2.0 interface and my own test runs, and walks you through preparing, uploading and checking your data.

## What is NMAstudio 2.0, and who is it for?

NMAstudio is an interactive web tool for NMA, developed by Anna Chaimani and Silvia Metelli's team at Université Paris Cité. Behind the scenes it uses the R package `netmeta` to fit a Frequentist random-effects model.

Main strengths:

- You can upload several outcomes at once.
- You assign columns with drop-down menus on the web page, so you can name your columns however you like.
- It offers visual transitivity checks (box plots and scatter plots).
- You can import CINeMA reports to colour the tables by certainty of evidence.
- It generates an NMA-KIT knowledge-translation report in one click.

Limitations:

- Frequentist analysis only: no Bayesian ranking and no meta-regression.
- With several outcomes, each variable must map to a different column; columns cannot be shared.
- There are a few more settings to get right than in MetaInsight.

## Before you start: what data do you need?

First, collect the following for each included RCT in Excel:

1. **Study ID and publication year**
   - Each study needs a unique name, such as `Chen_2021`.
   - `year` is optional. If you fill it in, the results page adds a timeline slider so you can see how the network grew over time.
2. **Treatment name and treatment class (optional)**
   - Decide on one short name for each treatment and use it throughout.
   - To colour the network nodes automatically by drug mechanism, add a `treat_class` column (this name is fixed and cannot be changed).
3. **Risk of bias (`rob`)**
   - Optional in version 2.0. It is rated per study on three levels: low, moderate, high.
   - It can be coded as `1/2/3`, `l/m/h` or `L/M/H`.
   - Every row of the same study must have the same value.
4. **Data for one or more outcomes**
   - **Binary outcomes**: number of events and total number of participants.
   - **Continuous outcomes**: mean, standard deviation and **number of participants in each arm**. Note: in my tests, version 2.0 also requires the sample size `n` for continuous outcomes.
   - **Inverse-variance format (`iv`)**: the effect estimate for each comparison `TE` (for example log OR or MD), its standard error `seTE`, and the two arm sizes `n1` and `n2`.
5. **Effect modifiers (optional)**
   - For example mean age, proportion of men, or baseline disease severity.
   - Used for the transitivity checks.

## Choosing a data format: long, wide or IV?

NMAstudio 2.0 accepts three CSV formats. They differ in what one row represents, and in how a multi-arm trial (a trial with three or more arms) is split into rows:

- **Long format**: one row per treatment arm, so a three-arm trial takes 3 rows. **Best for beginners**: column names need no `1`/`2` suffixes, and node colouring with `treat_class` is fully supported.
- **Wide format**: one row per pairwise comparison. A three-arm trial must therefore be split into 3 rows (A vs B, A vs C, B vs C). Do **not** add a `treat3` column for the third arm.
- **Wide inverse-variance (`iv`)**: also one row per comparison, but you enter a ready-made relative effect `TE` and `seTE`. Useful when the original paper reports only an adjusted effect estimate and its confidence interval.

| Data format | Suggested columns (you map the names after upload) | Notes |
| --- | --- | --- |
| Binary, long (one row per arm) | `studlab, year, rob, treat, treat_class, r, n` | Hardest to get wrong for multi-arm trials; supports `treat_class` colouring |
| Binary, wide (one row per comparison) | `studlab, year, rob, treat1, treat2, r1, n1, r2, n2` | Trials with three or more arms must be split into several pairwise rows |
| Continuous, long | `studlab, year, rob, treat, treat_class, y, sd, n` | First choice for continuous outcomes (`n` required in 2.0) |
| Continuous, wide | `studlab, year, rob, treat1, treat2, y1, sd1, n1, y2, sd2, n2` | Pairwise format for continuous outcomes (`n1`, `n2` required in 2.0) |
| Wide inverse-variance (`iv`) | `studlab, year, rob, treat1, treat2, TE, seTE, n1, n2` | For ready-made effect estimates (e.g. log OR, MD, SMD) |

## Column reference

On the `SETUP` page, NMAstudio 2.0 uses drop-down menus to assign a role to each column, so you can name most columns however you like. Only a few columns, such as `treat_class`, need a fixed name.

| Column role | Long format | Wide/IV format | Type and coding | Required/optional |
| --- | --- | --- | --- | --- |
| Study ID (`studlab`) | Your choice (e.g. `studlab`) | Your choice (e.g. `studlab`) | Text; must be identical on every row of a study | Required |
| Treatment name | `treat` (renamable) | `treat1`, `treat2` (renamable) | Text; avoid special characters | Required |
| Risk of bias (`rob`) | Your choice (e.g. `rob`) | Your choice (e.g. `rob`) | `{1,2,3}`, `{l,m,h}` or `{L,M,H}` | Optional |
| Publication year (`year`) | Your choice (e.g. `year`) | Your choice (e.g. `year`) | 4-digit year (integer) | Optional |
| Binary outcome | Events `r`, participants `n` | `r1, n1, r2, n2` | Integers; each outcome needs its own columns | Required for binary |
| Continuous outcome | Mean `y`, SD `sd`, participants `n` | `y1, sd1, n1, y2, sd2, n2` | Numbers; **`n` required in 2.0 (tested)** | Required for continuous |
| Inverse variance (`iv`) | — | `TE, seTE, n1, n2` | Numbers; **`n1, n2` also required in 2.0 (tested)** | Required for IV |
| Treatment class (fixed name) | `treat_class` | `treat1_class`, `treat2_class` | Text; **name cannot be changed** (in my tests, wide format does not colour the network plot) | Optional |
| Effect modifier | Your choice (e.g. `mean_age`) | Your choice (e.g. `mean_age`) | Number or category; must be the same on every row of a study | Optional |
| CINeMA import file | Uploaded separately in the `CINeMA` tab | Uploaded separately in the `CINeMA` tab | The original CSV exported from CINeMA (the paper says it must include `Comparison` and `Confidence rating`) | Optional |

## Example data: binary and continuous (long/wide)

The examples reuse the data from the MetaInsight tutorial: 5 RCTs in knee osteoarthritis, where `Chen_2021` is a three-arm trial.

- **Binary**: two outcomes, `Pain_Relief` and `Adverse_Events`.
- **Continuous**: a 0–10 VAS pain score, where lower is better.

All four files ran successfully in NMAstudio 2.0. The screenshots in the steps below use the binary long file.

### Binary outcome: long format (11 rows, two outcomes and `treat_class`, recommended)

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

Download: [nmastudio-example-long.csv](/files/nmastudio-upload-tutorial/nmastudio-example-long.csv)

### Binary outcome: wide format (7 rows; the three-arm trial is split into `k(k−1)/2 = 3` rows)

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

Download: [nmastudio-example-wide.csv](/files/nmastudio-upload-tutorial/nmastudio-example-wide.csv)

### Continuous outcome: long format (11 rows, VAS pain score, recommended)

This file uses the VAS pain score instead: the arm mean `vas_mean`, standard deviation `vas_sd` and total participants `vas_n` (a lower score means less pain):

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

Download: [nmastudio-example-continuous-long.csv](/files/nmastudio-upload-tutorial/nmastudio-example-continuous-long.csv)

### Continuous outcome: wide format (7 rows)

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

Download: [nmastudio-example-continuous-wide.csv](/files/nmastudio-upload-tutorial/nmastudio-example-continuous-wide.csv)

## Tips for preparing the data in Excel and saving as CSV

1. **Give every outcome its own sample-size column**
   - NMAstudio 2.0 requires every variable in the drop-down menus to map to a different column in the file.
   - Even if efficacy and adverse events have exactly the same denominators, split them into `n_resp` and `n_ae` (or `N` and `N2`) as in the examples above. One column cannot serve two outcomes.
2. **Keep study-level columns consistent**
   - Within a study, `year`, `rob` and any effect modifier used for the transitivity check (such as `mean_age`) must have the same value on every row.
   - Leave missing values blank; do not type text such as `NA`.
   - Always use a full stop `.` as the decimal separator.
3. **You do not need to handle zero events yourself**
   - Some older tools make you calculate everything by hand before uploading. NMAstudio 2.0 handles it automatically and states the rules in the analysis progress window:
   - **Zero events in one arm**: a **0.5 continuity correction** is applied automatically.
   - **Zero events in both arms**: the study is excluded automatically.
4. **CSV only**
   - The interface says `* The dataset should be uploaded as the csv format`.
   - In Excel, save as **CSV UTF-8 (Comma delimited) (*.csv)**. Do not upload the `.xlsx` file directly.
5. **You can download the official example first**
   - The home page offers a complete psoriasis example: 158 RCTs and 20 drugs, from the Cochrane review by Sbidian and colleagues.
   - You can download `psoriasis_long_complete.csv`, `variables_explain.pdf`, and `data format.pdf` from the `SETUP` page.

## Step-by-step upload and column mapping

### Step 1: Open NMAstudio 2.0 and go to SETUP

Open [https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/). The home page shows a four-step flowchart and the heading **Welcome to NMAstudio 2.0**. Click **SETUP** in the navigation bar at the top right.

![NMAstudio 2.0 home page, with the SETUP tab at the top right outlined in red](/images/blog/nmastudio-upload-tutorial/01-home.png)
*Check that the top-left logo says NMAstudio 2.0, then click SETUP at the top right to begin.*

### Step 2: Clear the default project, enter project details and upload the CSV

1. When you open `SETUP`, the default psoriasis example may already be loaded. Click the **circular-arrow (Reset) icon** at the top left to clear the project and confirm in the pop-up. Only then can you upload your own data.
2. Enter a `Project title` and click `OK`. `Protocol link` is marked as required in red, but in my tests the analysis ran fine with it left blank.
3. Drag the CSV into the upload box, or click `Select a File`.
4. Below it, choose the format: **long**, **wide** or **iv**.

![the Reset button, project title, CSV upload box and format options at the top of the SETUP page](/images/blog/nmastudio-upload-tutorial/02-setup-upload-format.png)
*Always click the Reset icon at the top left before switching data. Wait until the file name appears next to the upload box, then choose the data format.*

### Step 3: Map the overall variables (Select overall variables)

After you choose a format, `Select overall variables` appears below. Map your CSV columns to:

- `study ID`: here, `studlab`
- `treat`: here, `treat`
- `rob` and `year` (optional)

The red box on the right reminds you that `rob` only accepts `{1,2,3}`, `{l,m,h}` or `{L,M,H}`.

![the Select overall variables drop-down menus, with the rob coding rules on the right](/images/blog/nmastudio-upload-tutorial/03-overall-variables.png)
*Your own column names work as long as they are mapped correctly. rob must be the same on every row of a study.*

### Step 4: Set the number of outcomes and map each outcome

1. In `Enter the number of outcomes:`, enter the number of outcomes. Here, enter `2` and click `OK`.
2. With 2 or more outcomes, tick the two outcomes to show together in the league table. With only 1 outcome, tick `Skip`.
3. Set Outcome 1: `binary`, named `Pain_Relief`, with `OR` and `beneficial`, mapped to `r_resp` and `n_resp`.
4. Click **Next** and set Outcome 2: `Adverse_Events`, with `OR` and `harmful`, mapped to `r_ae` and `n_ae`.

If you use the continuous example file above: enter `1` outcome and tick `Skip` for the league table; choose `continuous`, then `MD` and `harmful`, and map `vas_mean`, `vas_sd` and `vas_n` in that order.

![setting the names and effect direction for two outcomes and the column mapping for Outcome 1; the note on the right says each column can only be chosen once](/images/blog/nmastudio-upload-tutorial/04-outcome-mapping.png)
*The note on the right: every drop-down must point to a different column. If Next cannot be clicked, you have usually left a field empty or picked the same column twice.*

### Step 5: Select effect modifiers and run the analysis

When all outcomes are set, `Select potential effect modifiers` appears below.

1. Tick the variables you want to see in the transitivity plots. Here, tick `mean_age`; if you do not need this check, tick `Skip`.
2. Scroll to the bottom and click **Run Analysis**.

![the section for selecting the effect modifier mean_age](/images/blog/nmastudio-upload-tutorial/05-effect-modifiers.png)
*Tick the covariates to check (such as `mean_age`) or tick Skip; only then can you click Run Analysis at the bottom.*

A `Running data analysis` progress window then opens with four items: Network meta-analysis, Pairwise meta-analysis, League table, Consistency and Ranking, and Funnel plot. When all four show a green tick, you are taken to the results page automatically.

![the Running data analysis window, showing the automatic zero-event correction rules and all four analyses ticked as complete](/images/blog/nmastudio-upload-tutorial/06-running-analysis.png)
*The window also states that the `netmeta` random-effects model is used: a 0.5 correction is added when one arm has zero events, and studies with zero events in both arms are excluded.*

## After uploading: how do you check the data were read correctly?

You land on the **RESULTS** tab at the top, on the default `Data & Transitivity` view. Do three quick checks:

1. **Check that the network plot on the left is connected and coloured correctly**
   - The default `Circle` layout may cut off nodes at the edges. Click **Graph Options** at the top left → `Graph Layout` and switch to **Cose**.
   - Then set `Node colour` to **By class** so that nodes are coloured by `treat_class`.
   - Confirm the network is fully connected: there are no breaks between `Placebo`, `Oral_NSAID`, `Topical_NSAID` and `IA_HA`.
2. **Check that `Converted Data` on the right splits the multi-arm trial correctly**
   - Open the `Converted Data` tab and confirm that the three-arm trial `Chen_2021` has been split into 3 pairwise rows: `Placebo vs Oral_NSAID`, `Placebo vs Topical_NSAID` and `Oral_NSAID vs Topical_NSAID`.
   - Confirm that `TE1` and `TE2` have been calculated.

![the network plot on the RESULTS page and Converted Data on the right; nodes are coloured by treatment class and the three-arm trial is split into three comparisons](/images/blog/nmastudio-upload-tutorial/07-results-network-converted.png)
*Graph Options at the top left changes the layout (Cose) and class colouring (By class); on the right you can check the pairwise rows the system created.*

3. **Switch to `Imported Data` to check the raw data**
   - Click the `Imported Data` tab on the right and confirm that all 11 rows (5 studies) of the long file are there, with no garbled text or shifted values.
   - Scroll down to see the transitivity box plot and scatter plot for `mean_age`.

![the Imported Data tab, for checking the 11 rows of uploaded raw data](/images/blog/nmastudio-upload-tutorial/08-results-imported-data.png)
*Check the raw data, risk-of-bias codes and age row by row here before moving on to the results.*

Once the data look right, use the `Select results to display` drop-down at the top to switch between:

- `League tables`: shows the tables for `Pain_Relief` and `Adverse_Events` side by side
- `Ranking`
- `Consistency & Reporting bias`

If you have already rated the certainty of evidence in the [CINeMA web application](https://cinema.ispm.unibe.ch/), open the **CINeMA** tab at the top and upload one report CSV for each outcome name. The league table is then coloured by certainty of evidence automatically.

![the CINeMA tab, with a separate report upload area for each outcome](/images/blog/nmastudio-upload-tutorial/09-cinema-tab.png)
*To bring in the certainty ratings for several outcomes, upload the matching CINeMA export for each outcome name here.*

## Troubleshooting

| Problem | Common cause | Fix |
| --- | --- | --- |
| `nmastudioapp.com` shows a 503 error | The old address is no longer in service | Use the NMAstudio 2.0 address [https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/) |
| `Next` or `Run Analysis` does not appear during setup | A column was picked twice; sample size `n` missing in continuous or IV format; only 1 outcome but `Skip` not ticked | Make sure each outcome has its own sample-size column, continuous and IV formats have `n` or `n1`, `n2` mapped, and with only 1 outcome tick `Skip` at the league table step |
| Error messages for a single study | `rob`, `year` or an effect modifier differs between rows of the same study | Go back to Excel and make `rob`, year and covariates the same on every row of that study |
| Three-arm trial fails to import in wide format | You added your own `treat3`, `r3` columns | In wide format, a three-arm trial must be split into 3 pairwise rows |
| Old data still shown after uploading a new file | The previous project was not cleared | Click the Reset icon at the top left of `SETUP`, or reload or reopen the browser tab and upload again |
| Nodes do not change colour with `By class` in wide format | In my tests, version 2.0 does not colour by `treat1_class`/`treat2_class` in wide format | If you need colouring by drug class, use long format with a `treat_class` column |

## Further reading and tool comparison

If your study needs a **Bayesian NMA** or **meta-regression** on covariates, see the previous post: [Uploading Data to MetaInsight: From Excel to Network Meta-Analysis](/en/blog/metainsight-upload-tutorial/).

In one sentence: **MetaInsight is strongest for Bayesian models and meta-regression; NMAstudio 2.0 is strongest for showing several outcomes side by side and bringing in CINeMA certainty ratings.**

## References

1. Yu T, Metelli S, Papakonstantinou T, Chaimani A. NMAstudio 2.0: An interactive tool for network meta-analysis to enhance understanding, interpretation, and communication of the findings. *Research Synthesis Methods*. 2026;17(4):1–14. DOI: [10.1017/rsm.2026.10074](https://doi.org/10.1017/rsm.2026.10074)
2. Metelli S, Chaimani A. NMAstudio web-application: A brief tutorial (guide to version 1.0 and the CINeMA report columns): [https://silviametelli.com/NMAstudio_tutorial.pdf](https://silviametelli.com/NMAstudio_tutorial.pdf)
3. NMAstudio 2.0 official web application: [https://nmastudio.uiocloud.no/](https://nmastudio.uiocloud.no/) (includes the data format guide `data format.pdf` and the psoriasis example data `psoriasis_long_complete.csv`)
