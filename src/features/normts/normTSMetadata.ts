import type { DatasetRecord } from '../datasets/dataset.types';
import type { NormTSFormState } from './normTS.types';

type NormTSMetadataParams = Pick<NormTSFormState, 'method' | 'fitScope'> & {
  epsilon: string | number;
};

export function buildNormTSMetadataSummary(form: NormTSMetadataParams) {
  return `Channel-wise normalized time-series signals. Each data object represents one shot. Method = ${form.method}, epsilon = ${form.epsilon}, fit scope = ${form.fitScope}.`;
}

export function getNormTSOutputObjectCount(dataset: DatasetRecord | null) {
  return dataset?.objectCount ?? Number.NaN;
}
