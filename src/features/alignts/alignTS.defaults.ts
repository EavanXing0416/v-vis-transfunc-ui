import type { DatasetRecord } from '../datasets/dataset.types';
import type { AlignTSFormState } from './alignTS.types';

export const defaultAlignTSForm: AlignTSFormState = {
  tMin: 0,
  tMax: '',
  dt: 0.0001,
  method: 'linear',
  comments: '',
};

export function buildDefaultAlignTSForm(_dataset?: DatasetRecord): AlignTSFormState {
  return {
    ...defaultAlignTSForm,
  };
}
