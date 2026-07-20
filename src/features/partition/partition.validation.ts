import type { PartitionFormState } from './partition.types';

export function getPartitionValidationMessage(form: PartitionFormState) {
  const total = form.trainRatio + form.validationRatio + form.testRatio;

  if (Math.abs(total - 1) > 0.001) {
    return 'Train, validation, and test ratios must add up to 1.00.';
  }

  if (!Number.isInteger(form.randomSeed)) {
    return 'Random seed must be an integer.';
  }

  if (form.strategy === 'stratified_split' && !form.stratifyBy.trim()) {
    return 'Please specify which field should be used for stratified splitting.';
  }

  if (form.strategy === 'time_based_split' && !form.timeField.trim()) {
    return 'Please specify the time field for time-based splitting.';
  }

  if (!form.commentSummary.trim()) {
    return 'Please add a short summary before committing the transformation.';
  }

  return null;
}
