import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import { formatStoredComponents, formatWindowType } from '../../../features/stft/stftMetadata';
import type { STFTFormState } from '../../../features/stft/stft.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface STFTReviewProps {
  dataset: DatasetRecord;
  form: STFTFormState;
  derivedDataset: DerivedDatasetDraft;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function STFTReview({ dataset, form, derivedDataset }: STFTReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>STFT</dd>
      </div>
      <div className="summary-list__row">
        <dt>Input datasets</dt>
        <dd>1</dd>
      </div>
      <div className="summary-list__row">
        <dt>Output datasets</dt>
        <dd>{derivedDataset ? 1 : 0}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Sample rate</dt>
        <dd>{form.sampleRate}</dd>
      </div>
      <div className="summary-list__row">
        <dt>FFT size</dt>
        <dd>{form.fftSize}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Window / hop</dt>
        <dd>{form.windowLength} / {form.hopLength}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Window type</dt>
        <dd>{formatWindowType(form.windowType)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Stored components</dt>
        <dd>{formatStoredComponents(form.storedComponents)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Label handling</dt>
        <dd>{form.applyToLabels ? 'Transformed with input' : 'Preserved from input'}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Output</dt>
        <dd>{dataset.name}_stft</dd>
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
