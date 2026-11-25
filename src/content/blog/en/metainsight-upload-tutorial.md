---
title: 'Uploading Data to MetaInsight: From Excel to Network Meta-Analysis'
description: A step-by-step guide to preparing long or wide format data and uploading it to MetaInsight (v7.1.1), with example CSVs you can copy, Excel tips and fixes for common errors.
pubDate: 2026-11-25
category: notes
tags: [Evidence-based medicine, Network meta-analysis, Research methods]
draft: false
---

If you already run conventional pairwise meta-analyses in RevMan or R, the hardest part of your first network meta-analysis (NMA) is usually not the statistical model. It is the upload that keeps throwing errors.

This post uses **MetaInsight**, one of the most widely used NMA tools among clinicians and graduate students in Taiwan, and follows the v7.1.1 interface updated in June 2026.

The address is `https://crsu-metainsight.le.ac.uk/MetaInsight/`. **The trailing slash `/` is required.** Without it you get a 404.

This post covers three things only: preparing your data in Excel, saving it as CSV, and checking that it was read correctly after upload. Interpreting the plots will be a separate post.

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

> **Version note:** The main MetaInsight site is now v7.1.1 (updated 2026-06-17). It looks different from the v5/v6 screenshots in many older tutorials online. The old version is temporarily kept at `https://crsu.shinyapps.io/MetaInsight_V6/`. Follow the v7.1.1 interface.

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
| Continuous, long (one row per arm) | `Study, T, N, Mean, SD` | First choice for continuous outcomes |
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
4. **Handling zero events**: in the Binary Long guidance, the site warns: `N.B. Continuity corrections will need to be applied to cells containing 0 values`. In other words, cells with 0 need a continuity correction first.
   - If only one arm has `0` events: apply the standard `0.5` correction in Excel before uploading. **Add `0.5` to `R` and `1` to `N` in every arm of that study.**
   - If both arms have `0` events: by usual meta-analysis practice, the study is generally left out of the relative effect estimate.
   - Note: MetaInsight's built-in binary example file `MetaInsight_binary_long.csv` still contains one record with `R=0`. After uploading, always double-check the results and the Log window.
5. **Want to compare with the official template?** Go to `Setup` → `Load data`, choose the outcome type and format, then click `Download example data` at the bottom left to get the matching official example CSV. There are four: continuous long/wide and binary long/wide.

## Step-by-step upload and setup

### Step 1: Open the home page and go to Setup

1. Open `https://crsu-metainsight.le.ac.uk/MetaInsight/` in your browser (check that the address ends with `/`).
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
*Based on the clinical meaning of your outcome, decide whether OR < 1 is Desirable or Undesirable, then click the button below.*

## How to check that your data was read correctly

After `Configure analysis`, check two places before starting the real analysis:

1. **Check the data table and row count**: in the `Results` tab of `Load data`, set the number of rows shown to `25` (or page through). Check that:
   - the number of studies and the total number of arms are correct;
   - no rows are missing from three-arm trials, and there are no extra blank rows;
   - covariates starting with `covar.` have the same value in every arm of the same study.
2. **Check the Summary and the network plot**:
   - Click `Summary` → `Characterise the data` → `Generate tables` at the top and check the number of studies and treatments.
   - Then go to `Summary` → `Network plots` → `Generate plots` and make sure all treatment nodes form one connected network. If the capitalisation is wrong (for example `Placebo` and `placebo`), the same treatment will be split into two disconnected nodes.

<!-- Screenshot to be added: Summary -> Characterise the data summary table and Summary -> Network plots network plot (during testing, the v7.1.1 online server stayed on "Configuring analysis..." after clicking Configure analysis and returned a configured_data error) -->

Once everything checks out, choose a tab at the top to start the analysis:

- `Frequentist`: forest plots, league table and inconsistency tests.
- `Bayesian`: MCMC simulation, SUCRA rankings and node-splitting.
- `Covariate`: if you uploaded `covar.<name>` columns, run meta-regression here.

## Troubleshooting

| Problem | Common cause | Fix |
| --- | --- | --- |
| The site shows `404 Page not found` | The trailing slash `/` is missing from the address | Use the full address `https://crsu-metainsight.le.ac.uk/MetaInsight/` |
| The Log window shows a treatment name error after upload | Treatment names contain spaces, non-English characters, hyphens `-` or other symbols | In Excel, change every `T` value to letters, numbers and `_` only (e.g. `Oral_NSAID`) |
| Error message about duplicate treatment arms | Two rows in the same study have the same `T` name | Name them by dose (e.g. `Drug_Low`, `Drug_High`), or merge the data for those arms first |
| Columns not found, or covariates not read | Wrong capitalisation in column names (e.g. `study`, `mean`), or missing `covar.` prefix | Fix the header to match the column reference exactly: `Study`, `T`, `R`, `N`, `Mean`, `SD`, `covar.age` |
| Can't analyse after loading, or only see the default data | Forgot to click the blue `Load data` button after selecting the file | Wait for the red progress bar to show `Upload complete`, then click `Load data` |
| Error for trials with more than 6 arms | MetaInsight currently allows at most 6 arms per trial | Make sure no study has more than 6 arms, or merge similar dose groups based on clinical definitions |
| Spinning wheel that never stops after clicking `Configure analysis` | The v7.1.1 online server occasionally drops its SockJS connection, or the back end is busy | Refresh the page and try again, or temporarily use the old version announced on the site, `https://crsu.shinyapps.io/MetaInsight_V6/` |

## Further reading and choosing a tool

If you want to **compare two outcomes from the same dataset at once (for example efficacy and side effects) and colour the results by CINeMA confidence ratings**, read the next post: [Uploading Data to NMAstudio: From Excel to an Interactive Network Meta-Analysis](/en/blog/nmastudio-upload-tutorial/).

In short: **MetaInsight's strengths are its built-in Bayesian MCMC models and covariate meta-regression; NMAstudio 2.0 is better at showing several outcomes side by side and integrating CINeMA.**

## References

1. Owen RK, Bradbury N, Xin Y, Cooper N, Sutton A. MetaInsight: An interactive web-based tool for analyzing, interrogating, and visualizing network meta-analyses using R-shiny and netmeta. *Research Synthesis Methods*. 2019;10(4):569–581. DOI: [10.1002/jrsm.1373](https://doi.org/10.1002/jrsm.1373) ([PMC6973101](https://pmc.ncbi.nlm.nih.gov/articles/PMC6973101/))
2. MetaInsight official web app (v7.1.1): [https://crsu-metainsight.le.ac.uk/MetaInsight/](https://crsu-metainsight.le.ac.uk/MetaInsight/) (the official example files can be downloaded from `Setup` → `Load data` by clicking `Download example data`)
3. MetaInsight v6 temporary backup site (transition link announced on the official site): [https://crsu.shinyapps.io/MetaInsight_V6/](https://crsu.shinyapps.io/MetaInsight_V6/)
