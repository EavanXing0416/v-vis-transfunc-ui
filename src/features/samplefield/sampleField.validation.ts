import type { SampleFieldFormState } from './sampleField.types';

export function getSampleFieldValidationMessage(form: SampleFieldFormState) {
  if (!Number.isInteger(form.randomSeed)) {
    return 'Random seed must be an integer.';
  }

  if (!Number.isInteger(form.numberOfDataObjects) || form.numberOfDataObjects <= 0) {
    return 'Number of data objects must be a positive integer.';
  }

  if (!Number.isInteger(form.numberOfSamplesPerObject) || form.numberOfSamplesPerObject <= 0) {
    return 'Number of samples per object must be a positive integer.';
  }

  return null;
}
