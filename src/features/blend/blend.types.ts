export interface BlendFormState {
  primaryDatasetId: string;
  auxiliaryDatasetIds: string[];
  auxiliaryFraction: number;
  selectionRule: 'random_without_replacement' | 'all_objects';
  subsetSelectionSeed: number;
  assignmentRule: 'random_with_reuse' | 'cyclic_reuse';
  assignmentSeed: number;
  signalScalingRule: 'target_snr';
  targetSnr: number;
  mergeRule: 'add_signals';
  comments: string;
}
