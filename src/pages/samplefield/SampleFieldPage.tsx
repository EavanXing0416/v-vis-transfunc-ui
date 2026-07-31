import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildSampleFieldPayload } from '../../features/samplefield/buildSampleFieldPayload';
import { buildSampleFieldReadmes } from '../../features/samplefield/buildSampleFieldReadmes';
import { defaultSampleFieldForm } from '../../features/samplefield/sampleField.defaults';
import { getSampleFieldValidationMessage } from '../../features/samplefield/sampleField.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { SampleFieldForm } from './components/SampleFieldForm';
import { SampleFieldReview } from './components/SampleFieldReview';

interface SampleFieldLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function SampleFieldPage() {
  const location = useLocation();
  const locationState = location.state as SampleFieldLocationState | null;
  const selectedDatasets = locationState?.selectedDatasets?.length
    ? locationState.selectedDatasets
    : mockDatasets.slice(3, 6);

  const [form, setForm] = useState(defaultSampleFieldForm);
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputNameOverrides, setOutputNameOverrides] = useState<Record<string, string>>({});
  const [outputTypeOverrides, setOutputTypeOverrides] = useState<Record<string, DatasetRecord['type']>>({});

  const validationMessage = useMemo(() => getSampleFieldValidationMessage(form), [form]);
  const derivedDatasets = useMemo(
    () => buildDerivedDatasets(selectedDatasets, form.numberOfDataObjects, outputNameOverrides, outputTypeOverrides),
    [selectedDatasets, form.numberOfDataObjects, outputNameOverrides, outputTypeOverrides],
  );
  const previewReadmes = useMemo(() => {
    const payload = buildSampleFieldPayload(selectedDatasets, form, derivedDatasets);
    return buildSampleFieldReadmes(payload);
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
        title="SampleField Configuration"
        description="Review input datasets, set sampling parameters, define outputs, and commit the transformation record."
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
              <h2>SampleField Parameters</h2>
            </div>
            <SampleFieldForm form={form} onChange={setForm} validationMessage={validationMessage} />
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
                const key = dataset.parent_id;
                const parentDataset = selectedDatasets.find((item) => item.id === dataset.parent_id);
                return (
                  <article className="dataset-summary-row dataset-summary-row--with-info" key={key}>
                    <input className="dataset-summary-row__input dataset-summary-row__input--name" id={key} onChange={(event) => handleOutputNameChange(key, event.target.value)} value={dataset.name} />
                    <select className="dataset-summary-row__input" onChange={(event) => handleOutputTypeChange(key, event.target.value as DatasetRecord['type'])} value={dataset.type}>
                      <option value="virtual">virtual</option>
                      <option value="physical">physical</option>
                    </select>
                    <span>{dataset.object_count}</span>
                    <span>Sampled field object</span>
                    <span>{appendSamplePoints(parentDataset?.metadataSummary ?? 'n.a.', form.numberOfSamplesPerObject)}</span>
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
            <SampleFieldReview datasets={selectedDatasets} derivedDatasets={derivedDatasets} form={form} />
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
  objectCount: number,
  outputNameOverrides: Record<string, string>,
  outputTypeOverrides: Record<string, DatasetRecord['type']>,
): DerivedDatasetDraft[] {
  return datasets.map((dataset) => ({
    role: 'sampled',
    draft_id: `DRV-${dataset.id}-smp`,
    assigned_id: null,
    parent_id: dataset.id,
    name: outputNameOverrides[dataset.id] || `${dataset.name}_smp`,
    type: outputTypeOverrides[dataset.id] || 'virtual',
    object_count: objectCount,
  }));
}

function appendSamplePoints(metadata: string, samplePoints: number) {
  const trimmed = metadata.trim();

  if (!trimmed || trimmed === 'n.a.') {
    return `${samplePoints} sample points.`;
  }

  return `${trimmed}${trimmed.endsWith('.') ? '' : '.'} ${samplePoints} sample points.`;
}
