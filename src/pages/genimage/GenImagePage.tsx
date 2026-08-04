import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildGenImagePayload } from '../../features/genimage/buildGenImagePayload';
import { buildGenImageReadmes } from '../../features/genimage/buildGenImageReadmes';
import { buildGenImageDefaults } from '../../features/genimage/genImage.defaults';
import type { GenImageFormState } from '../../features/genimage/genImage.types';
import { getGenImageValidationMessage } from '../../features/genimage/genImage.validation';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { routes } from '../../lib/routes';
import { readmeBackedDatasets } from '../../mocks/readmeDatasets';
import { CommentEditor } from '../partition/components/CommentEditor';
import { InputDatasetSummary } from '../partition/components/InputDatasetSummary';
import { GenImageForm } from './components/GenImageForm';
import { GenImageReview } from './components/GenImageReview';

interface GenImageLocationState {
  selectedDatasets?: DatasetRecord[];
}

export function GenImagePage() {
  const location = useLocation();
  const locationState = location.state as GenImageLocationState | null;
  const dataset = locationState?.selectedDatasets?.[0]
    ?? readmeBackedDatasets.find((item) => item.dataObjectType?.toLowerCase().includes('config') || item.name.toLowerCase().includes('shape'))
    ?? readmeBackedDatasets[0];

  const [form, setForm] = useState<GenImageFormState>(() => buildGenImageDefaults(dataset));
  const [outputName, setOutputName] = useState(buildDefaultOutputName(dataset.name));
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);

  useEffect(() => {
    setForm(buildGenImageDefaults(dataset));
    setOutputName(buildDefaultOutputName(dataset.name));
    setOutputType('virtual');
    setCommitNote('');
    setGeneratedFiles([]);
  }, [dataset]);

  const validationMessage = useMemo(() => getGenImageValidationMessage(form), [form]);
  const derivedDataset = useMemo<DerivedDatasetDraft>(
    () => ({
      role: 'generated',
      draft_id: `DRV-${dataset.id}-img`,
      assigned_id: null,
      parent_id: dataset.id,
      name: outputName,
      type: outputType,
      object_count: form.numberOfImages,
    }),
    [dataset.id, form.numberOfImages, outputName, outputType],
  );

  function handleCommit() {
    const payload = buildGenImagePayload(dataset, form, derivedDataset);
    const readmes = buildGenImageReadmes(payload);

    readmes.forEach((file) => {
      downloadText(file.filename, file.content);
    });

    setGeneratedFiles(readmes.map((file) => file.filename));
    setCommitNote(`${readmes.length} README file${readmes.length > 1 ? 's' : ''} generated successfully.`);
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="GenImage Configuration"
        description="Review the software/config source, adjust image-generation parameters, define the output dataset, and commit the transformation record."
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
              <h2>Input Datasets</h2>
              <span className="muted">1 selected</span>
            </div>
            <div className="dataset-summary-block dataset-summary-block--single">
              <InputDatasetSummary datasets={[dataset]} />
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Generation Parameters</h2>
            </div>
            <GenImageForm form={form} onChange={setForm} validationMessage={validationMessage} />
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
              <article className="dataset-summary-row">
                <input className="dataset-summary-row__input dataset-summary-row__input--name" onChange={(event) => setOutputName(event.target.value)} value={outputName} />
                <select className="dataset-summary-row__input" onChange={(event) => setOutputType(event.target.value as DatasetRecord['type'])} value={outputType}>
                  <option value="virtual">virtual</option>
                  <option value="physical">physical</option>
                </select>
                <span>{form.numberOfImages}</span>
                <span>Image</span>
                <span>{formatOutputMetadata(form)}</span>
              </article>
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
            <GenImageReview dataset={dataset} derivedDataset={derivedDataset} form={form} />
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

function buildDefaultOutputName(datasetName: string) {
  return datasetName.endsWith('_cfg') ? datasetName.replace(/_cfg$/i, '') : `${datasetName}_img`;
}

function formatOutputMetadata(form: GenImageFormState) {
  const shapeSentence = form.changedVariables.includes('shape') && form.shapeValues.length
    ? ` Shapes: ${form.shapeValues.join(', ')}.`
    : '';

  return `Generated image dataset. ${form.numberOfImages} monochrome ${form.imageWidth}x${form.imageHeight} images with white background.${shapeSentence} Changed variables: ${form.changedVariables.join(', ')}. Labels recorded per image: ${formatRecordedLabels(form)}.`;
}


function formatRecordedLabels(form: GenImageFormState) {
  const labels = new Set<string>();

  if (form.changedVariables.includes('shape')) {
    labels.add('shape_label');
  }

  form.changedVariables
    .filter((value) => value !== 'shape')
    .forEach((value) => labels.add(value));

  return Array.from(labels).join(', ') || 'n.a.';
}
