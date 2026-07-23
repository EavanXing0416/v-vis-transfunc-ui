import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { CompactDatasetTable } from '../../components/tables/CompactDatasetTable';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { summarizeDatasetSelection } from '../../features/datasets/datasetSummary';
import { routes } from '../../lib/routes';
import { loadDatasets } from '../../services/searchService';

const transformationFunctions = [
  {
    name: 'Partition',
    description: 'Create train, validation, and test splits.',
    enabled: true,
    action: routes.partition,
  },
  {
    name: 'Merge',
    description: 'Combine similar datasets into one merged dataset.',
    enabled: false,
  },
  {
    name: 'Integration',
    description: 'Fuse heterogeneous datasets into one integrated dataset.',
    enabled: false,
  },
  {
    name: 'Selection',
    description: 'Select variables or labels for focused downstream datasets.',
    enabled: false,
  },
  {
    name: 'Normalization',
    description: 'Convert data into a model-ready normalized format.',
    enabled: false,
  },
  {
    name: 'Reorganization',
    description: 'Restructure data for a target machine learning method.',
    enabled: false,
  },
  {
    name: 'Feature Extraction',
    description: 'Transform raw data into feature representations.',
    enabled: false,
  },
];

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
      [dataset.id, dataset.name, dataset.type, dataset.source, dataset.metadataSummary, dataset.modality]
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
  const allFilteredSelected = filteredDatasets.length > 0 && filteredDatasets.every((dataset) => selectedIds.includes(dataset.id));

  function handleToggle(datasetId: string) {
    setSelectedIds((current) =>
      current.includes(datasetId)
        ? current.filter((id) => id !== datasetId)
        : [...current, datasetId],
    );
  }

  function handleSelectAllResults() {
    setSelectedIds((current) => Array.from(new Set([...current, ...filteredDatasets.map((dataset) => dataset.id)])));
  }

  function handleClearSelection() {
    setSelectedIds([]);
  }

  function handlePartition() {
    navigate(routes.partition, {
      state: {
        selectedDatasets,
      },
    });
  }

  function handleTransformationClick(route?: string) {
    if (route === routes.partition) {
      handlePartition();
    }
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="Dataset Search"
        description="Search, scan, and select input datasets before opening a transformation editing page."
        meta={
          <div className="search-meta">
            <strong>{filteredDatasets.length}</strong>
            <span className="muted">datasets in current results</span>
          </div>
        }
      />

      <section className="grid grid--search">
        <div className="panel">
          <div className="panel__section">
            <div className="section-title">
              <h2>Search Results</h2>
              <span className="muted">Showing up to 20 visible rows</span>
            </div>

            <div className="field" style={{ marginBottom: '10px' }}>
              <label htmlFor="dataset-search">Search datasets</label>
              <input
                id="dataset-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by dataset ID, name, type, source, or metadata"
                value={query}
              />
            </div>

            <div className="action-row" style={{ marginBottom: '10px' }}>
              <button
                className="button button--secondary"
                disabled={filteredDatasets.length === 0 || allFilteredSelected}
                onClick={handleSelectAllResults}
                type="button"
              >
                Select all results
              </button>
              <button
                className="button button--secondary"
                disabled={selectedIds.length === 0}
                onClick={handleClearSelection}
                type="button"
              >
                Clear selection
              </button>
            </div>

            <CompactDatasetTable
              compact
              datasets={filteredDatasets}
              maxHeightClassName="dataset-table-wrap--capped"
              onToggle={handleToggle}
              selectable
              selectedIds={selectedIds}
            />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Selection Summary</h2>
            </div>
            <dl className="summary-list summary-list--compact">
              <div className="summary-list__row">
                <dt>Selected</dt>
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
            <div className="function-grid">
              {transformationFunctions.map((item) => (
                <button
                  key={item.name}
                  className={`function-card ${item.enabled ? 'button button--secondary' : 'button button--secondary'}`}
                  disabled={!item.enabled || selectedDatasets.length === 0}
                  onClick={() => handleTransformationClick(item.action)}
                  type="button"
                >
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
