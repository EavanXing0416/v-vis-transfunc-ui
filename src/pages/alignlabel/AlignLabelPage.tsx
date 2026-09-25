import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { buildAlignLabelPayload } from '../../features/alignlabel/buildAlignLabelPayload';
import { buildAlignLabelReadmes } from '../../features/alignlabel/buildAlignLabelReadmes';
import { buildDefaultAlignLabelForm } from '../../features/alignlabel/alignLabel.defaults';
import { buildAlignLabelMetadataSummary, getAlignLabelOutputObjectCount } from '../../features/alignlabel/alignLabelMetadata';
import type { AlignLabelFormState } from '../../features/alignlabel/alignLabel.types';
import { getAlignLabelValidationMessage } from '../../features/alignlabel/alignLabel.validation';
import { getDatasetDataObjectType } from '../../features/datasets/dataObjectType';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { formatObjectCountDisplay } from '../../lib/objectCount';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { AlignLabelForm } from './components/AlignLabelForm';
import { AlignLabelReview } from './components/AlignLabelReview';

interface AlignLabelLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function AlignLabelPage() {
  const location = useLocation();
  const locationState = location.state as AlignLabelLocationState | null;
  const selectedDatasets = useMemo(
    () => locationState?.selectedDatasets?.length ? locationState.selectedDatasets : [mockDatasets[0]],
    [locationState?.selectedDatasets],
  );
  const timeSeriesDatasets = selectedDatasets.filter((dataset) => getDatasetDataObjectType(dataset) === 'TimeSeries');
  const annotationDatasets = selectedDatasets.filter((dataset) => getDatasetDataObjectType(dataset) === 'EventAnnotation');
  const fallbackDataset = timeSeriesDatasets[0] ?? selectedDatasets[0] ?? mockDatasets[0];

  const [form, setForm] = useState(() => buildDefaultAlignLabelForm(selectedDatasets));
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputName, setOutputName] = useState(`${fallbackDataset.name}_lbl`);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');

  const timeSeriesDataset = timeSeriesDatasets.find((dataset) => dataset.id === form.timeSeriesDatasetId) ?? fallbackDataset;
  const annotationDataset = form.annotationSource === 'input_dataset'
    ? annotationDatasets.find((dataset) => dataset.id === form.annotationDatasetId) ?? null
    : null;

  useEffect(() => {
    setForm(buildDefaultAlignLabelForm(selectedDatasets));
  }, [selectedDatasets]);

  useEffect(() => {
    setOutputName(`${timeSeriesDataset.name}_lbl`);
  }, [timeSeriesDataset.id, timeSeriesDataset.name]);

  const validationMessage = useMemo(() => getAlignLabelValidationMessage(form), [form]);
  const derivedDataset = useMemo<DerivedDatasetDraft>(() => ({
    role: 'labelled',
    draft_id: `DRV-${timeSeriesDataset.id}-lbl`,
    assigned_id: null,
    parent_id: timeSeriesDataset.id,
    name: outputName,
    type: outputType,
    object_count: getAlignLabelOutputObjectCount(timeSeriesDataset),
  }), [timeSeriesDataset, outputName, outputType]);
  const previewReadmes = useMemo(
    () => buildAlignLabelReadmes(buildAlignLabelPayload(timeSeriesDataset, annotationDataset, form, derivedDataset)),
    [timeSeriesDataset, annotationDataset, form, derivedDataset],
  );

  function handleCommit() {
    previewReadmes.forEach((file) => downloadText(file.filename, file.content));
    setGeneratedFiles(previewReadmes.map((file) => file.filename));
    setCommitNote(`${previewReadmes.length} README file${previewReadmes.length > 1 ? 's' : ''} generated successfully.`);
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="AlignLabel Configuration"
        description="Confirm the TimeSeries and annotation inputs, align event intervals to each shot, define the output dataset, and commit the transformation record."
        meta={<div className="stack--tight"><strong>{selectedDatasets.length} input dataset{selectedDatasets.length === 1 ? '' : 's'}</strong><Link className="button button--ghost" to={routes.search}>Back to search</Link></div>}
      />
      <section className="grid grid--editor">
        <div className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Input Datasets</h2><span className="muted">{selectedDatasets.length} selected</span></div>
            <InputDatasetSummary datasets={selectedDatasets} />
          </div>
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Label Alignment Parameters</h2></div>
            <AlignLabelForm
              annotationDatasets={annotationDatasets}
              form={form}
              onChange={setForm}
              selectedDatasetCount={selectedDatasets.length}
              timeSeriesDatasets={timeSeriesDatasets}
              validationMessage={validationMessage}
            />
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
                <span>{buildAlignLabelMetadataSummary(form, timeSeriesDataset)}</span>
              </article>
            </div>
          </div>
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Comments</h2></div>
            <CommentEditor form={form} onChange={setForm as (nextForm: AlignLabelFormState) => void} />
          </div>
        </div>
        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title"><h2>Review</h2></div>
            <AlignLabelReview annotationDataset={annotationDataset} derivedDataset={derivedDataset} form={form} timeSeriesDataset={timeSeriesDataset} />
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
