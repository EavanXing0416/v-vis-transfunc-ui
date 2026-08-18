import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildAlignTSPayload } from '../../features/alignts/buildAlignTSPayload';
import { buildAlignTSReadmes } from '../../features/alignts/buildAlignTSReadmes';
import { buildDefaultAlignTSForm } from '../../features/alignts/alignTS.defaults';
import { buildAlignTSMetadataSummary, getAlignTSOutputObjectCount } from '../../features/alignts/alignTSMetadata';
import type { AlignTSFormState } from '../../features/alignts/alignTS.types';
import { getAlignTSValidationMessage } from '../../features/alignts/alignTS.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { formatObjectCountDisplay } from '../../lib/objectCount';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { AlignTSForm } from './components/AlignTSForm';
import { AlignTSReview } from './components/AlignTSReview';

interface AlignTSLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function AlignTSPage() {
  const location = useLocation();
  const locationState = location.state as AlignTSLocationState | null;
  const dataset = locationState?.selectedDatasets?.[0] ?? mockDatasets[0];

  const [form, setForm] = useState(() => buildDefaultAlignTSForm(dataset));
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputName, setOutputName] = useState(`${dataset.name}_align`);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');

  useEffect(() => {
    setForm(buildDefaultAlignTSForm(dataset));
    setOutputName(`${dataset.name}_align`);
  }, [dataset]);

  const validationMessage = useMemo(() => getAlignTSValidationMessage(form), [form]);
  const derivedDataset = useMemo<DerivedDatasetDraft>(() => ({
    role: 'selected',
    draft_id: `DRV-${dataset.id}-align`,
    assigned_id: null,
    parent_id: dataset.id,
    name: outputName,
    type: outputType,
    object_count: getAlignTSOutputObjectCount(dataset),
  }), [dataset, outputName, outputType]);
  const previewReadmes = useMemo(() => {
    const payload = buildAlignTSPayload(dataset, form, derivedDataset);
    return buildAlignTSReadmes(payload);
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
        title="AlignTS Configuration"
        description="Review the input dataset, align irregular time-series signals to a common grid, define the output dataset, and commit the transformation record."
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
              <h2>Alignment Parameters</h2>
            </div>
            <AlignTSForm form={form} onChange={setForm} validationMessage={validationMessage} />
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
                <span>{formatObjectCountDisplay(derivedDataset.object_count)}</span>
                <span>TimeSeries</span>
                <span>{buildAlignTSMetadataSummary(form)}</span>
              </article>
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Comments</h2>
            </div>
            <CommentEditor form={form} onChange={setForm as (nextForm: AlignTSFormState) => void} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Review</h2>
            </div>
            <AlignTSReview dataset={dataset} derivedDataset={derivedDataset} form={form} />
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
