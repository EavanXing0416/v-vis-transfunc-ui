import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { SampleFieldFormState } from '../../../features/samplefield/sampleField.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface SampleFieldReviewProps {
  datasets: DatasetRecord[];
  form: SampleFieldFormState;
  derivedDatasets: DerivedDatasetDraft[];
}

const COMMENT_PREVIEW_LIMIT = 120;

export function SampleFieldReview({ datasets, form, derivedDatasets }: SampleFieldReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>SampleField</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input datasets</dt>
        <dd>{datasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Derived datasets</dt>
        <dd>{derivedDatasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Random seed</dt>
        <dd>{form.randomSeed}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Data objects</dt>
        <dd>{form.numberOfDataObjects}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Samples per object</dt>
        <dd>{form.numberOfSamplesPerObject}</dd>
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
