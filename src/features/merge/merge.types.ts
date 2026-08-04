export interface MergeFormState {
  mergeMethod: 'data_objects' | 'complex';
  mode: 'attach' | 'reshuffle';
  randomSeed: number;
  complexOperation: 'add_label';
  primaryDatasetId: string;
  duplicatePrimaryDataset: boolean;
  labelDatasetIds: string[];
  labelHeadingsBySource: Record<string, string>;
  associationRule: 'align_by_record_order';
  comments: string;
}
