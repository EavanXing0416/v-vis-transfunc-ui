import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { CompactDatasetTable } from '../../components/tables/CompactDatasetTable';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { summarizeDatasetSelection } from '../../features/datasets/datasetSummary';
import { routes } from '../../lib/routes';
import { getDatasetDataObjectType } from '../../features/datasets/dataObjectType';
import { loadDatasets } from '../../services/searchService';

interface TransformationFunctionCard {
  name: string;
  description: string;
  enabled: boolean;
  action?: string;
  requiresSingleSelection?: boolean;
  minimumSelection?: number;
  requiredDataObjectTypes?: string[];
}

const transformationFunctions: TransformationFunctionCard[] = [
  {
    name: 'CropTS',
    description: 'Detect the flat-top interval and crop aligned time-series signals.',
    enabled: true,
    action: routes.cropTS,
    requiresSingleSelection: true,
    requiredDataObjectTypes: ['TimeSeries'],
  },
  {
    name: 'AlignTS',
    description: 'Align irregular time-series signals to a common time grid.',
    enabled: true,
    action: routes.alignTS,
    requiresSingleSelection: true,
    requiredDataObjectTypes: ['TimeSeries'],
  },
  {
    name: 'Select',
    description: 'Select data objects, variables, or labels from one dataset.',
    enabled: true,
    action: routes.select,
    requiresSingleSelection: true,
  },
  {
    name: 'Partition',
    description: 'Create train, validation, and test splits.',
    enabled: true,
    action: routes.partition,
  },
  {
    name: 'Merge',
    description: 'Combine similar datasets into one merged dataset.',
    enabled: true,
    action: routes.merge,
  },
  {
    name: 'Blend',
    description: 'Blend primary objects with auxiliary datasets.',
    enabled: true,
    action: routes.blend,
    minimumSelection: 2,
  },
  {
    name: 'STFT',
    description: 'Convert waveform datasets into STFT representations.',
    enabled: true,
    action: routes.stft,
    requiresSingleSelection: true,
    requiredDataObjectTypes: ['Audio'],
  },
  {
    name: 'FeaExSpectrogram',
    description: 'Create model-facing features from STFT or spectrogram data.',
    enabled: true,
    action: routes.feaExSpectrogram,
    requiresSingleSelection: true,
    requiredDataObjectTypes: ['STFT'],
  },
  {
    name: 'GenImage',
    description: 'Generate controlled image datasets from software configs.',
    enabled: true,
    action: routes.genImage,
    requiresSingleSelection: true,
    requiredDataObjectTypes: ['ImageGenConfig'],
  },
  {
    name: 'SigExMAST',
    description: 'Extract selected MAST shot signals for Fusion workflows.',
    enabled: true,
    action: routes.sigExMAST,
  },
  {
    name: 'SimulatePDE',
    description: 'Simulate PDE fields from symbolic and boundary specifications.',
    enabled: true,
    action: routes.simulatePDE,
    requiredDataObjectTypes: ['PDESymbolicSpec'],
  },
  {
    name: 'SampleField',
    description: 'Sample each selected field dataset into output objects.',
    enabled: true,
    action: routes.sampleField,
    requiredDataObjectTypes: ['Field'],
  },
];

const INITIAL_VISIBLE_ROWS = 20;
const SHOW_MORE_STEP = 20;

