import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { getDatasetDataObjectType } from '../../features/datasets/dataObjectType';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildSigExMASTPayload } from '../../features/sigexmast/buildSigExMASTPayload';
import { buildSigExMASTReadmes } from '../../features/sigexmast/buildSigExMASTReadmes';
import { buildDefaultSigExMASTForm } from '../../features/sigexmast/sigExMAST.defaults';
import { buildSigExMASTMetadataSummary, getSigExMASTOutputObjectCount } from '../../features/sigexmast/sigExMASTMetadata';
import type { SigExMASTFormState } from '../../features/sigexmast/sigExMAST.types';
import { getSigExMASTValidationMessage, parseManualShotIds } from '../../features/sigexmast/sigExMAST.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { formatObjectCountDisplay } from '../../lib/objectCount';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { SigExMASTForm } from './components/SigExMASTForm';
import { SigExMASTReview } from './components/SigExMASTReview';

interface SigExMASTLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function SigExMASTPage() {
  const location = useLocation();
  const locationState = location.state as SigExMASTLocationState | null;
  const selectedDatasets = locationState?.selectedDatasets?.length ? locationState.selectedDatasets : [mockDatasets[0]];
  const primaryDataset = selectedDatasets[0];
  const shotListDatasets = selectedDatasets.filter((dataset) => getDatasetDataObjectType(dataset) === 'IntegerList');

  const [form, setForm] = useState(() => buildDefaultSigExMASTForm(selectedDatasets));
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputName, setOutputName] = useState(`${primaryDataset.name}_ts`);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');

  useEffect(() => {
    setForm(buildDefaultSigExMASTForm(selectedDatasets));
    setOutputName(`${primaryDataset.name}_ts`);
  }, [primaryDataset.name, selectedDatasets]);

  const validationMessage = useMemo(() => getSigExMASTValidationMessage(form), [form]);
  const manualShotIds = useMemo(() => parseManualShotIds(form.manualShotIds), [form.manualShotIds]);
  const outputObjectCount = useMemo(
    () => getSigExMASTOutputObjectCount(primaryDataset, shotListDatasets, form, manualShotIds),
    [primaryDataset, shotListDatasets, form, manualShotIds],
  );
  const derivedDataset = useMemo<DerivedDatasetDraft>(() => ({
    role: 'retrieved',
    draft_id: `DRV-${primaryDataset.id}-ts`,
    assigned_id: null,
    parent_id: primaryDataset.id,
    name: outputName,
    type: outputType,
    object_count: outputObjectCount,
  }), [primaryDataset.id, outputName, outputType, outputObjectCount]);
  const previewReadmes = useMemo(() => {
    const payload = buildSigExMASTPayload(selectedDatasets, form, [derivedDataset]);
    return buildSigExMASTReadmes(payload);
  }, [selectedDatasets, form, derivedDataset]);

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
        title="SigExMAST Configuration"
        description="Review the selected Fusion inputs, extract MAST shot signals, define the output dataset, and commit the transformation record."
        meta={(
          <div className="stack--tight">
            <strong>{selectedDatasets.length} input dataset{selectedDatasets.length === 1 ? '' : 's'}</strong>
            <Link className="button button--ghost" to={routes.search}>
              Back to search
            </Link>
          </div>
        )}
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
              <h2>Retrieval Parameters</h2>
            </div>
            <SigExMASTForm
              form={form}
              onChange={setForm}
              shotListDatasets={shotListDatasets.map((dataset) => ({ id: dataset.id, name: dataset.name }))}
              validationMessage={validationMessage}
            />
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
                <span>{buildSigExMASTMetadataSummary(form)}</span>
              </article>
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Comments</h2>
            </div>
            <CommentEditor form={form} onChange={setForm as (nextForm: SigExMASTFormState) => void} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Review</h2>
            </div>
            <SigExMASTReview datasets={selectedDatasets} derivedDataset={derivedDataset} form={form} />
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
