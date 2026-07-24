import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { defaultPartitionForm } from '../../features/partition/partition.defaults';
import { buildPartitionPayload } from '../../features/partition/buildPartitionPayload';
import { buildPartitionReadmes } from '../../features/partition/buildPartitionReadmes';
import { getPartitionValidationMessage } from '../../features/partition/partition.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from './components/CommentEditor';
import { InputDatasetSummary } from './components/InputDatasetSummary';
import { PartitionForm } from './components/PartitionForm';
import { ReviewSummary } from './components/ReviewSummary';

interface PartitionLocationState {
  selectedDatasets?: DatasetRecord[];
}

const ROLE_CONFIG = [
  { role: 'train' as const, suffix: 'trn', ratioKey: 'trainRatio' as const },
  { role: 'validation' as const, suffix: 'vld', ratioKey: 'validationRatio' as const },
  { role: 'test' as const, suffix: 'tst', ratioKey: 'testRatio' as const },
];

export function PartitionPage() {
  const location = useLocation();
  const locationState = location.state as PartitionLocationState | null;
  const selectedDatasets = locationState?.selectedDatasets?.length
    ? locationState.selectedDatasets
    : mockDatasets.slice(0, 3);

  const [form, setForm] = useState(defaultPartitionForm);
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputNameOverrides, setOutputNameOverrides] = useState<Record<string, string>>({});

  const validationMessage = useMemo(() => getPartitionValidationMessage(form), [form]);
  const derivedDatasets = useMemo(() => buildDerivedDatasets(selectedDatasets, form, outputNameOverrides), [selectedDatasets, form, outputNameOverrides]);

  function handleCommit() {
    const payload = buildPartitionPayload(selectedDatasets, form, derivedDatasets);
    const readmes = buildPartitionReadmes(payload);

    readmes.forEach((file) => {
      downloadText(file.filename, file.content);
    });

    setGeneratedFiles(readmes.map((file) => file.filename));
    setCommitNote(`${readmes.length} README file${readmes.length > 1 ? 's' : ''} generated successfully.`);
  }

  function handleOutputNameChange(key: string, value: string) {
    setOutputNameOverrides((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="Partition Configuration"
        description="Review input datasets, set partition parameters, define outputs, and commit the transformation record."
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
              <span className="muted">{selectedDatasets.length} selected</span>
            </div>
            <InputDatasetSummary datasets={selectedDatasets} />
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Partition Parameters</h2>
            </div>
            <PartitionForm form={form} onChange={setForm} validationMessage={validationMessage} />
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Output Datasets</h2>
              <span className="muted">{derivedDatasets.length} outputs</span>
            </div>
            <div className="dataset-summary-table dataset-summary-table--aligned">
              <div className="dataset-summary-table__head">
                <span>Name</span>
                <span>ID</span>
                <span>Type</span>
                <span>Data Objects</span>
                <span>Metadata</span>
              </div>
              {derivedDatasets.map((dataset) => {
                const key = `${dataset.parent_id}-${dataset.role}`;
                return (
                  <article className="dataset-summary-row" key={key}>
                    <input className="dataset-summary-row__input dataset-summary-row__input--name" id={key} onChange={(event) => handleOutputNameChange(key, event.target.value)} value={dataset.name} />
                    <span>{dataset.draft_id}</span>
                    <span className="dataset-summary-row__type">virtual</span>
                    <span>{dataset.object_count}</span>
                    <span>{labelForRole(dataset.role)}</span>
                  </article>
                );
              })}
            </div>
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
              <h2>Review</h2>
            </div>
            <ReviewSummary datasets={selectedDatasets} derivedDatasets={derivedDatasets} form={form} />
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h3>Commit</h3>
            </div>
            <p className="partition-note">Commit generates the internal transformation record for later service integration.</p>
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
                <span className="muted">Generated files: {generatedFiles.join(', ')}</span>
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

function buildDerivedDatasets(
  datasets: DatasetRecord[],
  form: typeof defaultPartitionForm,
  outputNameOverrides: Record<string, string>,
): DerivedDatasetDraft[] {
  const activeRoles = ROLE_CONFIG.filter((config) => form[config.ratioKey] > 0);

  return datasets.flatMap((dataset) => {
    const counts = distributeObjectCounts(
      dataset.objectCount,
      activeRoles.map((config) => form[config.ratioKey]),
    );

    return activeRoles.map((config, index) => {
      const key = `${dataset.id}-${config.role}`;
      return {
        role: config.role,
        draft_id: `DRV-${dataset.id}-${config.suffix}`,
        assigned_id: null,
        parent_id: dataset.id,
        name: outputNameOverrides[key] || `${dataset.name}_${config.suffix}`,
        object_count: counts[index],
      };
    });
  });
}

function distributeObjectCounts(total: number, ratios: number[]) {
  const raw = ratios.map((ratio) => ratio * total);
  const base = raw.map((value) => Math.floor(value));
  let remainder = total - base.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < order.length && remainder > 0; i += 1) {
    base[order[i].index] += 1;
    remainder -= 1;
  }

  return base;
}

function labelForRole(role: DerivedDatasetDraft['role']) {
  switch (role) {
    case 'train':
      return 'Train';
    case 'validation':
      return 'Validation';
    case 'test':
      return 'Test';
    default:
      return role;
  }
}
