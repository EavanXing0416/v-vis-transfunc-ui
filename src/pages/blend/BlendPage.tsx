import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { getDatasetDataObjectType } from '../../features/datasets/dataObjectType';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildBlendPayload } from '../../features/blend/buildBlendPayload';
import { buildBlendReadmes } from '../../features/blend/buildBlendReadmes';
import { buildDefaultBlendForm } from '../../features/blend/blend.defaults';
import { buildBlendMetadataSummary } from '../../features/blend/blendMetadata';
import type { BlendFormState } from '../../features/blend/blend.types';
import { getBlendValidationMessage } from '../../features/blend/blend.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { BlendForm } from './components/BlendForm';
import { BlendReview } from './components/BlendReview';

interface BlendLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function BlendPage() {
  const location = useLocation();
  const locationState = location.state as BlendLocationState | null;
  const selectedDatasets = locationState?.selectedDatasets?.length
    ? locationState.selectedDatasets
    : mockDatasets.slice(0, 2);

  const initialForm = useMemo(() => buildDefaultBlendForm(selectedDatasets), [selectedDatasets]);
  const [form, setForm] = useState(initialForm);
  const [outputNameTouched, setOutputNameTouched] = useState(false);
  const defaultOutputName = useMemo(() => buildDefaultOutputName(selectedDatasets, form), [selectedDatasets, form]);
  const [outputName, setOutputName] = useState(defaultOutputName);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);

  useEffect(() => {
    setForm(initialForm);
    setOutputName(buildDefaultOutputName(selectedDatasets, initialForm));
    setOutputNameTouched(false);
  }, [initialForm, selectedDatasets]);

  useEffect(() => {
    if (!outputNameTouched) {
      setOutputName(defaultOutputName);
    }
  }, [defaultOutputName, outputNameTouched]);

  const validationMessage = useMemo(() => getBlendValidationMessage(selectedDatasets, form), [selectedDatasets, form]);
  const primaryDataset = useMemo(
    () => selectedDatasets.find((dataset) => dataset.id === form.primaryDatasetId) ?? selectedDatasets[0] ?? null,
    [selectedDatasets, form.primaryDatasetId],
  );
  const auxiliaryDatasets = useMemo(
    () => selectedDatasets.filter((dataset) => form.auxiliaryDatasetIds.includes(dataset.id) && dataset.id !== form.primaryDatasetId),
    [selectedDatasets, form.auxiliaryDatasetIds, form.primaryDatasetId],
  );
  const derivedDatasets = useMemo(
    () => buildDerivedDatasets(primaryDataset, outputName, outputType),
    [primaryDataset, outputName, outputType],
  );
  const previewReadmes = useMemo(() => {
    const payload = buildBlendPayload(selectedDatasets, form, derivedDatasets);
    return buildBlendReadmes(payload);
  }, [selectedDatasets, form, derivedDatasets]);

  function handleCommit() {
    previewReadmes.forEach((file) => {
      downloadText(file.filename, file.content);
    });

    setGeneratedFiles(previewReadmes.map((file) => file.filename));
    setCommitNote(`${previewReadmes.length} README file${previewReadmes.length > 1 ? 's' : ''} generated successfully.`);
  }

  function handleOutputNameChange(value: string) {
    setOutputNameTouched(true);
    setOutputName(value);
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="Blend Configuration"
        description="Review input datasets, set blending parameters, define the blended output, and commit the transformation record."
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
              <h2>Blend Parameters</h2>
            </div>
            <BlendForm datasets={selectedDatasets} form={form} onChange={setForm} validationMessage={validationMessage} />
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Output Dataset</h2>
              <span className="muted">1 output</span>
            </div>
            <div className="dataset-summary-table dataset-summary-table--aligned">
              <div className="dataset-summary-table__head">
                <span>Name</span>
                <span>Type</span>
                <span>Data Objects</span>
                <span>Data object type</span>
                <span>Metadata</span>
              </div>
              {derivedDatasets.map((dataset) => (
                <article className="dataset-summary-row" key={dataset.draft_id}>
                  <input className="dataset-summary-row__input dataset-summary-row__input--name" onChange={(event) => handleOutputNameChange(event.target.value)} value={dataset.name} />
                  <select className="dataset-summary-row__input" onChange={(event) => setOutputType(event.target.value as DatasetRecord['type'])} value={dataset.type}>
                    <option value="virtual">virtual</option>
                    <option value="physical">physical</option>
                  </select>
                  <span>{dataset.object_count}</span>
                  <span>{primaryDataset ? getDatasetDataObjectType(primaryDataset) : 'Data object'}</span>
                  <span>{buildBlendMetadataSummary(primaryDataset, auxiliaryDatasets, form.auxiliaryFraction)}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Comments</h2>
            </div>
            <CommentEditor form={form} onChange={setForm as (nextForm: BlendFormState) => void} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Review</h2>
            </div>
            <BlendReview datasets={selectedDatasets} derivedDatasets={derivedDatasets} form={form} />
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

function buildDefaultOutputName(datasets: DatasetRecord[], form: BlendFormState) {
  const primaryDataset = datasets.find((dataset) => dataset.id === form.primaryDatasetId) ?? datasets[0];
  return `${primaryDataset?.name ?? 'BlendedDataset'}_blend`;
}

function buildDerivedDatasets(
  primaryDataset: DatasetRecord | null,
  outputName: string,
  outputType: DatasetRecord['type'],
): DerivedDatasetDraft[] {
  return [{
    role: 'blended',
    draft_id: `DRV-${primaryDataset?.id ?? 'BLEND'}-blend`,
    assigned_id: null,
    parent_id: primaryDataset?.id ?? 'BLEND',
    name: outputName,
    type: outputType,
    object_count: primaryDataset?.objectCount ?? 0,
  }];
}
