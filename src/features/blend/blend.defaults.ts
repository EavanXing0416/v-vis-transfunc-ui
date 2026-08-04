import type { DatasetRecord } from '../datasets/dataset.types';
import type { BlendFormState } from './blend.types';

export function buildDefaultBlendForm(datasets: DatasetRecord[]): BlendFormState {
  const primaryDataset = datasets[0];
  const auxiliaryDatasetIds = datasets.slice(1).map((dataset) => dataset.id);

  return {
    primaryDatasetId: primaryDataset?.id ?? '',
    auxiliaryDatasetIds,
    auxiliaryFraction: 0.1,
    selectionRule: 'random_without_replacement',
    subsetSelectionSeed: 42,
    assignmentRule: 'random_with_reuse',
    assignmentSeed: 42,
    signalScalingRule: 'target_snr',
    targetSnr: 10,
    mergeRule: 'add_signals',
    comments: '',
  };
}
