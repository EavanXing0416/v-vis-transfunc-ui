import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { CompactDatasetTable } from '../../components/tables/CompactDatasetTable';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { defaultPartitionForm } from '../../features/partition/partition.defaults';
import { buildPartitionPayload } from '../../features/partition/buildPartitionPayload';
import { getPartitionValidationMessage } from '../../features/partition/partition.validation';
import { downloadJson } from '../../lib/downloadJson';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from './components/CommentEditor';
import { InputDatasetSummary } from './components/InputDatasetSummary';
import { PartitionForm } from './components/PartitionForm';
import { ReviewSummary } from './components/ReviewSummary';

interface PartitionLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function PartitionPage() {
  const location = useLocation();
  const locationState = location.state as PartitionLocationState | null;
  const selectedDatasets = locationState?.selectedDatasets?.length
    ? locationState.selectedDatasets
    : mockDatasets.slice(0, 3);

  const [form, setForm] = useState(defaultPartitionForm);
  const [showDatasets, setShowDatasets] = useState(false);
  const [commitNote, setCommitNote] = useState('');

  const validationMessage = useMemo(() => getPartitionValidationMessage(form), [form]);

  function handleCommit() {
    const payload = buildPartitionPayload(selectedDatasets, form);
    downloadJson(`${payload.transformation_id}-partition.json`, payload);
    setCommitNote(
      'Internal transformation record generated and downloaded. The JSON stays out of the editing UI, but is ready for later service integration.',
    );
  }

  return (
    <main className="app-shell">
      <PageHeader
        eyebrow="Level 2 UI"
        title="Partition Editing Page"
        description="This secondary page inherits selected datasets from the search engine and focuses on transformation-specific editing."
        meta={
          <div className="stack">
            <strong>{selectedDatasets.length} inherited input datasets</strong>
            <Link className="button button--ghost" to={routes.search}>
              Back to search results
            </Link>
          </div>
        }
      />

      <section className="grid grid--editor">
        <div className="panel">
          <div className="panel__section">
            <div className="section-title">
              <h2>Input Datasets</h2>
              <button
                className="button button--secondary"
                onClick={() => setShowDatasets((current) => !current)}
                type="button"
              >
                {showDatasets ? 'Hide full list' : 'View full dataset list'}
              </button>
            </div>
            <InputDatasetSummary datasets={selectedDatasets} />
            {showDatasets ? (
              <div style={{ marginTop: '18px' }}>
                <CompactDatasetTable datasets={selectedDatasets} />
              </div>
            ) : null}
          </div>

          <div className="panel__section">
            <div className="section-title">
              <h2>Partition Parameters</h2>
            </div>
            <PartitionForm form={form} onChange={setForm} />
          </div>

          <div className="panel__section">
            <div className="section-title">
              <h2>Transformation Comments</h2>
            </div>
            <CommentEditor form={form} onChange={setForm} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section">
            <div className="section-title">
              <h2>Review Summary</h2>
            </div>
            <ReviewSummary datasets={selectedDatasets} form={form} />
          </div>

          <div className="panel__section">
            <div className="section-title">
              <h3>Commit Transformation</h3>
            </div>
            <p className="muted">
              Users do not need to inspect the JSON directly. Committing this configuration generates an internal transformation record for later connection to the real service.
            </p>
            {validationMessage ? <p style={{ color: 'var(--warning)', marginTop: 0 }}>{validationMessage}</p> : null}
            <div className="action-row">
              <button
                className="button button--primary"
                disabled={Boolean(validationMessage)}
                onClick={handleCommit}
                type="button"
              >
                Commit Transformation
              </button>
              <Link className="button button--secondary" to={routes.search}>
                Cancel
              </Link>
            </div>
            {commitNote ? <p className="status-note">{commitNote}</p> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
