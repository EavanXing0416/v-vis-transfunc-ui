import type { PartitionFormState } from './partition.types';

export function getPartitionValidationMessage(form: PartitionFormState) {
  const total = form.trainRatio + form.validationRatio + form.testRatio;

  if (Math.abs(total - 1) > 0.001) {
    return 'Train, validation, and test ratios must add up to 1.00.';
  }

  if (!Number.isInteger(form.randomSeed)) {
    return 'Random seed must be an integer.';
  }

  if (!form.commentSummary.trim()) {
    return 'Please add a short summary before committing the transformation.';
  }

  return null;
}
