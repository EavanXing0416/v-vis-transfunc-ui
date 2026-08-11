# V-VIS Transformation UI

GitHub Pages deployable frontend prototype for dataset search, transformation-function configuration, and README-based transformation record generation in the V-VIS data virtualization workflow.

## Repository Overview

This project models a two-level UI workflow for a data virtualization service.

1. `Level 1 UI`: search, scan, preview, rename, and select datasets.
2. `Level 2 UI`: open a dedicated transformation-function page, configure parameters, review outputs, and commit the transformation record.

The current prototype is intentionally backend-free. It does not yet call the real service. Instead, each transformation page generates downloadable `README` files that act as human-readable internal records for future service integration.

## Current Transformation Functions

The repository currently provides second-level UI pages for these transformation functions:

- `Select`
- `Partition`
- `Merge`
- `Blend`
- `STFT`
- `FeaExSpectrogram`
- `GenImage`
- `SimulatePDE`
- `SampleField`

## General UI Workflow

### Level 1: Dataset Search Page

The search page is the entry point for all workflows.

Main actions:

- Search datasets by keyword.
- Select one or more datasets from the results table.
- Edit dataset names directly in the `Name` column.
- Change dataset `Type` between `virtual` and `physical`.
- Use `Select all results` for the current filtered result set.
- Open the dataset README preview with the info icon.
- Launch a valid transformation page from the right-side transformation panel.

Transformation availability rules:

- `Select`: requires exactly 1 selected dataset.
- `Partition`: requires at least 1 selected dataset.
- `Merge`: requires at least 1 selected dataset.
- `Blend`: requires at least 2 selected datasets.
- `STFT`: requires exactly 1 selected dataset with data object type `Audio`.
- `FeaExSpectrogram`: requires exactly 1 selected dataset with data object type `STFT`.
- `GenImage`: requires exactly 1 selected dataset with data object type `ImageGenConfig`.
- `SimulatePDE`: requires selected dataset(s) with data object type `PDESymbolicSpec`.
- `SampleField`: requires selected dataset(s) with data object type `Field`.

### Level 2: Transformation Editing Pages

All transformation pages follow the same high-level layout:

- `Input Datasets`: the selected upstream datasets.
- `Parameters`: transformation-specific controls.
- `Output Dataset(s)`: editable output names and output type selection.
- `Comments`: free-form user comment.
- `Review`: a compact summary of the current configuration.
- `Commit`: generates README file(s) for the resulting dataset(s).

Shared behavior:

- `Commit` does not call a live backend service.
- `Commit` generates readable README records only.
- `Back to search` returns to the first-level page.
- `Inspect Dataset` buttons are placeholders for future dataset inspection support.

## How To Use Each Transformation UI

### 1. Select

Purpose:
Create a subset from a single dataset by selecting data objects, internal columns, or label-based groups.

Input requirement:

- Exactly 1 selected dataset.

How to use:

- Open `Select` from the search page.
- In `Selection Builder`, choose the selection basis.
- Current logic supports two main directions:
  - selection by data-object labels
  - selection by tabular internal columns
- For label-based selection:
  - choose a `Label heading`
  - choose a selection mode
    - `Select label values`
    - `Select by proportion`
- If using `Select label values`:
  - choose the label rule
  - tick the label values to include or exclude
- If using `Select by proportion`:
  - enter a random proportion such as `0.8`
  - enter a random seed
  - the UI selects label groups first, then includes all data objects covered by those labels
- For column-based selection:
  - choose internal columns directly
  - optionally enable advanced filtering to select based on values inside the data object
- Click `Add to operation` to append a step.
- Build multi-step logic with `AND` or `OR`.
- Edit the output dataset name and output type.
- Add a user comment and commit.

Typical use cases:

- WindFarm: keep selected event labels or selected event-file columns.
- Speech: select a random proportion of `speaker_id` groups so no speaker appears across conflicting subsets.

Commit result:

- Downloads 1 README file for the selected output dataset.

### 2. Partition

Purpose:
Split one or more datasets into train, validation, and test outputs.

Input requirement:

- One or more selected datasets.

How to use:

- Open `Partition` from the search page.
- Review the input datasets table.
- Choose the partition method:
  - `random`
  - `chunk`
- Enter train, validation, and test ratios.
- For `random`, enter a random seed.
- Ratios must sum to `1`.
- If one ratio is `0`, that output dataset is omitted.
- Review the output dataset rows generated below the parameter area.
- Rename outputs if needed.
- Set each output dataset type to `virtual` or `physical`.
- Add a user comment and commit.

Notes:

- The page follows the train / validation / test design used throughout this prototype.
- If multiple parent datasets are selected, the same partition configuration is applied to each parent dataset.
- Each parent dataset produces its own derived outputs.

