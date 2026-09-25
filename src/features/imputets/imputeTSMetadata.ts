import type { DatasetRecord } from '../datasets/dataset.types';
import type { ImputeTSFormState } from './imputeTS.types';

export function buildImputeTSMetadataSummary(form: ImputeTSFormState) {
  return `Missing values imputed in time-series signals. Each data object represents one shot. Fill strategy = ${form.fillStrategy}, minimum valid samples = ${form.minValidSamples}.`;
}

export function getImputeTSOutputObjectCount(dataset: DatasetRecord | null) {
  return dataset?.objectCount ?? Number.NaN;
}
