import type { ImputeTSFormState } from './imputeTS.types';

export function getImputeTSValidationMessage(form: ImputeTSFormState) {
  if (!form.fillStrategy.trim()) {
    return 'fill_strategy is required.';
  }

  if (!Number.isInteger(form.minValidSamples) || form.minValidSamples < 1) {
    return 'min_valid_samples must be a whole number of at least 1.';
  }

  return null;
}
