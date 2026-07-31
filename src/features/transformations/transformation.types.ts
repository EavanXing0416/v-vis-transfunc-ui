import type { DatasetRecord } from '../datasets/dataset.types';
import type { SelectOperationDraft } from '../select/select.types';

export type TransformationStatus = 'draft' | 'ready' | 'running' | 'completed';

type TransformationInputDataset = Pick<
  DatasetRecord,
  'id' | 'name' | 'type' | 'objectCount' | 'metadataSummary' | 'modality' | 'dataObjectType'
>;

export interface DerivedDatasetDraft {
  role: 'train' | 'validation' | 'test' | 'sampled' | 'selected' | 'simulated';
  draft_id: string;
  assigned_id: string | null;
  parent_id: string;
  name: string;
  type: DatasetRecord['type'];
  object_count: number;
}

export interface PartitionTransformationRecord {
  transformation_id: string;
  operation: 'Partition';
  status: TransformationStatus;
  created_at: string;
  input_datasets: TransformationInputDataset[];
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
  input_datasets: TransformationInputDataset[];
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
  input_datasets: TransformationInputDataset[];
  select: {
    operations: SelectOperationDraft[];
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export interface SimulatePDETransformationRecord {
  transformation_id: string;
  operation: 'SimulatePDE';
  status: TransformationStatus;
  created_at: string;
  input_datasets: TransformationInputDataset[];
  simulate_pde: {
    solver_method: 'fdm' | 'fem' | 'spectral';
    equation_type: 'second_order_hyperbolic' | 'elliptic' | 'parabolic';
    spatial_dimension: '1d' | '2d';
    has_temporal_dimension: boolean;
    boundary_condition: 'dirichlet' | 'neumann' | 'robin' | 'periodic';
    x_range: [number, number];
    x_step: number;
    y_range: [number, number] | null;
    y_step: number | null;
    t_range: [number, number] | null;
    t_step: number | null;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}
