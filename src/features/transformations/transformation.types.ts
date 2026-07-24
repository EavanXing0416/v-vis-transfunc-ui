import type { DatasetRecord } from '../datasets/dataset.types';

export type TransformationStatus = 'draft' | 'ready' | 'running' | 'completed';

export interface DerivedDatasetDraft {
  role: 'train' | 'validation' | 'test';
  draft_id: string;
  assigned_id: string | null;
  parent_id: string;
  name: string;
  object_count: number;
}

export interface PartitionTransformationRecord {
  transformation_id: string;
  operation: 'Partition';
  status: TransformationStatus;
  created_at: string;
  input_datasets: Array<Pick<DatasetRecord, 'id' | 'name' | 'type' | 'objectCount' | 'metadataSummary'>>;
  partition: {
    method: 'random' | 'chunk';
    train_ratio: number;
    validation_ratio: number;
    test_ratio: number;
    random_seed: number;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}