export function SearchPage() {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [visibleRows, setVisibleRows] = useState(INITIAL_VISIBLE_ROWS);

  useEffect(() => {
    void loadDatasets().then((loadedDatasets) => {
      setDatasets(loadedDatasets.map((dataset) => ({ ...dataset, type: 'virtual' })));
    });
  }, []);

  const filteredDatasets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return datasets;
    }

    return datasets.filter((dataset) =>
      [dataset.name, dataset.type, dataset.source, dataset.metadataSummary, dataset.modality, getDatasetDataObjectType(dataset)]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [datasets, query]);

  useEffect(() => {
    setVisibleRows(INITIAL_VISIBLE_ROWS);
  }, [query, datasets.length]);

  const visibleDatasets = useMemo(
    () => filteredDatasets.slice(0, visibleRows),
    [filteredDatasets, visibleRows],
  );

  const selectedDatasets = useMemo(
    () => datasets.filter((dataset) => selectedIds.includes(dataset.id)),
    [datasets, selectedIds],
  );

  const summary = summarizeDatasetSelection(selectedDatasets);
  const allFilteredSelected = filteredDatasets.length > 0 && filteredDatasets.every((dataset) => selectedIds.includes(dataset.id));
  const hasMoreResults = filteredDatasets.length > visibleDatasets.length;

  function handleToggle(datasetId: string) {
    setSelectedIds((current) =>
      current.includes(datasetId)
        ? current.filter((id) => id !== datasetId)
        : [...current, datasetId],
    );
  }

  function handleNameChange(datasetId: string, nextName: string) {
    setDatasets((current) =>
      current.map((dataset) =>
        dataset.id === datasetId
          ? {
              ...dataset,
              name: nextName,
            }
          : dataset,
      ),
    );
  }

  function handleTypeChange(datasetId: string, nextType: DatasetRecord['type']) {
    setDatasets((current) =>
      current.map((dataset) =>
        dataset.id === datasetId
          ? {
              ...dataset,
              type: nextType,
            }
          : dataset,
      ),
    );
  }

  function handleSelectAllResults() {
    setSelectedIds((current) => Array.from(new Set([...current, ...filteredDatasets.map((dataset) => dataset.id)])));
  }

  function handleClearSelection() {
    setSelectedIds([]);
  }

  function handleShowMore() {
    setVisibleRows((current) => current + SHOW_MORE_STEP);
  }

  function matchesRequiredDataObjectTypes(item: TransformationFunctionCard) {
    if (!item.requiredDataObjectTypes?.length) {
      return true;
    }

    if (selectedDatasets.length === 0) {
      return false;
    }

    return selectedDatasets.every((dataset) => item.requiredDataObjectTypes?.includes(getDatasetDataObjectType(dataset)));
  }

  function handleTransformationClick(route?: string) {
    if (!route) {
      return;
    }

    navigate(route, {
      state: {
        selectedDatasets,
      },
    });
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

      <section className="grid grid--search search-layout">
        <div className="panel search-results-panel">
          <div className="panel__section search-results-panel__section">
            <div className="section-title">
              <h2>Search Results</h2>
              <span className="muted">Showing {visibleDatasets.length} of {filteredDatasets.length} rows</span>
            </div>

            <div className="field" style={{ marginBottom: '10px' }}>
              <label htmlFor="dataset-search">Search datasets</label>
              <input
                id="dataset-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, type, source, or metadata"
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
              datasets={visibleDatasets}
              maxHeightClassName="dataset-table-wrap--capped"
              onNameChange={handleNameChange}
              onToggle={handleToggle}
              onTypeChange={handleTypeChange}
              selectable
              selectedIds={selectedIds}
            />

            {hasMoreResults ? (
              <div className="table-footer-action">
                <button className="button button--secondary" onClick={handleShowMore} type="button">
                  Show more
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="panel search-sidebar">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Selection Summary</h2>
            </div>
            <dl className="summary-list">
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
              <div className="summary-list__row summary-list__row--wrap">
                <dt>Preview</dt>
                <dd className="summary-list__value summary-list__value--wrap">{summary.previewNames.length ? summary.previewNames.join(', ') : 'No selection yet'}</dd>
              </div>
            </dl>
          </div>

          <div className="panel__section">
            <div className="section-title">
              <h3>Transformation Functions</h3>
            </div>
            <div className="function-grid">
              {transformationFunctions.map((item) => {
                const disabledBySelection = item.requiresSingleSelection
                  ? selectedDatasets.length !== 1
                  : item.minimumSelection
                    ? selectedDatasets.length < item.minimumSelection
                    : selectedDatasets.length === 0;
                const disabledByType = !matchesRequiredDataObjectTypes(item);
                return (
                  <button
                    key={item.name}
                    className="function-card button button--secondary"
                    disabled={!item.enabled || disabledBySelection || disabledByType}
                    onClick={() => handleTransformationClick(item.action)}
                    type="button"
                  >
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