Commit result:

- Downloads 2 or 3 README files per input dataset depending on which ratios are non-zero.

### 3. Merge

Purpose:
Either merge compatible selected datasets into one output dataset, or use the `AddLabel` workflow to attach labels.

Input requirement:

- Standard merge usually uses 2 or more selected datasets.
- A single selected dataset is also allowed because the page supports duplicated-label `AddLabel` behavior.

How to use:

- Open `Merge` from the search page.
- In `Operation`, choose:
  - `Merge selected data objects`
  - `Add labels from selected datasets`

Standard merge flow:

- Choose the `Order mode`:
  - `Attach`
  - `Reshuffle`
- If `Reshuffle` is used, provide a random seed.
- If the selected datasets are tabular, choose `Schema handling`:
  - `Keep all columns`
  - `Keep common columns`
  - `Reference schema + NA fill`
- If `Reference schema + NA fill` is chosen, choose the reference dataset.
- Edit the output dataset name and output type.
- Add comments and commit.

AddLabel flow:

- Choose the `Primary dataset`.
- In `Label sources`, either:
  - duplicate the primary dataset, or
  - select one or more additional datasets as label sources
- For each selected label source, provide a `Label heading`.
- Association currently uses record-order alignment.
- Edit the output dataset name and output type.
- Add comments and commit.

Typical use cases:

- WindFarm: merge multiple farms and keep either common columns or a larger merged schema.
- Speech: duplicate clean audio as its own label target before later blending.
- Shape workflow: merge compatible generated image datasets into one classification dataset.

Commit result:

- Downloads 1 README file.
- `Generated by` is written as `Merge` or `AddLabel` depending on the chosen operation.

### 4. Blend

Purpose:
Blend a primary dataset with one auxiliary dataset, mainly for speech-style noisy-data generation.

Input requirement:

- At least 2 selected datasets.

How to use:

- Open `Blend` from the search page.
- Choose the `Primary dataset`.
- Choose one `Auxiliary dataset`.
- Configure the blend parameters:
  - `Auxiliary fraction`
  - `Selection rule`
  - `Subset seed`
  - `Assignment rule`
  - `Assignment seed`
  - `Scaling rule`
  - `Target SNR`
  - `Merge rule`
- Review the derived metadata summary.
- Edit the output dataset name and output type.
- Add comments and commit.

Notes:

- The current UI supports one auxiliary dataset at a time.
- Existing labels are preserved and carried into the blended output.
- This is primarily designed for waveform-level speech enhancement style workflows.

Commit result:

- Downloads 1 README file.

### 5. STFT

Purpose:
Convert waveform datasets into STFT representations.

Input requirement:

- Exactly 1 selected dataset.
- The selected dataset must have data object type `Audio`.

How to use:

- Open `STFT` from the search page.
- Set the STFT parameters:
  - `Sample rate`
  - `FFT size`
  - `Window length`
  - `Hop length`
  - `Window type`
- Confirm the output representation, which is fixed as `STFT`.
- Choose whether STFT should also be applied to labels.
- Edit the output dataset name and output type.
- Add comments and commit.

Design note:

- The page no longer asks the user to choose a stored component here.
- Component-level feature selection is deferred to `FeaExSpectrogram`.

Commit result:

- Downloads 1 README file.

### 6. FeaExSpectrogram

Purpose:
Create a model-facing feature view from an STFT dataset.

Input requirement:

- Exactly 1 selected dataset.
- The selected dataset must have data object type `STFT`.

How to use:

- Open `FeaExSpectrogram` from the search page.
- Choose `Selected components` from the dropdown.
- The available options are derived from the input dataset metadata.
- Optionally enable `Advanced extraction`.
- If advanced extraction is enabled, enter a free-text extraction instruction.
- Choose whether label associations should be preserved.
- Edit the output dataset name and output type.
- Add comments and commit.

Design note:

- This page is intended to expose model-facing components or derived feature views from the STFT representation.
- Advanced extraction is available as a lightweight placeholder for task-specific feature logic.

Commit result:

- Downloads 1 README file.

### 7. GenImage

Purpose:
Generate controlled image datasets from configuration-style upstream datasets.

Input requirement:

- Exactly 1 selected dataset.
- The selected dataset must have data object type `ImageGenConfig`.

How to use:

- Open `GenImage` from the search page.
- Review the input configuration dataset.
- In `Variable configuration`, configure each variable row separately.
- Supported variables are:
  - `shape`
  - `scale`
  - `size`
  - `pos_x`
  - `pos_y`
  - `rotation`
  - `grey`
- For each variable, choose `Mode`:
  - `changed`
  - `fixed`
- If a variable is `changed`:
  - `shape` uses multiple checkboxes for shape values
  - numeric variables use `Min`, `Max`, and `Levels`
