import type { SegmentTSFormState } from '../../../features/segmentts/segmentTS.types';
import { getSegmentTSCalculations } from '../../../features/segmentts/segmentTSMetadata';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';
import { formatObjectCountDisplay } from '../../../lib/objectCount';

interface SegmentTSReviewProps {
  form: SegmentTSFormState;
  derivedDataset: DerivedDatasetDraft;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function SegmentTSReview({ form, derivedDataset }: SegmentTSReviewProps) {
  const calculations = getSegmentTSCalculations(form);

  return (
    <dl className="summary-list">
      <div className="summary-list__row"><dt>Operation</dt><dd>SegmentTS</dd></div>
      <div className="summary-list__row"><dt>Input datasets</dt><dd>1</dd></div>
      <div className="summary-list__row"><dt>Window length</dt><dd>{form.windowMs || 'n.a.'} ms</dd></div>
      <div className="summary-list__row"><dt>Stride</dt><dd>{form.strideMs || 'n.a.'} ms</dd></div>
      <div className="summary-list__row"><dt>Sampling frequency</dt><dd>{form.fsHz || 'n.a.'} Hz</dd></div>
      <div className="summary-list__row"><dt>Window samples</dt><dd>{calculations.windowSamples ?? 'n.a.'}</dd></div>
      <div className="summary-list__row"><dt>Stride samples</dt><dd>{calculations.strideSamples ?? 'n.a.'}</dd></div>
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
