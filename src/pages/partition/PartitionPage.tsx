import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { getDatasetDataObjectType } from '../../features/datasets/dataObjectType';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildPartitionPayload } from '../../features/partition/buildPartitionPayload';
import { buildPartitionReadmes } from '../../features/partition/buildPartitionReadmes';
import { defaultPartitionForm } from '../../features/partition/partition.defaults';
import { getPartitionValidationMessage } from '../../features/partition/partition.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { formatObjectCountDisplay } from '../../lib/objectCount';
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
  const [outputTypeOverrides, setOutputTypeOverrides] = useState<Record<string, DatasetRecord['type']>>({});

  const validationMessage = useMemo(() => getPartitionValidationMessage(form), [form]);
  const derivedDatasets = useMemo(
    () => buildDerivedDatasets(selectedDatasets, form, outputNameOverrides, outputTypeOverrides),
    [selectedDatasets, form, outputNameOverrides, outputTypeOverrides],
  );
  const previewReadmes = useMemo(() => {
    const payload = buildPartitionPayload(selectedDatasets, form, derivedDatasets);
    return buildPartitionReadmes(payload);
  }, [selectedDatasets, form, derivedDatasets]);

  function handleCommit() {
    previewReadmes.forEach((file) => {
      downloadText(file.filename, file.content);
    });

    setGeneratedFiles(previewReadmes.map((file) => file.filename));
    setCommitNote(`${previewReadmes.length} README file${previewReadmes.length > 1 ? 's' : ''} generated successfully.`);
  }

  function handleOutputNameChange(key: string, value: string) {
    setOutputNameOverrides((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleOutputTypeChange(key: string, value: DatasetRecord['type']) {
    setOutputTypeOverrides((current) => ({
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
                <span>Type</span>
                <span>Data Objects</span>
                <span>Data object type</span>
                <span>Metadata</span>
              </div>
              {derivedDatasets.map((dataset, index) => {
                const key = `${dataset.parent_id}-${dataset.role}`;
                const parentDataset = selectedDatasets.find((item) => item.id === dataset.parent_id);
                return (
                  <article className="dataset-summary-row dataset-summary-row--with-info" key={key}>
                    <input className="dataset-summary-row__input dataset-summary-row__input--name" id={key} onChange={(event) => handleOutputNameChange(key, event.target.value)} value={dataset.name} />
                    <select className="dataset-summary-row__input" onChange={(event) => handleOutputTypeChange(key, event.target.value as DatasetRecord['type'])} value={dataset.type}>
                      <option value="virtual">virtual</option>
                      <option value="physical">physical</option>
                    </select>
                    <span>{formatObjectCountDisplay(dataset.object_count)}</span>
                    <span>{parentDataset ? getDatasetDataObjectType(parentDataset) : 'Dataset object'}</span>
                    <span>{parentDataset?.metadataSummary ?? 'n.a.'}</span>
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
            <div className="panel-action-end">
              <button className="button button--secondary button--icon" type="button">
                <span aria-hidden="true" className="button__icon">
                  <svg fill="none" height="14" viewBox="0 0 16 16" width="14" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/>
                  </svg>
                </span>
                <span>Inspect Dataset</span>
              </button>
            </div>
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
  outputTypeOverrides: Record<string, DatasetRecord['type']>,
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
        type: outputTypeOverrides[key] || 'virtual',
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

