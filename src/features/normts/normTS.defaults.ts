import type { DatasetRecord } from '../datasets/dataset.types';
import type { NormTSFormState } from './normTS.types';

export const defaultNormTSForm: NormTSFormState = {
  method: 'robust_zscore',
  epsilon: '0.00000001',
  fitScope: 'per_shot',
  comments: '',
};

export function buildDefaultNormTSForm(_dataset?: DatasetRecord): NormTSFormState {
  return { ...defaultNormTSForm };
}
