import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildSTFTPayload } from '../../features/stft/buildSTFTPayload';
import { buildSTFTReadmes } from '../../features/stft/buildSTFTReadmes';
import { buildDefaultSTFTForm } from '../../features/stft/stft.defaults';
import { buildSTFTMetadataSummary, extractLabelHeadings } from '../../features/stft/stftMetadata';
import type { STFTFormState } from '../../features/stft/stft.types';
import { getSTFTValidationMessage } from '../../features/stft/stft.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { STFTForm } from './components/STFTForm';
import { STFTReview } from './components/STFTReview';

interface STFTLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function STFTPage() {
  const location = useLocation();
  const locationState = location.state as STFTLocationState | null;
  const dataset = locationState?.selectedDatasets?.[0] ?? mockDatasets[0];

  const [form, setForm] = useState(() => buildDefaultSTFTForm(dataset));
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputName, setOutputName] = useState(`${dataset.name}_stft`);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');

  useEffect(() => {
    setForm(buildDefaultSTFTForm(dataset));
    setOutputName(`${dataset.name}_stft`);
  }, [dataset]);

  const validationMessage = useMemo(() => getSTFTValidationMessage(form), [form]);
  const labelsAvailable = useMemo(() => extractLabelHeadings(dataset.metadataSummary).length > 0 || dataset.labelCount > 0, [dataset]);
  const derivedDataset = useMemo<DerivedDatasetDraft>(() => ({
    role: 'selected',
    draft_id: `DRV-${dataset.id}-stft`,
    assigned_id: null,
    parent_id: dataset.id,
    name: outputName,
    type: outputType,
    object_count: dataset.objectCount,
  }), [dataset, outputName, outputType]);
  const previewReadmes = useMemo(() => {
    const payload = buildSTFTPayload(dataset, form, derivedDataset);
    return buildSTFTReadmes(payload);
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
        title="STFT Configuration"
        description="Review the input dataset, set STFT parameters, define the output dataset, and commit the transformation record."
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
              <h2>STFT Parameters</h2>
            </div>
            <STFTForm form={form} labelsAvailable={labelsAvailable} onChange={setForm} validationMessage={validationMessage} />
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
                <span>STFT</span>
                <span>{buildSTFTMetadataSummary(dataset, {
                  storedComponents: form.storedComponents,
                  windowType: form.windowType,
                  fftSize: form.fftSize,
                  windowLength: form.windowLength,
                  hopLength: form.hopLength,
                  applyToLabels: form.applyToLabels,
                })}</span>
              </article>
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Comments</h2>
            </div>
            <CommentEditor form={form} onChange={setForm as (nextForm: STFTFormState) => void} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Review</h2>
            </div>
            <STFTReview dataset={dataset} derivedDataset={derivedDataset} form={form} />
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
