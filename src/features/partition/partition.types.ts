export interface PartitionFormState {
  strategy: 'random_split' | 'stratified_split' | 'time_based_split';
  trainRatio: number;
  validationRatio: number;
  testRatio: number;
  shuffle: boolean;
  randomSeed: number;
  commentSummary: string;
  commentDetails: string;
}