- If a variable is `fixed`:
  - `shape` uses a single dropdown choice
  - numeric variables use `Fixed value` and `Levels`
- Set the global generation parameters:
  - `Number of images`
  - `Image width (px)`
  - `Image height (px)`
  - `Random seed`
  - `Output format`
  - `Sampling rule`
- Edit the output dataset name and output type.
- Add comments and commit.

Design note:

- This page explicitly separates changed variables and fixed variables because that distinction is essential for controlled image-generation experiments.
- The form defaults are derived from the input dataset README metadata.

Commit result:

- Downloads 1 README file.

### 8. SimulatePDE

Purpose:
Simulate PDE-based fields from symbolic PDE specifications.

Input requirement:

- Selected dataset(s) must have data object type `PDESymbolicSpec`.

How to use:

- Open `SimulatePDE` from the search page.
- Configure:
  - `Solver method`
  - `Equation type`
  - `Boundary condition`
- Choose the spatial dimension:
  - `1D`
  - `2D`
- Choose whether temporal dimension is enabled.
- Set domain ranges and step sizes for:
  - `x`
  - `y` if using `2D`
  - `t` if temporal dimension is enabled
- Edit the output dataset name and output type.
- Add comments and commit.

Notes:

- The output is a `Field` dataset.
- Output metadata is derived from the chosen spatial and temporal configuration.

Commit result:

- Downloads 1 README file per selected input dataset.

### 9. SampleField

Purpose:
Sample field datasets into downstream sampled outputs.

Input requirement:

- Selected dataset(s) must have data object type `Field`.

How to use:

- Open `SampleField` from the search page.
- Configure:
  - `Random seed`
  - `Number of data objects`
  - `Number of samples per object`
- Edit the output dataset name and output type.
- Add comments and commit.

Notes:

- This page is intended for field-style outputs generated earlier in the PDE workflow.
- Output metadata inherits the input field description and appends sampling information.

Commit result:

- Downloads 1 README file per selected input dataset.

## README-Based Record System

At the current prototype stage, `Commit` generates README files instead of calling the real service.

These README files serve three roles:

- human-readable transformation records
- placeholders for future backend integration
- metadata sources for the mocked dataset preview system

Current conventions:

- each derived dataset receives its own README file
- generated README files include a timestamp
- transformation parameters are written in readable form instead of raw JSON
- README content is reused by the UI as a metadata source where applicable
- select-oriented datasets include a `Select metadata` block so downstream selection UIs can reuse label headings and tabular column names

### Generated README Structure

A TF page commit typically produces one README per output dataset. The structure is standardized so the files are both readable by users and reusable by the UI.

Typical structure:

```md
# <Dataset Name> README

## Metadata
- Timestamp: <commit time>
- Dataset name: <output dataset name>
- Type: <Virtual or Physical>
- Data object type: <object type>
- No. of data objects: <count>
- Metadata: <human-readable metadata summary>
- Generated by: <TF name>
- Parameters:
  - Input datasets: <input dataset names>
  - <TF-specific parameter 1>: <value>
  - <TF-specific parameter 2>: <value>

## Select metadata
- Label headings: <available headings or NA>
- Label values: <available values or NA>
- Variable headings: <available tabular column names or NA>

## User comments
<free-text user comment or n.a.>
```

Notes:

- original source datasets may omit `Generated by` and TF parameter blocks
- derived datasets always include the transformation name and parameter summary
- multi-output transformations such as `Partition` generate multiple README files in one commit
- some TFs inherit metadata from the input dataset and append new transformation-specific details

## Mock Dataset System

This repository uses local mocked dataset folders under `mock-datasets-local/`.

Each dataset folder contains a README file that acts as the metadata source for the UI.

This lets the prototype:

- preview dataset metadata through the info icon
- preload form defaults from existing dataset metadata
- expose labels, object types, and column names without a live backend
- simulate dataset-rich workflows across multiple application domains

## Project Structure

```text
src/
  components/
    datasets/
    layout/
    tables/
  features/
    blend/
    datasets/
    feaexspectrogram/
    genimage/
    merge/
    partition/
    samplefield/
    select/
    simulatepde/
    stft/
    transformations/
  mocks/
  pages/
    blend/
    feaexspectrogram/
    genimage/
    merge/
    partition/
    samplefield/
    search/
    select/
    simulatepde/
    stft/
  services/
mock-datasets-local/
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev -- --host 0.0.0.0
```

Open:

```text
http://localhost:5173/
```

## Production Build

```bash
npm run build
```

## GitHub Pages Deployment

This repository is configured for GitHub Pages deployment through GitHub Actions.

Relevant workflow:

- `.github/workflows/deploy.yml`

The app uses hash-based routing so second-level transformation pages work correctly after deployment.

