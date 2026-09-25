import type { DatasetRecord } from '../datasets/dataset.types';
import type { ImputeTSFormState } from './imputeTS.types';

export const defaultImputeTSForm: ImputeTSFormState = {
  fillStrategy: 'ffill_then_zero',
  minValidSamples: 1,
  comments: '',
};

export function buildDefaultImputeTSForm(_dataset?: DatasetRecord): ImputeTSFormState {
  return { ...defaultImputeTSForm };
}
