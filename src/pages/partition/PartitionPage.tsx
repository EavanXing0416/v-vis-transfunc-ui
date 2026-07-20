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
  const [lastCommittedFile, setLastCommittedFile] = useState('');

  const validationMessage = useMemo(() => getPartitionValidationMessage(form), [form]);

  function handleCommit() {
    const payload = buildPartitionPayload(selectedDatasets, form);
    const filename = `${payload.transformation_id}-partition.json`;
    downloadJson(filename, payload);
    setLastCommittedFile(filename);
    setCommitNote('Transformation committed successfully.');
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="Partition Configuration"
        description="Review input datasets, set partition parameters, and commit the transformation record."
        meta={
          <div className="stack--tight">
            <strong>{selectedDatasets.length} input datasets</strong>
            <Link className="button button--ghost" to={routes.search}>
              Back to search
            </Link>
          </div>
        }
      />

      <section className="grid grid--editor">
        <div className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Input Datasets</h2>
              <button className="button button--secondary" onClick={() => setShowDatasets((current) => !current)} type="button">
                {showDatasets ? 'Hide list' : 'View list'}
              </button>
            </div>
            <InputDatasetSummary datasets={selectedDatasets} />
            {showDatasets ? (
              <div style={{ marginTop: '10px' }}>
                <CompactDatasetTable compact datasets={selectedDatasets} maxHeightClassName="dataset-table-wrap--capped" />
              </div>
            ) : null}
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Partition Parameters</h2>
            </div>
            <PartitionForm form={form} onChange={setForm} />
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Comments</h2>
            </div>
            <CommentEditor form={form} onChange={setForm} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Review Summary</h2>
            </div>
            <ReviewSummary datasets={selectedDatasets} form={form} />
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h3>Commit</h3>
            </div>
            <p className="partition-note">Commit generates the internal transformation record for later service integration.</p>
            {validationMessage ? <p style={{ color: 'var(--warning)', margin: '4px 0 0' }}>{validationMessage}</p> : null}
            <div className="action-row" style={{ marginTop: '8px' }}>
              <button className="button button--primary" disabled={Boolean(validationMessage)} onClick={handleCommit} type="button">
                Commit
              </button>
              <Link className="button button--secondary" to={routes.search}>
                Cancel
              </Link>
            </div>
            {commitNote ? (
              <div className="success-banner" role="status">
                <strong>{commitNote}</strong>
                <span className="muted">Generated file: {lastCommittedFile}</span>
                <div className="action-row">
                  <Link className="button button--secondary" to={routes.search}>
                    Return to Search
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
