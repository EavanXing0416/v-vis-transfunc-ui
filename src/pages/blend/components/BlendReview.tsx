import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { BlendFormState } from '../../../features/blend/blend.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface BlendReviewProps {
  datasets: DatasetRecord[];
  derivedDatasets: DerivedDatasetDraft[];
  form: BlendFormState;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function BlendReview({ datasets, derivedDatasets, form }: BlendReviewProps) {
  const primaryDataset = datasets.find((dataset) => dataset.id === form.primaryDatasetId) ?? null;
  const auxiliaryDatasets = datasets.filter((dataset) => form.auxiliaryDatasetIds.includes(dataset.id));

  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>Blend</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input datasets</dt>
        <dd>{datasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Primary dataset</dt>
        <dd>{primaryDataset?.name ?? 'n.a.'}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Auxiliary datasets</dt>
        <dd className="summary-list__value summary-list__value--wrap">{auxiliaryDatasets.map((dataset) => dataset.name).join(', ') || 'Not selected yet'}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Noise pool fraction</dt>
        <dd>{formatPercentage(form.auxiliaryFraction)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Selection rule</dt>
        <dd>{formatSelectionRule(form.selectionRule)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Assignment rule</dt>
        <dd>{formatAssignmentRule(form.assignmentRule)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Scaling rule</dt>
        <dd>Target SNR ({form.targetSnr})</dd>
      </div>
      <div className="summary-list__row">
        <dt>Merge rule</dt>
        <dd>Add signals</dd>
      </div>
      <div className="summary-list__row">
        <dt>Output datasets</dt>
        <dd>{derivedDatasets.length}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Comments</dt>
        <dd className="summary-list__value summary-list__value--wrap">{formatCommentPreview(form.comments)}</dd>
      </div>
    </dl>
  );
}

function formatCommentPreview(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Not added yet';
  }

  if (trimmed.length <= COMMENT_PREVIEW_LIMIT) {
    return trimmed;
  }

  return `${trimmed.slice(0, COMMENT_PREVIEW_LIMIT).trimEnd()}...`;
}

function formatPercentage(value: number) {
  const percentage = value * 100;
  const formatted = Number.isInteger(percentage) ? String(percentage) : percentage.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return `${formatted}%`;
}

function formatSelectionRule(value: BlendFormState['selectionRule']) {
  switch (value) {
    case 'all_objects':
      return 'All objects';
    case 'random_without_replacement':
    default:
      return 'Random without replacement';
  }
}

function formatAssignmentRule(value: BlendFormState['assignmentRule']) {
  switch (value) {
    case 'cyclic_reuse':
      return 'Cyclic reuse';
    case 'random_with_reuse':
    default:
      return 'Random with reuse';
  }
}
