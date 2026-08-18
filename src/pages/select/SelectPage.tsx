import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ReadmePreviewButton } from '../../components/datasets/ReadmePreviewButton';
import { PageHeader } from '../../components/layout/PageHeader';
import { buildDatasetReadmePreview } from '../../features/datasets/buildDatasetReadmePreview';
import { buildSelectOutputSelectMetadata, getSelectColumnNames } from '../../features/datasets/selectMetadata';
import { getDatasetDataObjectType } from '../../features/datasets/dataObjectType';
import type { DatasetRecord } from '../../features/datasets/dataset.types';
import { buildSelectPayload } from '../../features/select/buildSelectPayload';
import { buildSelectReadmes } from '../../features/select/buildSelectReadmes';
import { buildDefaultSelectForm } from '../../features/select/select.defaults';
import { getSelectDraftValidationMessage, getSelectValidationMessage } from '../../features/select/select.validation';
import type { SelectDatasetSchema, SelectFormState } from '../../features/select/select.types';
import type { DerivedDatasetDraft } from '../../features/transformations/transformation.types';
import { downloadText } from '../../lib/downloadText';
import { routes } from '../../lib/routes';
import { mockDatasets } from '../../mocks/datasets';
import { getSelectSchema } from '../../mocks/selectSchemas';
import { CommentEditor } from '../partition/components/CommentEditor';
import { SelectForm } from './components/SelectForm';
import { SelectReview } from './components/SelectReview';

interface SelectLocationState {
  selectedDatasets?: DatasetRecord[];
}

interface SelectOutputStats {
  objectCount: number;
  objectCountEstimated: boolean;
  variableCount: number;
  labelCount: number;
}

export function SelectPage() {
  const location = useLocation();
  const locationState = location.state as SelectLocationState | null;
  const dataset = (locationState?.selectedDatasets?.[0] ?? mockDatasets[0]) as DatasetRecord;
  const schema = useMemo(() => getSelectSchema(dataset), [dataset]);
  const [form, setForm] = useState(() => buildDefaultSelectForm(dataset.name, schema));
  const [commitNote, setCommitNote] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const [outputType, setOutputType] = useState<DatasetRecord['type']>('virtual');

  const outputStats = useMemo(() => deriveOutputStats(dataset, schema, form), [dataset, schema, form]);
  const validationMessage = useMemo(() => getSelectValidationMessage(form), [form]);
  const draftValidationMessage = useMemo(() => getSelectDraftValidationMessage(form.draftStep, schema), [form.draftStep, schema]);
  const derivedDataset = useMemo<DerivedDatasetDraft>(
    () => ({
      role: 'selected',
      draft_id: `DRV-${dataset.id}-sel`,
      assigned_id: null,
      parent_id: dataset.id,
      name: form.outputName,
      type: outputType,
      object_count: outputStats.objectCount,
    }),
    [dataset.id, form.outputName, outputStats.objectCount, outputType],
  );
  const previewReadme = useMemo(() => {
    const payload = buildSelectPayload(dataset, form, derivedDataset);
    return buildSelectReadmes(payload, outputStats)[0]?.content ?? '';
  }, [dataset, form, derivedDataset, outputStats]);

  function handleFormChange(nextForm: SelectFormState) {
    setForm(nextForm);
  }

  function handleOutputNameChange(value: string) {
    setForm((current) => ({
      ...current,
      outputName: value,
    }));
  }

  function handleCommit() {
    const payload = buildSelectPayload(dataset, form, derivedDataset);
    const readmes = buildSelectReadmes(payload, outputStats);

    readmes.forEach((file) => {
      downloadText(file.filename, file.content);
    });

    setGeneratedFiles(readmes.map((file) => file.filename));
    setCommitNote(`${readmes.length} README file${readmes.length > 1 ? 's' : ''} generated successfully.`);
  }

  return (
    <main className="app-shell">
      <PageHeader
        title="Select Configuration"
        description="Review the selected dataset, add across or within selection operations, and commit the transformation record."
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
              <span className="muted">selected</span>
            </div>
            <div className="dataset-summary-table dataset-summary-table--aligned">
              <div className="dataset-summary-table__head">
                <span>Name</span>
                <span>Type</span>
                <span>Data Objects</span>
                <span>Data object type</span>
                <span>Metadata</span>
              </div>
              <article className="dataset-summary-row dataset-summary-row--with-info">
                <span className="dataset-summary-row__name">{dataset.name}</span>
                <span className="dataset-summary-row__type">{dataset.type}</span>
                <span>{dataset.objectCount}</span>
                <span>{getDatasetDataObjectType(dataset)}</span>
                <span>{dataset.metadataSummary}</span>
                <span className="dataset-summary-row__icon">
                  <ReadmePreviewButton content={buildDatasetReadmePreview(dataset)} title={dataset.name} />
                </span>
              </article>
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Selection Builder</h2>
            </div>
            <SelectForm form={form} onChange={handleFormChange} schema={schema} draftValidationMessage={draftValidationMessage} />
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
              <article className="dataset-summary-row dataset-summary-row--with-info">
                <input className="dataset-summary-row__input dataset-summary-row__input--name" onChange={(event) => handleOutputNameChange(event.target.value)} value={form.outputName} />
                <select className="dataset-summary-row__input" onChange={(event) => setOutputType(event.target.value as DatasetRecord['type'])} value={outputType}>
                  <option value="virtual">virtual</option>
                  <option value="physical">physical</option>
                </select>
                <span>{formatObjectCount(outputStats)}</span>
                <span>{getDatasetDataObjectType(dataset)}</span>
                <span>{formatOutputMetadata(form)}</span>
              </article>
            </div>
          </div>

          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Comments</h2>
            </div>
            <CommentEditor form={form} onChange={handleFormChange} />
          </div>
        </div>

        <aside className="panel">
          <div className="panel__section panel__section--compact">
            <div className="section-title">
              <h2>Review</h2>
            </div>
            <SelectReview dataset={dataset} form={form} outputStats={outputStats} />
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
            {validationMessage ? <p className="field-error" style={{ marginTop: '8px' }}>{validationMessage}</p> : null}
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

function selectLabelClassesByProportion(classes: Array<{ name: string; count: number }>, proportionValue: string, seedValue: string) {
  const proportion = Number(proportionValue);
  const seed = Number(seedValue);

  if (!Number.isFinite(proportion) || proportion <= 0 || !classes.length) {
    return [];
  }

  const targetCount = Math.max(1, Math.min(classes.length, Math.round(classes.length * proportion)));
  const normalizedSeed = Number.isInteger(seed) ? seed : 42;

  const scored = classes.map((item, index) => ({
    item,
    score: hashLabelSelection(`${item.name}:${index}`, normalizedSeed),
  }));

  scored.sort((left, right) => left.score - right.score);
  return scored.slice(0, targetCount).map((entry) => entry.item);
}

function hashLabelSelection(value: string, seed: number) {
  let hash = seed || 42;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33 + value.charCodeAt(index)) % 2147483647;
  }

  return hash;
}

