import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { SelectFormState } from '../../../features/select/select.types';

interface SelectReviewProps {
  dataset: DatasetRecord;
  form: SelectFormState;
  outputStats: {
    objectCount: number;
    objectCountEstimated: boolean;
    variableCount: number;
    labelCount: number;
  };
}

const COMMENT_PREVIEW_LIMIT = 120;

export function SelectReview({ dataset, form, outputStats }: SelectReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>Select</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input dataset</dt>
        <dd>{dataset.name}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Steps</dt>
        <dd>{form.operations.length}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Selection summary</dt>
        <dd className="summary-list__value summary-list__value--wrap">{formatSelectionSummary(form)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Output objects</dt>
        <dd>{formatObjectCount(outputStats.objectCount, outputStats.objectCountEstimated)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Output columns</dt>
        <dd>{outputStats.variableCount}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Label headings</dt>
        <dd>{outputStats.labelCount}</dd>
      </div>
      <div className="summary-list__row summary-list__row--wrap">
        <dt>Comments</dt>
        <dd className="summary-list__value summary-list__value--wrap">{formatCommentPreview(form.comments)}</dd>
      </div>
    </dl>
  );
}

function formatSelectionSummary(form: SelectFormState) {
  if (form.operations.length === 0) {
    return 'No operations added yet';
  }

  return form.operations
    .map((operation, index) => {
      const basis = operation.mode === 'labels'
        ? (operation.labelSelectionMode === 'proportion' ? `labels:${operation.field}:proportion` : `labels:${operation.field}`)
        : (!['in', 'notEquals'].includes(operation.operator) ? `column-values:${operation.field}` : 'columns');
      const suffix = index < form.operations.length - 1 ? ` ${operation.connectorToNext}` : '';
      return `${basis}${suffix}`;
    })
    .join(' ');
}

function formatObjectCount(objectCount: number, isEstimated: boolean) {
  if (!isEstimated) {
    return String(objectCount);
  }

  return `${objectCount} (estimated)`;
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
