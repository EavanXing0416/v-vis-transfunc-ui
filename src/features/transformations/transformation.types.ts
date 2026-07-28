import type { DatasetRecord } from '../datasets/dataset.types';
import type { SelectOperationDraft } from '../select/select.types';

export type TransformationStatus = 'draft' | 'ready' | 'running' | 'completed';

export interface DerivedDatasetDraft {
  role: 'train' | 'validation' | 'test' | 'sampled' | 'selected';
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

export interface SampleFieldTransformationRecord {
  transformation_id: string;
  operation: 'SampleField';
  status: TransformationStatus;
  created_at: string;
  input_datasets: Array<Pick<DatasetRecord, 'id' | 'name' | 'type' | 'objectCount' | 'metadataSummary'>>;
  sample_field: {
    random_seed: number;
    number_of_data_objects: number;
    number_of_samples_per_object: number;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export interface SelectTransformationRecord {
  transformation_id: string;
  operation: 'Select';
  status: TransformationStatus;
  created_at: string;
  input_datasets: Array<Pick<DatasetRecord, 'id' | 'name' | 'type' | 'objectCount' | 'metadataSummary'>>;
  select: {
    operations: SelectOperationDraft[];
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}
