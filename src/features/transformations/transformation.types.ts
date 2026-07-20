import type { DatasetRecord } from '../datasets/dataset.types';

export type TransformationStatus = 'draft' | 'ready' | 'running' | 'completed';

export interface TransformationComments {
  summary: string;
  details: string;
}

export interface DerivedDatasetDraft {
  role: 'train' | 'validation' | 'test';
  assigned_id: string | null;
}

export interface PartitionTransformationRecord {
  transformation_id: string;
  operation: 'Partition';
  status: TransformationStatus;
  created_at: string;
  input_datasets: Array<Pick<DatasetRecord, 'id' | 'name' | 'type'>>;
  partition: {
    strategy: 'random_split' | 'stratified_split' | 'time_based_split';
    train_ratio: number;
    validation_ratio: number;
    test_ratio: number;
    shuffle: boolean;
    random_seed: number;
  };
  comments: TransformationComments;
  derived_datasets: DerivedDatasetDraft[];
}
