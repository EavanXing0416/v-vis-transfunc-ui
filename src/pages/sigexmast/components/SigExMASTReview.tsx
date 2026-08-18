import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { SigExMASTFormState } from '../../../features/sigexmast/sigExMAST.types';
import { formatObjectCountDisplay } from '../../../lib/objectCount';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface SigExMASTReviewProps {
  datasets: DatasetRecord[];
  form: SigExMASTFormState;
  derivedDataset: DerivedDatasetDraft;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function SigExMASTReview({ datasets, form, derivedDataset }: SigExMASTReviewProps) {
  const shotListDataset = datasets.find((dataset) => dataset.id === form.selectedShotDatasetId) ?? null;

  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>SigExMAST</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input datasets</dt>
        <dd>{datasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Campaign</dt>
        <dd>{form.campaign}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Shot source</dt>
        <dd>{formatShotSource(form)}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Signals</dt>
        <dd className="summary-list__value summary-list__value--wrap">{form.signals.join(', ')}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Shots</dt>
        <dd>{formatObjectCountDisplay(form.shotSource === 'input_dataset' ? (shotListDataset?.objectCount ?? derivedDataset.object_count) : derivedDataset.object_count)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Dataset name</dt>
        <dd>{derivedDataset.name}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Comments</dt>
        <dd className="summary-list__value summary-list__value--wrap">{formatCommentPreview(form.comments)}</dd>
      </div>
    </dl>
  );
}

function formatShotSource(form: SigExMASTFormState) {
  if (form.shotSource === 'input_dataset') {
    return 'Input dataset';
  }
  if (form.shotSource === 'input_path') {
    return form.shotPath.trim() || 'Input path';
  }
  return 'Manual shot IDs';
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
