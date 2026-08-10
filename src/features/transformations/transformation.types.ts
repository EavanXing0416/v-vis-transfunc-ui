import type { DatasetRecord } from '../datasets/dataset.types';
import type { SelectOperationDraft } from '../select/select.types';

export type TransformationStatus = 'draft' | 'ready' | 'running' | 'completed';

type TransformationInputDataset = Pick<
  DatasetRecord,
  'id' | 'name' | 'type' | 'objectCount' | 'metadataSummary' | 'modality' | 'dataObjectType'
>;

export interface DerivedDatasetDraft {
  role: 'train' | 'validation' | 'test' | 'sampled' | 'selected' | 'simulated' | 'generated' | 'merged' | 'blended';
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

export interface MergeTransformationRecord {
  transformation_id: string;
  operation: 'Merge';
  status: TransformationStatus;
  created_at: string;
  input_datasets: TransformationInputDataset[];
  merge: {
    method: 'data_objects' | 'complex';
    mode: 'attach' | 'reshuffle' | null;
    input_order: string[];
    random_seed: number | null;
    complex_operation: 'add_label' | null;
    add_label: {
      primary_dataset_id: string;
      duplicate_primary_dataset: boolean;
      label_dataset_ids: string[];
      association_rule: 'align_by_record_order';
      label_headings_by_source: Record<string, string>;
    } | null;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export interface BlendTransformationRecord {
  transformation_id: string;
  operation: 'Blend';
  status: TransformationStatus;
  created_at: string;
  input_datasets: TransformationInputDataset[];
  blend: {
    primary_dataset_id: string;
    auxiliary_dataset_ids: string[];
    auxiliary_fraction: number;
    selection_rule: 'random_without_replacement' | 'all_objects';
    subset_selection_seed: number;
    assignment_rule: 'random_with_reuse' | 'cyclic_reuse';
    assignment_seed: number;
    signal_scaling_rule: 'target_snr';
    target_snr: number;
    merge_rule: 'add_signals';
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export interface STFTTransformationRecord {
  transformation_id: string;
  operation: 'STFT';
  status: TransformationStatus;
  created_at: string;
  input_datasets: TransformationInputDataset[];
  stft: {
    sample_rate: number;
    fft_size: number;
    window_length: number;
    hop_length: number;
    window_type: 'hann' | 'hamming' | 'rectangular';
    apply_to_labels: boolean;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export interface FeaExSpectrogramTransformationRecord {
  transformation_id: string;
  operation: 'FeaExSpectrogram';
  status: TransformationStatus;
  created_at: string;
  input_datasets: TransformationInputDataset[];
  fea_ex_spectrogram: {
    selected_components: 'complex' | 'magnitude' | 'phase' | 'magnitude_phase' | 'real_imaginary';
    preserve_label_associations: boolean;
    enable_advanced_extraction: boolean;
    advanced_instruction: string;
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

export interface GenImageTransformationRecord {
  transformation_id: string;
  operation: 'GenImage';
  status: TransformationStatus;
  created_at: string;
  input_datasets: TransformationInputDataset[];
  gen_image: {
    changed_variables: Array<'shape' | 'scale' | 'size' | 'pos_x' | 'pos_y' | 'rotation' | 'grey'>;
    fixed_variables: Array<'shape' | 'scale' | 'size' | 'pos_x' | 'pos_y' | 'rotation' | 'grey'>;
    shape_values: Array<'circle' | 'square' | 'triangle' | 'star' | 'ellipse' | 'pentagon' | 'hexagon' | 'rectangle' | 'cross'>;
    fixed_shape_value: 'circle' | 'square' | 'triangle' | 'star' | 'ellipse' | 'pentagon' | 'hexagon' | 'rectangle' | 'cross';
    number_of_images: number;
    image_size: [number, number];
    output_format: 'png' | 'jpg';
    output_folder: string;
    output_prefix: string;
    sampling_rule: 'enumerate' | 'random';
    random_seed: number;
    file_naming_rule: string;
    generation_config_id: string;
    color_type: 'grey';
    background: 'white';
    color_background: number;
    shape_cropping: boolean;
    shape_overlapping: boolean;
    scale_levels: number;
    size_levels: number;
    pos_x_levels: number;
    pos_y_levels: number;
    rotation_levels: number;
    grey_levels: number;
    scale_range: [number, number];
    size_range: [number, number];
    pos_x_range: [number, number];
    pos_y_range: [number, number];
    rotation_range: [number, number];
    grey_range: [number, number];
    scale_fixed_value: number;
    size_fixed_value: number;
    pos_x_fixed_value: number;
    pos_y_fixed_value: number;
    rotation_fixed_value: number;
    grey_fixed_value: number;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}
