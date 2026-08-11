import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { getDatasetDataObjectType } from '../../features/datasets/dataObjectType';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildMergePayload } from '../../features/merge/buildMergePayload';
import { buildMergeReadmes } from '../../features/merge/buildMergeReadmes';
import { buildDefaultMergeForm } from '../../features/merge/merge.defaults';
import { buildAddLabelMetadataSummary, buildMergeMetadataSummary, getHomogeneousMergeDataObjectType } from '../../features/merge/mergeMetadata';
import { getMergeValidationMessage } from '../../features/merge/merge.validation';
import type { MergeFormState } from '../../features/merge/merge.types';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { MergeForm } from './components/MergeForm';
import { MergeReview } from './components/MergeReview';

interface MergeLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function MergePage() {
  const location = useLocation();
  const locationState = location.state as MergeLocationState | null;
  const selectedDatasets = locationState?.selectedDatasets?.length
    ? locationState.selectedDatasets
    : mockDatasets.slice(0, 2);

  const initialForm = useMemo(() => buildDefaultMergeForm(selectedDatasets), [selectedDatasets]);
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

  const validationMessage = useMemo(() => getMergeValidationMessage(selectedDatasets, form), [selectedDatasets, form]);
  const orderedDatasetIds = useMemo(() => selectedDatasets.map((dataset) => dataset.id), [selectedDatasets]);
  const primaryDataset = useMemo(
    () => selectedDatasets.find((dataset) => dataset.id === form.primaryDatasetId) ?? selectedDatasets[0] ?? null,
    [selectedDatasets, form.primaryDatasetId],
  );
  const labelDatasets = useMemo(
    () => selectedDatasets.filter((dataset) => form.labelDatasetIds.includes(dataset.id) && dataset.id !== form.primaryDatasetId),
    [selectedDatasets, form.labelDatasetIds, form.primaryDatasetId],
  );
  const schemaReferenceDataset = useMemo(
    () => selectedDatasets.find((dataset) => dataset.id === form.schemaReferenceDatasetId) ?? null,
    [selectedDatasets, form.schemaReferenceDatasetId],
  );
  const derivedDatasets = useMemo(
    () => buildDerivedDatasets(selectedDatasets, form, outputName, outputType, primaryDataset),
    [selectedDatasets, form, outputName, outputType, primaryDataset],
  );
  const previewReadmes = useMemo(() => {
    const payload = buildMergePayload(selectedDatasets, form, derivedDatasets, orderedDatasetIds);
    return buildMergeReadmes(payload);
  }, [selectedDatasets, form, derivedDatasets, orderedDatasetIds]);

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

  const outputDataObjectType = form.mergeMethod === 'complex'
    ? (primaryDataset ? getDatasetDataObjectType(primaryDataset) : 'Dataset object')
    : (getHomogeneousMergeDataObjectType(selectedDatasets) ?? 'Mixed input types');

  const outputMetadata = form.mergeMethod === 'complex'
    ? buildAddLabelMetadataSummary(primaryDataset, labelDatasets, form.duplicatePrimaryDataset, form.labelHeadingsBySource)
    : buildMergeMetadataSummary(
        selectedDatasets,
        derivedDatasets[0]?.object_count ?? 0,
        form.mode,
        form.schemaHandling,
        schemaReferenceDataset?.name,
      );

  return (
    <main className="app-shell">
      <PageHeader
        title="Merge Configuration"
        description="Review input datasets, set merge parameters, define the merged output, and commit the transformation record."
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
              <h2>Merge Parameters</h2>
            </div>
            {selectedDatasets.length === 1 ? (
              <p className="field-error" style={{ marginBottom: '8px' }}>
                Only 1 dataset is selected. Duplicate selected dataset is available for AddLabel.
              </p>
            ) : null}
            <MergeForm datasets={selectedDatasets} form={form} onChange={setForm} validationMessage={validationMessage} />
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
                  <span>{outputDataObjectType}</span>
                  <span>{outputMetadata}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Comments</h2>
            </div>
            <CommentEditor form={form} onChange={setForm as (nextForm: MergeFormState) => void} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Review</h2>
            </div>
            <MergeReview datasets={selectedDatasets} derivedDatasets={derivedDatasets} form={form} orderedDatasetNames={selectedDatasets.map((dataset) => dataset.name)} />
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

function buildDefaultOutputName(datasets: DatasetRecord[], form: MergeFormState) {
  if (form.mergeMethod === 'complex') {
    const primaryDataset = datasets.find((dataset) => dataset.id === form.primaryDatasetId) ?? datasets[0];
    return `${primaryDataset?.name ?? 'LabelledDataset'}_lbl`;
  }

  const first = datasets[0]?.name ?? 'MergedDataset';
  return `${first}_mrg`;
}

function buildDerivedDatasets(
  datasets: DatasetRecord[],
  form: MergeFormState,
  outputName: string,
  outputType: DatasetRecord['type'],
  primaryDataset: DatasetRecord | null,
): DerivedDatasetDraft[] {
  const totalObjects = form.mergeMethod === 'complex'
    ? (primaryDataset?.objectCount ?? 0)
    : datasets.reduce((sum, dataset) => sum + dataset.objectCount, 0);
  const parentId = form.mergeMethod === 'complex'
    ? (primaryDataset?.id ?? datasets[0]?.id ?? 'MERGE')
    : (datasets[0]?.id ?? 'MERGE');
  const suffix = form.mergeMethod === 'complex' ? 'lbl' : 'mrg';

  return [{
    role: 'merged',
    draft_id: `DRV-${parentId}-${suffix}`,
    assigned_id: null,
    parent_id: parentId,
    name: outputName,
    type: outputType,
    object_count: totalObjects,
  }];
}
