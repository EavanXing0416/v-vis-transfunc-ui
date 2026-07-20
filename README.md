# V-VIS Transformation UI

A two-page prototype for V-VIS dataset search and transformation function editing.

## Overview

This project is a frontend prototype for a data virtualization workflow.

It currently models two connected UI levels:

1. A dataset search page for browsing and selecting input datasets.
2. A transformation editing page for configuring a specific transformation function.

The current implemented transformation function is `Partition`.

Users do not need to inspect raw JSON in the UI. When they click `Commit Transformation`, the app generates an internal JSON record and downloads it for later integration with the real V-VIS service.

## Current Prototype Scope

Implemented now:

- Level 1 dataset search page
- Dense dataset results table with multi-select
- Transformation function panel
- Level 2 partition configuration page
- Input dataset summary and expandable dataset list
- Partition parameter editing
- Transformation comments
- Internal JSON record generation and download
- GitHub Pages deployment workflow

Planned next:

- More transformation editing pages such as `Merge & Select`
- Richer search filters and result interactions
- Integration with the real V-VIS service
- Better transformation status tracking and derived dataset handling

## Project Structure

```text
src/
  app/
    router.tsx
    styles/
  components/
    layout/
    tables/
  features/
    datasets/
    partition/
    transformations/
  mocks/
  pages/
    search/
    partition/
  services/
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev -- --host 0.0.0.0
```

Open the local site at:

```text
http://localhost:5173/
```

## Production Build

```bash
npm run build
```

## GitHub Pages

This repository is configured to deploy with GitHub Actions.

Workflow file:

- `.github/workflows/deploy.yml`

The app uses hash-based routing so the secondary page works correctly on GitHub Pages.

## Notes for UI Design

Current design direction:

- Keep the interface clean and compact
- Avoid oversized rounded corners
- Keep the search results dense and scan-friendly
- Treat transformation editing as a separate second page
- Show input datasets clearly without exposing raw system JSON in the main UI
