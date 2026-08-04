import type { DatasetRecord } from '../datasets/dataset.types';
import type { BlendFormState } from './blend.types';

export function getBlendValidationMessage(datasets: DatasetRecord[], form: BlendFormState) {
  if (datasets.length < 2) {
    return 'Select at least 2 input datasets.';
  }

  if (!form.primaryDatasetId) {
    return 'Select one primary dataset.';
  }

  if (form.auxiliaryDatasetIds.length === 0) {
    return 'Select at least 1 auxiliary dataset.';
  }

  if (form.auxiliaryFraction <= 0 || form.auxiliaryFraction > 1) {
    return 'Auxiliary fraction must be greater than 0 and less than or equal to 1.';
  }

  if (!Number.isFinite(form.subsetSelectionSeed)) {
    return 'Subset selection seed must be a valid number.';
  }

  if (!Number.isFinite(form.assignmentSeed)) {
    return 'Assignment seed must be a valid number.';
  }

  if (!Number.isFinite(form.targetSnr)) {
    return 'Target SNR must be a valid number.';
  }

  return null;
}
