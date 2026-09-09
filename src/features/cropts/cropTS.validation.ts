import type { CropTSFormState } from './cropTS.types';

function isUnitFraction(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function getCropTSValidationMessage(form: CropTSFormState) {
  if (!Number.isFinite(form.ipThresholdKa) || form.ipThresholdKa < 0) {
    return 'ip_threshold_ka must be 0 or greater.';
  }

  if (!isUnitFraction(form.flattopMinFrac) || form.flattopMinFrac <= 0) {
    return 'flattop_min_frac must be greater than 0 and at most 1.';
  }

  if (form.flattopTrimStartFrac.trim()) {
    const parsed = Number(form.flattopTrimStartFrac);
    if (!isUnitFraction(parsed)) {
      return 'flattop_trim_start_frac must be between 0 and 1, or left empty.';
    }
  }

  if (form.flattopTrimEndFrac.trim()) {
    const parsed = Number(form.flattopTrimEndFrac);
    if (!isUnitFraction(parsed)) {
      return 'flattop_trim_end_frac must be between 0 and 1, or left empty.';
    }
  }

  if (form.flattopTrimStartFrac.trim() && form.flattopTrimEndFrac.trim()) {
    const start = Number(form.flattopTrimStartFrac);
    const end = Number(form.flattopTrimEndFrac);
    if (start + end >= 1) {
      return 'Start and end trim fractions together must stay below 1.';
    }
  }

  return null;
}
