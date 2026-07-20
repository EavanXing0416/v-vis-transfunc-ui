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
    description: 'Split selected datasets into train, validation, and test outputs.',
    enabled: true,
    action: routes.partition,
  },
  {
    name: 'Merge & Select',
    description: 'Combine multiple datasets and define shared feature selection rules.',
    enabled: false,
  },
  {
    name: 'Filter',
    description: 'Apply row-level constraints or keep targeted event windows.',
    enabled: false,
  },
  {
    name: 'Sample',
    description: 'Create smaller representative subsets for faster experiments.',
    enabled: false,
  },
  {
    name: 'Normalize',
    description: 'Prepare aligned scales and standard preprocessing defaults.',
    enabled: false,
  },
  {
    name: 'Annotate',
    description: 'Attach derived labels or metadata fields to the selected inputs.',
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

            <div className="field" style={{ marginBottom: '14px' }}>
              <label htmlFor="dataset-search">Search datasets</label>
              <input
                id="dataset-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by dataset ID, name, source, or metadata"
                value={query}
              />
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
