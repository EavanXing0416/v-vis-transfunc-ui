import { formatObjectCountDisplay } from '../../../lib/objectCount';
import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { CropTSFormState } from '../../../features/cropts/cropTS.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface CropTSReviewProps {
  dataset: DatasetRecord;
  form: CropTSFormState;
  derivedDataset: DerivedDatasetDraft;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function CropTSReview({ form, derivedDataset }: CropTSReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row"><dt>Operation</dt><dd>CropTS</dd></div>
      <div className="summary-list__row"><dt>Input datasets</dt><dd>1</dd></div>
      <div className="summary-list__row"><dt>ip threshold</dt><dd>{form.ipThresholdKa} kA</dd></div>
      <div className="summary-list__row"><dt>Flat-top min frac</dt><dd>{form.flattopMinFrac}</dd></div>
      <div className="summary-list__row"><dt>Trim start</dt><dd>{form.flattopTrimStartFrac.trim() || 'n.a.'}</dd></div>
      <div className="summary-list__row"><dt>Trim end</dt><dd>{form.flattopTrimEndFrac.trim() || 'n.a.'}</dd></div>
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
