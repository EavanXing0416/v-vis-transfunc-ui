import type { DatasetRecord } from '../datasets/dataset.types';
import type { MergeFormState } from './merge.types';

export function buildDefaultMergeForm(datasets: DatasetRecord[]): MergeFormState {
  const primaryDatasetId = datasets[0]?.id ?? '';
  const labelHeadingsBySource: Record<string, string> = {
    duplicate_primary: 'label_1',
  };

  datasets
    .filter((dataset) => dataset.id !== primaryDatasetId)
    .forEach((dataset, index) => {
      labelHeadingsBySource[dataset.id] = `label_${index + 1}`;
    });

  return {
    mergeMethod: datasets.length <= 1 ? 'complex' : 'data_objects',
    mode: 'attach',
    randomSeed: 0,
    complexOperation: 'add_label',
    primaryDatasetId,
    duplicatePrimaryDataset: datasets.length <= 1,
    labelDatasetIds: [],
    labelHeadingsBySource,
    associationRule: 'align_by_record_order',
    comments: '',
  };
}
