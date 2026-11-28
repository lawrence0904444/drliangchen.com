---
title: 'MetaInsight v7.1.1 Data Upload Tutorial: From Excel to NMA'
description: How to upload data to MetaInsight v7.1.1. Step-by-step guide to long and wide CSV formatting from Excel, case-sensitive headers, ranking direction, 4 example CSVs and troubleshooting.
pubDate: 2026-11-25
updatedDate: 2026-11-28
category: notes
tags: [MetaInsight, Network meta-analysis, Evidence-based medicine, Research methods]
draft: false
faq:
  - q: 'Why does the MetaInsight URL show a 404 Page not found error?'
    a: 'The official MetaInsight v7.1.1 address requires a trailing slash: https://crsu-metainsight.le.ac.uk/MetaInsight/. Leaving off the trailing slash returns a 404 error.'
  - q: 'Can I upload an Excel (.xlsx) file directly to MetaInsight, or do I need a CSV?'
    a: 'MetaInsight v7.1.1 supports direct .xlsx uploads, but saving your tidied table as CSV UTF-8 (Comma delimited) in Excel is still recommended to avoid hidden formatting issues or reading the wrong worksheet.'
  - q: 'Should I choose long or wide format, and how many trial arms does MetaInsight support?'
    a: 'Use the long format (one row per arm) if you have trials with three or more arms or many study-level covariates. If all trials have two arms, wide format is also fine. MetaInsight currently supports up to six arms per trial (up to .6 in wide format).'
  - q: 'How should I handle zero events in MetaInsight, and can I add 0.5 for Bayesian analysis?'
    a: 'If you only run a Frequentist model (netmeta) and a study has zero events in one arm, you can apply the standard 0.5 continuity correction in Excel (add 0.5 to R and 1 to N in every arm of that study). However, Bayesian binomial models (gemtc) expect integer event counts, so entering decimals like 0.5 may cause errors or depart from standard Bayesian practice. Studies with zero events in both arms are generally excluded from relative effect estimates; upload raw integers first, check the Log window, and run a sensitivity analysis if needed.'
  - q: 'Why do I still see the default example data after selecting my file, or why are the treatment rankings upside down?'
    a: 'After selecting your file and waiting for the red progress bar to say Upload complete, you must click the blue Load data button below to actually load the file. If rankings are reversed, check For treatment rankings, ORs less than 1 are under Configure analysis: for efficacy outcomes where a larger OR is better, change the default Desirable to Undesirable.'
---

**To upload data to MetaInsight v7.1.1: prepare a long or wide CSV in Excel with exact case-sensitive headers, open the official URL ending with `/`, go to `Setup`, select your file and click the blue `Load data` button, then set the reference treatment and ranking direction in `Configure analysis`.** If you already run conventional pairwise meta-analyses in RevMan or R, the hardest part of your first network meta-analysis (NMA) is usually not the statistical model. It is the upload that keeps throwing errors.

> **Free Online NMA Tools Trilogy (Part 1):** This series covers three widely used free web tools for NMA. Part 1 uses **MetaInsight v7.1.1** for statistical modelling (Bayesian MCMC and meta-regression); Part 2 uses [NMAstudio 2.0](/en/blog/nmastudio-upload-tutorial/) for multi-outcome interactive plots; Part 3 uses [CINeMA 3.0.1](/en/blog/cinema-upload-tutorial/) for GRADE-based confidence ratings.

