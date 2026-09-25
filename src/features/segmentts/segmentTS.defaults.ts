import type { DatasetRecord } from '../datasets/dataset.types';
import type { SegmentTSFormState } from './segmentTS.types';

export const defaultSegmentTSForm: SegmentTSFormState = {
  windowMs: '20',
  strideMs: '5',
  fsHz: '10000',
  comments: '',
};

export function buildDefaultSegmentTSForm(_dataset?: DatasetRecord): SegmentTSFormState {
  return { ...defaultSegmentTSForm };
}
