import type { DatasetRecord } from '../datasets/dataset.types';
import type { CropTSFormState } from './cropTS.types';

export function buildCropTSMetadataSummary(form: CropTSFormState) {
  const startTrim = form.flattopTrimStartFrac.trim() || 'n.a.';
  const endTrim = form.flattopTrimEndFrac.trim() || 'n.a.';
  return `Cropped time-series signals. Flat-top detection on ip with threshold ${form.ipThresholdKa} kA and flattop_min_frac = ${form.flattopMinFrac}. Trim start = ${startTrim}, trim end = ${endTrim}.`;
}

export function getCropTSOutputObjectCount(dataset: DatasetRecord | null) {
  return dataset?.objectCount ?? Number.NaN;
}
