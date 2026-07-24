import type { PartitionFormState } from './partition.types';

export function getPartitionValidationMessage(form: PartitionFormState) {
  const ratios = [form.trainRatio, form.validationRatio, form.testRatio];
  const total = ratios.reduce((sum, value) => sum + value, 0);

  if (ratios.some((value) => value < 0 || value >= 1)) {
    return 'Each ratio must be greater than or equal to 0 and less than 1.';
  }

  if (Math.abs(total - 1) > 0.001) {
    return 'Train, validation, and test ratios must add up to 1.00.';
  }

  if (!Number.isInteger(form.randomSeed)) {
    return 'Random seed must be an integer.';
  }

  return null;
}
