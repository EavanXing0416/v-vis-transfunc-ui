export interface PartitionFormState {
  method: 'random' | 'chunk';
  trainRatio: number;
  validationRatio: number;
  testRatio: number;
  randomSeed: number;
  comments: string;
}
