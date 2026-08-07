import { formatSelectedComponents } from '../../../features/feaexspectrogram/feaExSpectrogramMetadata';
import type { FeaExSpectrogramFormState } from '../../../features/feaexspectrogram/feaExSpectrogram.types';
import type { DerivedDatasetDraft } from '../../../features/transformations/transformation.types';

interface FeaExSpectrogramReviewProps {
  form: FeaExSpectrogramFormState;
  derivedDataset: DerivedDatasetDraft;
}

const COMMENT_PREVIEW_LIMIT = 120;

export function FeaExSpectrogramReview({ form, derivedDataset }: FeaExSpectrogramReviewProps) {
  return (
    <dl className="summary-list">
      <div className="summary-list__row">
        <dt>Operation</dt>
        <dd>FeaExSpectrogram</dd>
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
        <dt>Selected components</dt>
        <dd>{formatSelectedComponents(form.selectedComponents)}</dd>
      </div>
      <div className="summary-list__row">
        <dt>Label handling</dt>
        <dd>{form.preserveLabelAssociations ? 'Preserved from STFT input' : 'Excluded from output'}</dd>
      </div>
      {form.enableAdvancedExtraction && form.advancedInstruction.trim() ? (
        <div className="summary-list__row summary-list__row--wrap">
          <dt>Advanced instruction</dt>
          <dd className="summary-list__value summary-list__value--wrap">{form.advancedInstruction.trim()}</dd>
        </div>
      ) : null}
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