function deriveOutputStats(dataset: DatasetRecord, schema: SelectDatasetSchema, form: SelectFormState): SelectOutputStats {
  const variableCount = getSelectColumnNames(buildSelectOutputSelectMetadata(dataset, form.operations)).length || dataset.variableCount;

  if (form.operations.length === 1) {
    const step = form.operations[0];

    if (!step) {
      return {
        objectCount: dataset.objectCount,
        objectCountEstimated: false,
        variableCount,
        labelCount: dataset.labelCount,
      };
    }

    if (step.scope === 'across' && step.mode === 'labels') {
      if (step.labelSelectionMode === 'proportion') {
        const proportion = Number(step.labelProportion);
        const normalizedProportion = Number.isFinite(proportion) ? Math.min(1, Math.max(0, proportion)) : 0;
        const estimatedObjectCount = Math.round(dataset.objectCount * normalizedProportion);

        return {
          objectCount: estimatedObjectCount,
          objectCountEstimated: true,
          variableCount,
          labelCount: dataset.labelCount,
        };
      }

      const selectedClasses = (schema.labelClassesByHeading[step.field] ?? []).filter((item) => step.values.includes(item.name));
      const objectCount = selectedClasses.reduce((sum, item) => sum + item.count, 0);

      return {
        objectCount: objectCount || dataset.objectCount,
        objectCountEstimated: false,
        variableCount,
        labelCount: dataset.labelCount,
      };
    }
  }

  return {
    objectCount: dataset.objectCount,
    objectCountEstimated: false,
    variableCount,
    labelCount: dataset.labelCount,
  };
}

function formatOutputMetadata(form: SelectFormState) {
  if (form.operations.length === 0) {
    return 'Pending selection operations';
  }

  return `Derived from ${form.operations.length} selection step${form.operations.length === 1 ? '' : 's'}`;
}

function formatObjectCount(stats: SelectOutputStats) {
  if (!stats.objectCountEstimated) {
    return String(stats.objectCount);
  }

  return `${stats.objectCount} (estimated)`;
}
