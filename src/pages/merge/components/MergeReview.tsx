import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { MergeFormState } from '../../../features/merge/merge.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface MergeReviewProps {
  datasets: DatasetRecord[];
  derivedDatasets: DerivedDatasetDraft[];
  form: MergeFormState;
  orderedDatasetNames: string[];
}

const COMMENT_PREVIEW_LIMIT = 120;

export function MergeReview({ datasets, derivedDatasets, form, orderedDatasetNames }: MergeReviewProps) {
  const primaryDataset = datasets.find((dataset) => dataset.id === form.primaryDatasetId);
  const labelDatasets = datasets.filter((dataset) => form.labelDatasetIds.includes(dataset.id));
  const labelSourceNames = [
    ...(form.duplicatePrimaryDataset && primaryDataset ? [primaryDataset.name] : []),
    ...labelDatasets.map((dataset) => dataset.name),
  ];
  const labelHeadings = [
    ...(form.duplicatePrimaryDataset ? [form.labelHeadingsBySource.duplicate_primary].filter(Boolean) : []),
    ...labelDatasets.map((dataset) => form.labelHeadingsBySource[dataset.id]).filter(Boolean),
  ];

  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>{form.mergeMethod === 'complex' ? 'AddLabel' : 'Merge'}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input datasets</dt>
        <dd>{datasets.length}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Merge method</dt>
        <dd>{form.mergeMethod === 'complex' ? 'Complex' : 'Data objects'}</dd>
      </div>
      {form.mergeMethod === 'data_objects' ? (
        <>
          <div className="summary-list__row">
            <dt>Mode</dt>
            <dd>{form.mode}</dd>
          </div>
          <div className="summary-list__row summary-list__row--wrap">
            <dt>Order</dt>
            <dd className="summary-list__value summary-list__value--wrap">{orderedDatasetNames.join(' -> ')}</dd>
          </div>
          {form.mode === 'reshuffle' ? (
            <div className="summary-list__row">
              <dt>Random seed</dt>
              <dd>{form.randomSeed}</dd>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="summary-list__row">
            <dt>Primary dataset</dt>
            <dd>{primaryDataset?.name ?? 'n.a.'}</dd>
          </div>
          <div className="summary-list__row summary-list__row--wrap">
            <dt>Label sources</dt>
            <dd className="summary-list__value summary-list__value--wrap">{labelSourceNames.join(', ') || 'Not selected yet'}</dd>
          </div>
          <div className="summary-list__row summary-list__row--wrap">
            <dt>Label headings</dt>
            <dd className="summary-list__value summary-list__value--wrap">{labelHeadings.join(', ') || 'Not added yet'}</dd>
          </div>
          <div className="summary-list__row">
            <dt>Association rule</dt>
            <dd>{form.associationRule}</dd>
          </div>
        </>
      )}
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
