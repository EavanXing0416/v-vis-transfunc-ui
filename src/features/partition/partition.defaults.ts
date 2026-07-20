import type { PartitionFormState } from './partition.types';

export const defaultPartitionForm: PartitionFormState = {
  strategy: 'random_split',
  trainRatio: 0.7,
  validationRatio: 0.15,
  testRatio: 0.15,
  shuffle: true,
  randomSeed: 42,
  stratifyBy: 'label',
  timeField: 'time_stamp',
  keepTemporalOrder: true,
  commentSummary: '',
  commentDetails: '',
};
