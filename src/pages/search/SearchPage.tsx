import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { CompactDatasetTable } from '../../components/tables/CompactDatasetTable';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { summarizeDatasetSelection } from '../../features/datasets/datasetSummary';
import { routes } from '../../lib/routes';
import { loadDatasets } from '../../services/searchService';

export function SearchPage() {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    void loadDatasets().then(setDatasets);
  }, []);

  const filteredDatasets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return datasets;
    }

    return datasets.filter((dataset) =>
      [dataset.id, dataset.name, dataset.source, dataset.metadataSummary, dataset.modality]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [datasets, query]);

  const selectedDatasets = useMemo(
    () => datasets.filter((dataset) => selectedIds.includes(dataset.id)),
    [datasets, selectedIds],
  );

  const summary = summarizeDatasetSelection(selectedDatasets);

  function handleToggle(datasetId: string) {
    setSelectedIds((current) =>
      current.includes(datasetId)
        ? current.filter((id) => id !== datasetId)
        : [...current, datasetId],
    );
  }

  function handlePartition() {
    navigate(routes.partition, {
      state: {
        selectedDatasets,
      },
    });
  }

  return (
    <main className="app-shell">
      <PageHeader
        eyebrow="Level 1 UI"
        title="Dataset Searching Engine"
        description="Search, scan, and select large batches of datasets before opening a transformation-specific editing page."
        meta={
          <div className="stack">
            <strong>{filteredDatasets.length} datasets in current results</strong>
            <span className="muted">
              Keep this page dense and scan-friendly. Transformation editing happens in the next page.
            </span>
          </div>
        }
      />

      <section className="grid grid--search">
        <div className="panel">
          <div className="panel__section">
            <div className="section-title">
              <h2>Search Results</h2>
              <span className="muted">Compact table layout for high-volume discovery</span>
            </div>

            <div className="field" style={{ marginBottom: '16px' }}>
              <label htmlFor="dataset-search">Search datasets</label>
              <input
                id="dataset-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by dataset ID, name, source, or metadata"
                value={query}
              />
            </div>

            <CompactDatasetTable
              datasets={filteredDatasets}
              onToggle={handleToggle}
              selectable
              selectedIds={selectedIds}
            />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section">
            <div className="section-title">
              <h2>Selection Summary</h2>
            </div>
            <dl className="summary-list">
              <div className="summary-list__row">
                <dt>Selected datasets</dt>
                <dd>{summary.total}</dd>
              </div>
              <div className="summary-list__row">
                <dt>Physical</dt>
                <dd>{summary.physicalCount}</dd>
              </div>
              <div className="summary-list__row">
                <dt>Virtual</dt>
                <dd>{summary.virtualCount}</dd>
              </div>
              <div className="summary-list__row">
                <dt>Preview</dt>
                <dd>{summary.previewNames.length ? summary.previewNames.join(', ') : 'No selection yet'}</dd>
              </div>
            </dl>
          </div>

          <div className="panel__section">
            <div className="section-title">
              <h3>Transformation Functions</h3>
            </div>
            <p className="muted">
              Clicking one of these buttons opens a separate editing page that inherits the currently selected input datasets.
            </p>
            <div className="action-row">
              <button
                className="button button--primary"
                disabled={selectedDatasets.length === 0}
                onClick={handlePartition}
                type="button"
              >
                Partition
              </button>
              <button className="button button--secondary" disabled type="button">
                Merge &amp; Select
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
