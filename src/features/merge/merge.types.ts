export interface MergeFormState {
  mergeMethod: 'data_objects' | 'complex';
  mode: 'attach' | 'reshuffle';
  randomSeed: number;
  complexOperation: 'add_label';
  schemaHandling: 'union_all_columns' | 'intersect_common_columns' | 'reference_dataset_with_na_fill';
  schemaReferenceDatasetId: string;
  primaryDatasetId: string;
  duplicatePrimaryDataset: boolean;
  labelDatasetIds: string[];
  labelHeadingsBySource: Record<string, string>;
  associationRule: 'align_by_record_order';
  comments: string;
}
