import type { NormTSFormState } from './normTS.types';

export function getNormTSValidationMessage(form: NormTSFormState) {
  if (!form.epsilon.trim()) {
    return 'epsilon is required.';
  }

  const epsilon = Number(form.epsilon);
  if (!Number.isFinite(epsilon) || epsilon <= 0) {
    return 'epsilon must be greater than 0.';
  }

  return null;
}
