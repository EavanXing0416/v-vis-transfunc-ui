import type { DatasetRecord } from '../datasets/dataset.types';
import type { CropTSFormState } from './cropTS.types';

export const defaultCropTSForm: CropTSFormState = {
  ipThresholdKa: 100,
  flattopMinFrac: 0.8,
  flattopTrimStartFrac: '',
  flattopTrimEndFrac: '',
  comments: '',
};

export function buildDefaultCropTSForm(_dataset?: DatasetRecord): CropTSFormState {
  return {
    ...defaultCropTSForm,
  };
}
