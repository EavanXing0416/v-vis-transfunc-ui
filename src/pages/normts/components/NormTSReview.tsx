import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { NormTSFormState } from '../../../features/normts/normTS.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';
import { formatObjectCountDisplay } from '../../../lib/objectCount';

interface NormTSReviewProps {
  dataset: DatasetRecord;
  form: NormTSFormState;
  derivedDataset: DerivedDatasetDraft;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function NormTSReview({ form, derivedDataset }: NormTSReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row"><dt>Operation</dt><dd>NormTS</dd></div>
      <div className="summary-list__row"><dt>Input datasets</dt><dd>1</dd></div>
      <div className="summary-list__row"><dt>Method</dt><dd>{form.method}</dd></div>
      <div className="summary-list__row"><dt>Epsilon</dt><dd>{form.epsilon}</dd></div>
      <div className="summary-list__row"><dt>Fit scope</dt><dd>{form.fitScope}</dd></div>
      <div className="summary-list__row"><dt>Data objects</dt><dd>{formatObjectCountDisplay(derivedDataset.object_count)}</dd></div>
      <div className="summary-list__row"><dt>Dataset name</dt><dd>{derivedDataset.name}</dd></div>
      <div className="summary-list__row summary-list__row--wrap"><dt>Comments</dt><dd className="summary-list__value summary-list__value--wrap">{formatCommentPreview(form.comments)}</dd></div>
    </dl>
  );
}

function formatCommentPreview(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 'Not added yet';
  if (trimmed.length <= COMMENT_PREVIEW_LIMIT) return trimmed;
  return `${trimmed.slice(0, COMMENT_PREVIEW_LIMIT).trimEnd()}...`;
}
