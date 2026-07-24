import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { PartitionFormState } from '../../../features/partition/partition.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface ReviewSummaryProps {
  datasets: DatasetRecord[];
  form: PartitionFormState;
  derivedDatasets: DerivedDatasetDraft[];
}

const COMMENT_PREVIEW_LIMIT = 120;

export function ReviewSummary({ datasets, form, derivedDatasets }: ReviewSummaryProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>Partition</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input datasets</dt>
        <dd>{datasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Method</dt>
        <dd>{form.method === 'random' ? 'Random' : 'Chunk'}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Split ratio</dt>
        <dd>{form.trainRatio} / {form.validationRatio} / {form.testRatio}</dd>
      </div>
      {form.method === 'random' ? (
        <div className="summary-list__row">
          <dt>Random seed</dt>
          <dd>{form.randomSeed}</dd>
        </div>
      ) : null}
      <div className="summary-list__row">
        <dt>Derived datasets</dt>
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
