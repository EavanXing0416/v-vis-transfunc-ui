import type { PartitionFormState } from './partition.types';

export const defaultPartitionForm: PartitionFormState = {
  method: 'random',
  trainRatio: 0.7,
  validationRatio: 0.15,
  testRatio: 0.15,
  randomSeed: 42,
  comments: '',
};