This post uses **MetaInsight**, one of the most widely used NMA tools among clinicians and graduate students in Taiwan, and follows the v7.1.1 interface updated in June 2026. The address is [https://crsu-metainsight.le.ac.uk/MetaInsight/](https://crsu-metainsight.le.ac.uk/MetaInsight/). **The trailing slash `/` is required.** Without it you get a 404.

This post covers three things only: preparing your data in Excel, saving it as CSV, and checking that it was read correctly after upload. Interpreting the plots will be a separate post.

## Key points

- **Include the trailing `/` in the URL**, or you will get a 404; if the v7.1.1 server is busy, use the temporary v6 backup link.
- **Headers are fixed and case-sensitive**: treatment names may only contain letters, numbers and underscores `_` (no spaces, hyphens `-` or non-English characters).
- **Prefer long format**: it is hardest to get wrong for multi-arm trials (up to 6 arms supported); save as CSV UTF-8 even though `.xlsx` is accepted.
- **Always click `Load data` after selecting a file**: wait for `Upload complete`, then click the blue button to actually load your dataset.
- **Check the ranking direction**: `ORs less than 1 are` defaults to `Desirable` (for harms); for beneficial outcomes such as pain relief, switch it to `Undesirable`.

## What is MetaInsight, and who is it for?

MetaInsight is a web tool built by the Complex Reviews Support Unit (CRSU) at the University of Leicester, UK. You do not need to write any code. Behind the scenes it calls the R packages `netmeta`, `gemtc` and `bnma`.

Medical students, PGY doctors, residents and graduate students can use it, for a first look or for the final analysis, to quickly produce:

- network plots
- forest plots
- inconsistency tests
- treatment ranking probabilities

**Pros:**

- Nothing to install, and the interface is split into modules you click through in order.
- Supports both Frequentist and Bayesian analysis, plus meta-regression.

**Cons:**

- Only one outcome can be analysed at a time.
- Strict formatting rules for treatment names and multi-arm trial columns.
- The free online server can be slow when many people use it at once.

> **Version note:** The main MetaInsight site is now v7.1.1 (updated 2026-06-17). It looks different from the v5/v6 screenshots in many older tutorials online. The old version is temporarily kept at [https://crsu.shinyapps.io/MetaInsight_V6/](https://crsu.shinyapps.io/MetaInsight_V6/). Follow the v7.1.1 interface.

## Before you start: what data do you need?

Before opening Excel, make sure you have extracted the following from the included randomised controlled trials (RCTs):

1. **Study ID**: each study needs a unique name. "FirstAuthor_Year" works well, for example `Chen_2021`.
2. **Treatment arm names**: use one set of short names throughout. **Only letters, numbers and underscores `_` are allowed.**
3. **Outcome data**:
   - **Binary outcome**: the number of events (`R`) and the total sample size (`N`) in each arm. For example, "number of patients with at least 50% pain relief".
   - **Continuous outcome**: the total number (`N`), mean (`Mean`) and standard deviation (`SD`) in each arm.
4. **(Optional) Study-level covariates and risk of bias (RoB)**: if you plan to run meta-regression or export to CINeMA later, prepare things like mean age, follow-up length in weeks, or RoB ratings now.

## Choosing a data format: long vs wide

MetaInsight accepts two layouts, and either one works:

- **Long format**: one row per treatment arm. Recommended if you have trials with three or more arms, or many covariates.
- **Wide format**: one row per study. Also intuitive if all your trials have two arms and you like checking numbers side by side.

| Data format | Required columns | Notes |
| --- | --- | --- |
| Binary, long (one row per arm) | `Study, T, R, N` | Hardest to get wrong with multi-arm trials; most recommended |
| Binary, wide (one row per study) | `Study, T.1, R.1, N.1, T.2, R.2, N.2, ...` | Up to `.6` (six-arm trials) |
| Continuous, long (one row per arm) | `Study, T, Mean, SD, N` | First choice for continuous outcomes (columns are matched by name, so order is flexible) |
| Continuous, wide (one row per study) | `Study, T.1, Mean.1, SD.1, N.1, T.2, ...` | Leave the `.3` columns blank for two-arm studies |

## Column reference

MetaInsight uses fixed column names, and they are **case-sensitive**. There is no menu to map columns by hand, so every letter and every capital in the header must match exactly:

| Column | Format / outcome | Meaning | Type | Required / optional |
| --- | --- | --- | --- | --- |
| `Study` | All | Unique study name (`Author_Year` recommended) | Text | Required |
| `T` / `T.1`..`T.6` | Long / Wide | Treatment name (letters, numbers and `_` only) | Text | Required |
| `R` / `R.1`..`R.6` | Binary | Number of patients with the event in this arm | Integer / numeric | Required for binary |
| `N` / `N.1`..`N.6` | Binary and continuous | Total number of patients in this arm | Integer | Required |
| `Mean` / `Mean.1`..`Mean.6` | Continuous | Mean outcome in this arm | Numeric | Required for continuous |
| `SD` / `SD.1`..`SD.6` | Continuous | Standard deviation of the outcome in this arm | Numeric (> 0) | Required for continuous |
| `covar.<name>` | All | Study-level covariate (for meta-regression) | Numeric | Optional |
| `rob` | All | Overall risk of bias of the study (`1`=low, `2`=moderate, `3`=high) | Integer (1/2/3) | Optional |
| `indirectness` | All | Indirectness of the study (`1`=low, `2`=moderate, `3`=high; for CINeMA export) | Integer (1/2/3) | Optional |
| `rob.<domain>` | All | Individual RoB domains (up to 10 columns, coded `1`/`2`/`3`) | Integer (1/2/3) | Optional |

> **Practical note:** The `Load data` → `Guidance` page and the example data now use treatment names directly. You no longer need a separate `Number`/`Label` lookup file, as in v4 and earlier.
>
> If you have an old file from before v5.0 (with a `StudyID` column and numeric codes in `T`), convert it with `Setup` → `Upgrade old data` on the left.

## Example data: binary and continuous (long/wide)

The examples below all use the same made-up dataset: "pain treatments for knee osteoarthritis", with 5 RCTs and 4 treatments (`Placebo`, `Oral_NSAID`, `Topical_NSAID`, `IA_HA`). `Chen_2021` is a three-arm trial.

- **Binary**: number of patients with effective pain relief.
- **Continuous**: 0–10 VAS pain score, where lower means less pain.

All four examples were uploaded successfully in MetaInsight v7.1.1. The screenshots below mainly use the binary long example.

### Binary outcome: long format (recommended)

A study takes up as many rows as it has arms. Study-level columns (such as `covar.age`) must have exactly the same value in every row of the same study.

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

Download: [metainsight-example-long.csv](/files/metainsight-upload-tutorial/metainsight-example-long.csv)

### Binary outcome: wide format

All arms of a study are spread across one row, with `.1`, `.2`, `.3` marking each arm (v7.1.1 goes up to `.6`, i.e. six-arm trials). For two-arm trials, just leave the `.3` columns blank.

```csv
Study,T.1,R.1,N.1,T.2,R.2,N.2,T.3,R.3,N.3,covar.age
Lin_2019,Placebo,12,50,Oral_NSAID,28,52,,,,62.5
Wang_2020,Placebo,10,48,Topical_NSAID,24,50,,,,64.0
Chen_2021,Placebo,11,55,Oral_NSAID,30,54,Topical_NSAID,25,53,61.2
Tanaka_2022,Oral_NSAID,26,49,IA_HA,29,50,,,,66.8
Kim_2023,Placebo,14,60,IA_HA,35,61,,,,63.4
```

Download: [metainsight-example-wide.csv](/files/metainsight-upload-tutorial/metainsight-example-wide.csv)

### Continuous outcome: long format (recommended)

Same study structure as above, but using each group's VAS mean (`Mean`), standard deviation (`SD`) and number of patients (`N`). Lower scores mean more pain improvement.

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

Download: [metainsight-example-continuous-long.csv](/files/metainsight-upload-tutorial/metainsight-example-continuous-long.csv)

### Continuous outcome: wide format

For two-arm studies, leave all four columns `T.3`, `Mean.3`, `SD.3` and `N.3` blank and keep the commas lined up. Otherwise `covar.age` ends up in the wrong column:

```csv
Study,T.1,Mean.1,SD.1,N.1,T.2,Mean.2,SD.2,N.2,T.3,Mean.3,SD.3,N.3,covar.age
Lin_2019,Placebo,5.9,1.5,50,Oral_NSAID,3.9,1.4,52,,,,,62.5
Wang_2020,Placebo,5.8,1.6,48,Topical_NSAID,4.3,1.5,50,,,,,64.0
Chen_2021,Placebo,6.0,1.5,55,Oral_NSAID,3.8,1.4,54,Topical_NSAID,4.2,1.5,53,61.2
Tanaka_2022,Oral_NSAID,4.0,1.4,49,IA_HA,3.4,1.4,50,,,,,66.8
Kim_2023,Placebo,5.7,1.7,60,IA_HA,3.5,1.5,61,,,,,63.4
```

Download: [metainsight-example-continuous-wide.csv](/files/metainsight-upload-tutorial/metainsight-example-continuous-wide.csv)

## Tips for preparing data in Excel and saving as CSV

MetaInsight v7.1.1 can now read `.xlsx` files directly. Even so, I recommend tidying up your data in Excel and then **saving it as "CSV UTF-8 (Comma delimited) (*.csv)"**. This avoids many problems with hidden formatting or the wrong worksheet being read.

1. **Clean up all treatment names in one go**: use Excel's Find and Replace to replace spaces, hyphens (`-`), slashes (`/`) and brackets with an underscore `_`, or remove them. For example, change `Oral-NSAID` to `Oral_NSAID`. Do not use non-English characters in treatment names.
2. **No two arms in the same study can have the same name**: MetaInsight **does not accept two arms with the same treatment in one study**. If a trial compares a low and a high dose of the same drug, give them different names from the start, for example `Drug_10mg` and `Drug_20mg`. Otherwise, merge the two arms first according to your protocol.
3. **Two-arm trials in wide format**: leave `T.3`, `R.3` and `N.3` completely blank for two-arm studies. Do not type `NA` or `-`. Before saving, check that every row has the same number of columns.
4. **Handling zero events**: in the Binary Long guidance, the site warns: `N.B. Continuity corrections will need to be applied to cells containing 0 values`. How you handle them depends on the model you plan to run:
   - **Frequentist only (`netmeta`) with `0` events in one arm**: apply the standard `0.5` correction in Excel before uploading by **adding `0.5` to `R` and `1` to `N` in every arm of that study**. Note that a fixed `0.5` correction can introduce bias when events are rare or arms are imbalanced, so check stability with a sensitivity analysis.
   - **Bayesian analysis (`gemtc`)**: binomial likelihood models expect integer event counts. Entering decimals such as `0.5` may trigger errors or depart from standard Bayesian handling, so upload raw integer counts first and check the Log window.
   - **Zero events in both arms**: by usual meta-analysis practice, the study is generally left out of the relative effect estimate.
   - Note: MetaInsight's built-in binary example file `MetaInsight_binary_long.csv` still contains one record with `R=0`. After uploading, always double-check the results and the Log window.
5. **Want to compare with the official template?** Go to `Setup` → `Load data`, choose the outcome type and format, then click `Download example data` at the bottom left to get the matching official example CSV. There are four: continuous long/wide and binary long/wide.

## Step-by-step upload and setup

### Step 1: Open the home page and go to Setup

1. Open [https://crsu-metainsight.le.ac.uk/MetaInsight/](https://crsu-metainsight.le.ac.uk/MetaInsight/) in your browser (check that the address ends with `/`).
2. If a GDPR privacy pop-up appears the first time, click `Accept`.
3. Click `Setup` in the top navigation bar.

![MetaInsight v7.1.1 home page, with red boxes around the version number and the Setup tab at the top](/images/blog/metainsight-upload-tutorial/01-home.png)
*The WORKFLOW panel on the left shows the current version, v7.1.1. Click Setup at the top to start importing data.*

### Step 2: Choose the outcome type and format in Load data

After you open `Setup`, the left panel starts on `Load data`.

1. `Select outcome type`: choose `Binary (e.g. Odds Ratio)`. For mean/SD data, choose `Continuous`.
2. `Select data format`: choose `Long` or `Wide`.
3. Check the `Guidance` tab on the right: it shows which columns you need for the options you picked. Take a quick look before uploading to make sure your header is right.

![The Load data page under Setup, with red boxes around the outcome type, format options, file select button and Guidance tab](/images/blog/metainsight-upload-tutorial/02-load-data-options.png)
*After choosing Binary and Long, the Guidance tab on the right lists the required column names.*

### Step 3: Select the file, then click Load data

1. Click `Select` on the left and choose the CSV (or `.xlsx`) you just saved.
2. Wait until the progress bar turns red and shows `Upload complete`.
3. **Then click the blue `Load data` button below.** Many people pick the file and move on, but the data has not been loaded yet.

![After uploading the long format CSV and clicking Load data, the Log window at top right shows a successful upload and the Results panel shows 11 rows of long format data](/images/blog/metainsight-upload-tutorial/03-upload-long-table.png)
*The Log window at top right should show a green tick with "Data has been uploaded successfully", and the table in the middle should list all 5 studies, 11 treatment arms and `covar.age`.*

If you are using wide format (such as `metainsight-example-wide.csv` above):

1. First switch the format on the left to `Wide`.
2. Select the file again, then click `Load data`.
3. The `Results` panel in the middle shows 5 rows. `Chen_2021` should have `T.3`, `R.3` and `N.3` filled in, and the other 4 two-arm studies should be blank there.

![After switching to Wide and uploading the wide format CSV, the Results table shows 5 studies and the .3 columns of the three-arm trial](/images/blog/metainsight-upload-tutorial/04-upload-wide-table.png)
*In wide format, one row is one study. Check that the third arm of the three-arm trial `Chen_2021` has not slipped into another column.*

### Step 4: Set the reference treatment and effect direction in Configure analysis

Once the data looks right, click `Configure analysis` in the left navigation panel:

1. `Select reference treatment`: pick the reference treatment from the drop-down. The system usually picks a common reference name such as `Placebo` automatically.
2. `Outcome for binary data`: choose `Odds Ratio (OR)`, `Risk Ratio (RR)` or `Risk Difference (RD)`. For continuous outcomes, choose `MD` or `SMD`.
3. `For treatment rankings, ORs less than 1 are:`: **this is the easiest setting to get backwards.**
   - The default is `Desirable`, which suits "fewer is better" outcomes such as adverse events or mortality.
   - In this example the outcome is "number of patients with effective pain relief", so OR > 1 means a better effect. Change it to `Undesirable`, or the ranking will be upside down.
4. When you are done, click the `Configure analysis` button at the bottom.

![The Configure analysis panel, with red boxes around the reference treatment, the ranking direction setting and the Configure analysis button](/images/blog/metainsight-upload-tutorial/05-configure-analysis.png)
*The screenshot shows the default state (`Desirable`) upon opening the page. Because this example uses pain relief response, remember to switch it to `Undesirable` before clicking the button below.*

## How to check that your data was read correctly

After `Configure analysis`, check two places before starting the real analysis:

1. **Check the data table and row count**: in the `Results` tab of `Load data`, set the number of rows shown to `25` (or page through). Check that:
   - the number of studies and the total number of arms are correct;
   - no rows are missing from three-arm trials, and there are no extra blank rows;
   - covariates starting with `covar.` have the same value in every arm of the same study.
2. **Check the Summary and the network plot**:
   - Click `Summary` → `Data characteristics` in the top navigation bar to review the summary tables and confirm the number of studies and treatments.
   - Then go to `Summary` → `Network plot` and make sure all treatment nodes form one connected network. If the capitalisation is wrong (for example `Placebo` and `placebo`), the same treatment will be split into two disconnected nodes.

Once everything checks out, choose a tab at the top to start the analysis:

- `Frequentist`: forest plots, league table and inconsistency tests.
- `Bayesian`: MCMC simulation, SUCRA rankings and node-splitting.
- `Covariate`: if you uploaded `covar.<name>` columns, run meta-regression here.
- `Export`: if you included `rob` and `indirectness` columns, export your data here (e.g. `.json` for conversion via `cinemar` into CINeMA).

## Troubleshooting

| Problem | Common cause | Fix |
| --- | --- | --- |
| The site shows `404 Page not found` | The trailing slash `/` is missing from the address | Use the full address [https://crsu-metainsight.le.ac.uk/MetaInsight/](https://crsu-metainsight.le.ac.uk/MetaInsight/) |
| The Log window shows a treatment name error after upload | Treatment names contain spaces, non-English characters, hyphens `-` or other symbols | In Excel, change every `T` value to letters, numbers and `_` only (e.g. `Oral_NSAID`) |
| Error message about duplicate treatment arms | Two rows in the same study have the same `T` name | Name them by dose (e.g. `Drug_Low`, `Drug_High`), or merge the data for those arms first |
| Columns not found, or covariates not read | Wrong capitalisation in column names (e.g. `study`, `mean`), or missing `covar.` prefix | Fix the header to match the column reference exactly: `Study`, `T`, `R`, `N`, `Mean`, `SD`, `covar.age` |
| Can't analyse after loading, or only see the default data | Forgot to click the blue `Load data` button after selecting the file | Wait for the red progress bar to show `Upload complete`, then click `Load data` |
| Error for trials with more than 6 arms | MetaInsight currently allows at most 6 arms per trial | Make sure no study has more than 6 arms, or merge similar dose groups based on clinical definitions |
| Spinning wheel that never stops after clicking `Configure analysis` | The v7.1.1 online server occasionally drops its SockJS connection, or the back end is busy | Refresh the page and try again, or temporarily use the old version announced on the site, [https://crsu.shinyapps.io/MetaInsight_V6/](https://crsu.shinyapps.io/MetaInsight_V6/) |

## Further reading and choosing a tool

If you want to **compare two outcomes from the same dataset at once (for example efficacy and side effects) and colour the results interactively**, read Part 2: [NMAstudio 2.0 Data Upload Tutorial: From Excel to Interactive NMA](/en/blog/nmastudio-upload-tutorial/). To rate **GRADE-based confidence in the evidence**, read Part 3: [CINeMA 3.0.1 Upload Tutorial: Rating NMA Evidence Confidence (GRADE)](/en/blog/cinema-upload-tutorial/).

In short: **MetaInsight excels at built-in Bayesian MCMC models and covariate meta-regression; NMAstudio 2.0 excels at multi-outcome side-by-side comparisons and visual transitivity checks; CINeMA 3.0.1 handles the six-domain certainty-of-evidence assessment.**

## References

1. Owen RK, Bradbury N, Xin Y, Cooper N, Sutton A. MetaInsight: An interactive web-based tool for analyzing, interrogating, and visualizing network meta-analyses using R-shiny and netmeta. *Research Synthesis Methods*. 2019;10(4):569–581. DOI: [10.1002/jrsm.1373](https://doi.org/10.1002/jrsm.1373) ([PMC6973101](https://pmc.ncbi.nlm.nih.gov/articles/PMC6973101/))
2. MetaInsight official web app (v7.1.1): [https://crsu-metainsight.le.ac.uk/MetaInsight/](https://crsu-metainsight.le.ac.uk/MetaInsight/) (the official example files can be downloaded from `Setup` → `Load data` by clicking `Download example data`)
3. MetaInsight v6 temporary backup site (transition link announced on the official site): [https://crsu.shinyapps.io/MetaInsight_V6/](https://crsu.shinyapps.io/MetaInsight_V6/)
