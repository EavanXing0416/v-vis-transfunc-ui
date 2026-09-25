import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildNormTSPayload } from '../../features/normts/buildNormTSPayload';
import { buildNormTSReadmes } from '../../features/normts/buildNormTSReadmes';
import { buildDefaultNormTSForm } from '../../features/normts/normTS.defaults';
import { buildNormTSMetadataSummary, getNormTSOutputObjectCount } from '../../features/normts/normTSMetadata';
import type { NormTSFormState } from '../../features/normts/normTS.types';
import { getNormTSValidationMessage } from '../../features/normts/normTS.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { formatObjectCountDisplay } from '../../lib/objectCount';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { NormTSForm } from './components/NormTSForm';
import { NormTSReview } from './components/NormTSReview';

interface NormTSLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function NormTSPage() {
  const location = useLocation();
  const locationState = location.state as NormTSLocationState | null;
  const dataset = locationState?.selectedDatasets?.[0] ?? mockDatasets[0];
  const [form, setForm] = useState(() => buildDefaultNormTSForm(dataset));
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputName, setOutputName] = useState(`${dataset.name}_norm`);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');

  useEffect(() => {
    setForm(buildDefaultNormTSForm(dataset));
    setOutputName(`${dataset.name}_norm`);
  }, [dataset]);

  const validationMessage = useMemo(() => getNormTSValidationMessage(form), [form]);
  const derivedDataset = useMemo<DerivedDatasetDraft>(() => ({
    role: 'normalized',
    draft_id: `DRV-${dataset.id}-norm`,
    assigned_id: null,
    parent_id: dataset.id,
    name: outputName,
    type: outputType,
    object_count: getNormTSOutputObjectCount(dataset),
  }), [dataset, outputName, outputType]);
  const previewReadmes = useMemo(
    () => buildNormTSReadmes(buildNormTSPayload(dataset, form, derivedDataset)),
    [dataset, form, derivedDataset],
  );

  function handleCommit() {
    previewReadmes.forEach((file) => downloadText(file.filename, file.content));
    setGeneratedFiles(previewReadmes.map((file) => file.filename));
    setCommitNote(`${previewReadmes.length} README file${previewReadmes.length > 1 ? 's' : ''} generated successfully.`);
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="NormTS Configuration"
        description="Review the input dataset, configure channel-wise normalization, define the output dataset, and commit the transformation record."
        meta={<div className="stack--tight"><strong>1 input dataset</strong><Link className="button button--ghost" to={routes.search}>Back to search</Link></div>}
      />
      <section className="grid grid--editor">
        <div className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Input Dataset</h2><span className="muted">1 selected</span></div>
            <InputDatasetSummary datasets={[dataset]} />
          </div>
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Normalization Parameters</h2></div>
            <NormTSForm form={form} onChange={setForm} validationMessage={validationMessage} />
          </div>
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Output Dataset</h2><span className="muted">1 output</span></div>
            <div className="dataset-summary-table dataset-summary-table--aligned">
              <div className="dataset-summary-table__head"><span>Name</span><span>Type</span><span>Data Objects</span><span>Data object type</span><span>Metadata</span></div>
              <article className="dataset-summary-row">
                <input className="dataset-summary-row__input dataset-summary-row__input--name" onChange={(event) => setOutputName(event.target.value)} value={derivedDataset.name} />
                <select className="dataset-summary-row__input" onChange={(event) => setOutputType(event.target.value as DatasetRecord['type'])} value={derivedDataset.type}>
                  <option value="virtual">virtual</option>
                  <option value="physical">physical</option>
                </select>
                <span>{formatObjectCountDisplay(derivedDataset.object_count)}</span>
                <span>TimeSeries</span>
                <span>{buildNormTSMetadataSummary(form)}</span>
              </article>
            </div>
          </div>
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Comments</h2></div>
            <CommentEditor form={form} onChange={setForm as (nextForm: NormTSFormState) => void} />
          </div>
        </div>
        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Review</h2></div>
            <NormTSReview dataset={dataset} derivedDataset={derivedDataset} form={form} />
            <div className="panel-action-end"><button className="button button--secondary button--icon" type="button"><span>Inspect Dataset</span></button></div>
          </div>
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h3>Commit</h3></div>
            <p className="partition-note">Commit generates the internal transformation record for later service integration.</p>
            <div className="action-row" style={{ marginTop: '8px' }}>
              <button className="button button--primary" disabled={Boolean(validationMessage)} onClick={handleCommit} type="button">Commit</button>
              <Link className="button button--secondary" to={routes.search}>Cancel</Link>
            </div>
            {commitNote ? <div className="success-banner" role="status"><strong>{commitNote}</strong><span className="muted">Generated files: {generatedFiles.join(', ')}</span><div className="action-row"><Link className="button button--secondary" to={routes.search}>Return to Search</Link></div></div> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
