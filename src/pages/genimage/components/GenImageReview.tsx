import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { GenImageFormState } from '../../../features/genimage/genImage.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface GenImageReviewProps {
  dataset: DatasetRecord;
  form: GenImageFormState;
  derivedDataset: DerivedDatasetDraft;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function GenImageReview({ dataset, form, derivedDataset }: GenImageReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row"><dt>Operation</dt><dd>GenImage</dd></div>
      <div className="summary-list__row"><dt>Input dataset</dt><dd>{dataset.name}</dd></div>
      <div className="summary-list__row"><dt>Output dataset</dt><dd>{derivedDataset.name}</dd></div>
      <div className="summary-list__row"><dt>Changed variables</dt><dd>{getChangedVariables(form).join(', ') || 'n.a.'}</dd></div>
      <div className="summary-list__row"><dt>Fixed variables</dt><dd>{getFixedVariables(form).join(', ') || 'n.a.'}</dd></div>
      <div className="summary-list__row"><dt>Shape config</dt><dd>{form.variableModes.shape === 'changed' ? form.changedShapeValues.join(', ') || 'n.a.' : form.fixedShapeValue}</dd></div>
      <div className="summary-list__row"><dt>Images</dt><dd>{form.numberOfImages}</dd></div>
      <div className="summary-list__row"><dt>Image size</dt><dd>{form.imageWidth}x{form.imageHeight}</dd></div>
      <div className="summary-list__row"><dt>Sampling</dt><dd>{form.samplingRule}</dd></div>
      <div className="summary-list__row summary-list__row--wrap"><dt>Metadata</dt><dd className="summary-list__value summary-list__value--wrap">{formatOutputMetadata(form)}</dd></div>
      <div className="summary-list__row summary-list__row--wrap"><dt>Comments</dt><dd className="summary-list__value summary-list__value--wrap">{formatCommentPreview(form.comments)}</dd></div>
    </dl>
  );
}

function getChangedVariables(form: GenImageFormState) {
  return Object.entries(form.variableModes).filter(([, mode]) => mode === 'changed').map(([key]) => key);
}

function getFixedVariables(form: GenImageFormState) {
  return Object.entries(form.variableModes).filter(([, mode]) => mode === 'fixed').map(([key]) => key);
}

function formatOutputMetadata(form: GenImageFormState) {
  return `Generated image dataset. ${form.numberOfImages} ${form.imageWidth}x${form.imageHeight} images. Changed variables: ${getChangedVariables(form).join(', ') || 'n.a.'}. Fixed variables: ${getFixedVariables(form).join(', ') || 'n.a.'}. ${form.variableModes.shape === 'changed' ? `Shapes: ${form.changedShapeValues.join(', ') || 'n.a.'}.` : `Fixed shape: ${form.fixedShapeValue}.`} Labels recorded per image: ${formatRecordedLabels(form)}.`;
}

function formatRecordedLabels(form: GenImageFormState) {
  const labels = new Set<string>();
  if (form.variableModes.shape === 'changed') labels.add('shape_label');
  getChangedVariables(form).filter((value) => value !== 'shape').forEach((value) => labels.add(value));
  return Array.from(labels).join(', ') || 'n.a.';
}

function formatCommentPreview(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 'Not added yet';
  if (trimmed.length <= COMMENT_PREVIEW_LIMIT) return trimmed;
  return `${trimmed.slice(0, COMMENT_PREVIEW_LIMIT).trimEnd()}...`;
}
