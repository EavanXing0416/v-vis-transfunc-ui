import type { AlignLabelFormState } from './alignLabel.types';

export function getAlignLabelValidationMessage(form: AlignLabelFormState) {
  if (!form.timeSeriesDatasetId) {
    return 'Select one TimeSeries input dataset.';
  }

  if (form.annotationSource === 'input_dataset' && !form.annotationDatasetId) {
    return 'Select one annotation input dataset.';
  }

  if (!form.labelFilePath.trim()) {
    return form.annotationSource === 'input_dataset'
      ? 'The selected annotation dataset does not provide a label file path.'
      : 'Enter an annotation JSON path.';
  }

  if (form.disruptionClipS.trim()) {
    const value = Number(form.disruptionClipS);
    if (!Number.isFinite(value) || value < 0) {
      return 'disruption_clip_s must be 0 or greater, or left empty.';
    }
  }

  if (form.annotationSpanMarginMs.trim()) {
    const value = Number(form.annotationSpanMarginMs);
    if (!Number.isFinite(value) || value < 0) {
      return 'annotation_span_margin_ms must be 0 or greater, or left empty.';
    }
  }

  return null;
}
