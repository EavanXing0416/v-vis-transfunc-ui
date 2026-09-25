import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildSegmentTSPayload } from '../../features/segmentts/buildSegmentTSPayload';
import { buildSegmentTSReadmes } from '../../features/segmentts/buildSegmentTSReadmes';
import { buildDefaultSegmentTSForm } from '../../features/segmentts/segmentTS.defaults';
import { buildSegmentTSMetadataSummary, getSegmentTSOutputObjectCount } from '../../features/segmentts/segmentTSMetadata';
import type { SegmentTSFormState } from '../../features/segmentts/segmentTS.types';
import { getSegmentTSValidationMessage } from '../../features/segmentts/segmentTS.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { formatObjectCountDisplay } from '../../lib/objectCount';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { SegmentTSForm } from './components/SegmentTSForm';
import { SegmentTSReview } from './components/SegmentTSReview';

interface SegmentTSLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function SegmentTSPage() {
  const location = useLocation();
  const locationState = location.state as SegmentTSLocationState | null;
  const dataset = locationState?.selectedDatasets?.[0] ?? mockDatasets[0];
  const [form, setForm] = useState(() => buildDefaultSegmentTSForm(dataset));
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputName, setOutputName] = useState(`${dataset.name}_seg`);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');

  useEffect(() => {
    setForm(buildDefaultSegmentTSForm(dataset));
    setOutputName(`${dataset.name}_seg`);
  }, [dataset]);

  const validationMessage = useMemo(() => getSegmentTSValidationMessage(form), [form]);
  const derivedDataset = useMemo<DerivedDatasetDraft>(() => ({
    role: 'segmented',
    draft_id: `DRV-${dataset.id}-seg`,
    assigned_id: null,
    parent_id: dataset.id,
    name: outputName,
    type: outputType,
    object_count: getSegmentTSOutputObjectCount(dataset),
  }), [dataset, outputName, outputType]);
  const previewReadmes = useMemo(
    () => buildSegmentTSReadmes(buildSegmentTSPayload(dataset, form, derivedDataset)),
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
        title="SegmentTS Configuration"
        description="Review the labelled TimeSeries input, configure sliding-window segmentation, define the output dataset, and commit the transformation record."
        meta={<div className="stack--tight"><strong>1 input dataset</strong><Link className="button button--ghost" to={routes.search}>Back to search</Link></div>}
      />
      <section className="grid grid--editor">
        <div className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Input Dataset</h2><span className="muted">1 selected</span></div>
            <InputDatasetSummary datasets={[dataset]} />
          </div>
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Sliding Window Parameters</h2></div>
            <SegmentTSForm form={form} onChange={setForm} validationMessage={validationMessage} />
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
                <span>{buildSegmentTSMetadataSummary(form)}</span>
              </article>
            </div>
          </div>
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Comments</h2></div>
            <CommentEditor form={form} onChange={setForm as (nextForm: SegmentTSFormState) => void} />
          </div>
        </div>
        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Review</h2></div>
            <SegmentTSReview derivedDataset={derivedDataset} form={form} />
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
