import type { AlignTSFormState } from './alignTS.types';

export function getAlignTSValidationMessage(form: AlignTSFormState) {
  if (!Number.isFinite(form.tMin)) {
    return 'Start time t_min is required.';
  }

  if (!Number.isFinite(form.dt) || form.dt <= 0) {
    return 'Grid spacing dt must be greater than 0.';
  }

  if (form.tMax.trim()) {
    const parsed = Number(form.tMax);

    if (!Number.isFinite(parsed)) {
      return 'End time t_max must be a valid number or left empty.';
    }

    if (parsed <= form.tMin) {
      return 'End time t_max must be greater than t_min.';
    }
  }

  return null;
}
