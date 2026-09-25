import type { AlignLabelFormState } from '../../../features/alignlabel/alignLabel.types';
import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';
import { formatObjectCountDisplay } from '../../../lib/objectCount';

interface AlignLabelReviewProps {
  timeSeriesDataset: DatasetRecord;
  annotationDataset: DatasetRecord | null;
  form: AlignLabelFormState;
  derivedDataset: DerivedDatasetDraft;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function AlignLabelReview({ timeSeriesDataset, annotationDataset, form, derivedDataset }: AlignLabelReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row"><dt>Operation</dt><dd>AlignLabel</dd></div>
      <div className="summary-list__row"><dt>Time-series dataset</dt><dd>{timeSeriesDataset.name}</dd></div>
      <div className="summary-list__row"><dt>Annotation source</dt><dd>{form.annotationSource === 'input_dataset' ? 'Input dataset' : 'Input path'}</dd></div>
      <div className="summary-list__row"><dt>Annotation dataset</dt><dd>{annotationDataset?.name ?? 'n.a.'}</dd></div>
      <div className="summary-list__row summary-list__row--wrap"><dt>Label file</dt><dd className="summary-list__value summary-list__value--wrap">{form.labelFilePath || 'n.a.'}</dd></div>
      <div className="summary-list__row"><dt>Event type</dt><dd>{form.eventType}</dd></div>
      <div className="summary-list__row"><dt>Labelling rule</dt><dd>{form.labellingRule}</dd></div>
      <div className="summary-list__row"><dt>Disruption clip</dt><dd>{form.disruptionClipS || 'n.a.'}</dd></div>
      <div className="summary-list__row"><dt>Span margin</dt><dd>{form.annotationSpanMarginMs || 'n.a.'}</dd></div>
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
