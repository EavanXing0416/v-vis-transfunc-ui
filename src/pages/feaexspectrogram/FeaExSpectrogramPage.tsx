import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildDefaultFeaExSpectrogramForm } from '../../features/feaexspectrogram/feaExSpectrogram.defaults';
import { buildFeaExSpectrogramMetadataSummary, getAvailableFeatureComponents } from '../../features/feaexspectrogram/feaExSpectrogramMetadata';
import { buildFeaExSpectrogramPayload } from '../../features/feaexspectrogram/buildFeaExSpectrogramPayload';
import { buildFeaExSpectrogramReadmes } from '../../features/feaexspectrogram/buildFeaExSpectrogramReadmes';
import type { FeaExSpectrogramFormState } from '../../features/feaexspectrogram/feaExSpectrogram.types';
import { getFeaExSpectrogramValidationMessage } from '../../features/feaexspectrogram/feaExSpectrogram.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { FeaExSpectrogramForm } from './components/FeaExSpectrogramForm';
import { FeaExSpectrogramReview } from './components/FeaExSpectrogramReview';

interface FeaExSpectrogramLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function FeaExSpectrogramPage() {
  const location = useLocation();
  const locationState = location.state as FeaExSpectrogramLocationState | null;
  const dataset = locationState?.selectedDatasets?.[0] ?? mockDatasets[0];

  const [form, setForm] = useState(() => buildDefaultFeaExSpectrogramForm(dataset));
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputName, setOutputName] = useState(`${dataset.name}_fea`);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');

  useEffect(() => {
    setForm(buildDefaultFeaExSpectrogramForm(dataset));
    setOutputName(`${dataset.name}_fea`);
  }, [dataset]);

  const availableComponents = useMemo(() => getAvailableFeatureComponents(), []);
  const validationMessage = useMemo(() => getFeaExSpectrogramValidationMessage(form), [form]);
  const derivedDataset = useMemo<DerivedDatasetDraft>(() => ({
    role: 'selected',
    draft_id: `DRV-${dataset.id}-fea`,
    assigned_id: null,
    parent_id: dataset.id,
    name: outputName,
    type: outputType,
    object_count: dataset.objectCount,
  }), [dataset, outputName, outputType]);
  const previewReadmes = useMemo(() => {
    const payload = buildFeaExSpectrogramPayload(dataset, form, derivedDataset);
    return buildFeaExSpectrogramReadmes(payload);
  }, [dataset, form, derivedDataset]);

  function handleCommit() {
    previewReadmes.forEach((file) => {
      downloadText(file.filename, file.content);
    });

    setGeneratedFiles(previewReadmes.map((file) => file.filename));
    setCommitNote(`${previewReadmes.length} README file${previewReadmes.length > 1 ? 's' : ''} generated successfully.`);
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="FeaExSpectrogram Configuration"
        description="Review the input STFT dataset, confirm the feature view, define the output dataset, and commit the transformation record."
        meta={
          <div className="stack--tight">
            <strong>1 input dataset</strong>
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
              <h2>Input Dataset</h2>
              <span className="muted">1 selected</span>
            </div>
            <InputDatasetSummary datasets={[dataset]} />
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Feature Parameters</h2>
            </div>
            <FeaExSpectrogramForm availableComponents={availableComponents} form={form} onChange={setForm} showAdvancedInstruction validationMessage={validationMessage} />
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
              <article className="dataset-summary-row" key={derivedDataset.draft_id}>
                <input className="dataset-summary-row__input dataset-summary-row__input--name" onChange={(event) => setOutputName(event.target.value)} value={derivedDataset.name} />
                <select className="dataset-summary-row__input" onChange={(event) => setOutputType(event.target.value as DatasetRecord['type'])} value={derivedDataset.type}>
                  <option value="virtual">virtual</option>
                  <option value="physical">physical</option>
                </select>
                <span>{derivedDataset.object_count}</span>
                <span>STFT / Feature</span>
                <span>{buildFeaExSpectrogramMetadataSummary(dataset, {
                  selectedComponents: form.selectedComponents,
                  preserveLabelAssociations: form.preserveLabelAssociations,
                  advancedInstruction: form.advancedInstruction,
                })}</span>
              </article>
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Comments</h2>
            </div>
            <CommentEditor form={form} onChange={setForm as (nextForm: FeaExSpectrogramFormState) => void} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Review</h2>
            </div>
            <FeaExSpectrogramReview derivedDataset={derivedDataset} form={form} />
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
