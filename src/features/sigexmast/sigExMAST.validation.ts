import type { SigExMASTFormState } from './sigExMAST.types';

export function getSigExMASTValidationMessage(form: SigExMASTFormState) {
  if (form.signals.length === 0) {
    return 'Select at least one signal key.';
  }

  if (form.shotSource === 'input_dataset' && !form.selectedShotDatasetId) {
    return 'Select one input shot-list dataset.';
  }

  if (form.shotSource === 'input_path' && !form.shotPath.trim()) {
    return 'Enter a shot-list path.';
  }

  if (form.shotSource === 'manual' && parseManualShotIds(form.manualShotIds).length === 0) {
    return 'Enter at least one shot ID.';
  }

  return null;
}

export function parseManualShotIds(value: string) {
  return value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeSignalKey(value: string) {
  return value.trim();
}
