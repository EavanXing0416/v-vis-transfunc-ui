import type { DatasetRecord } from '../datasets/dataset.types';
import { createTransformationId } from '../../lib/ids';
import type { PartitionTransformationRecord, DerivedDatasetDraft } from '../transformations/transformation.types';
import type { PartitionFormState } from './partition.types';

export function buildPartitionPayload(
  datasets: DatasetRecord[],
  form: PartitionFormState,
  derivedDatasets: DerivedDatasetDraft[],
): PartitionTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'Partition',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: datasets.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      objectCount: dataset.objectCount,
      metadataSummary: dataset.metadataSummary,
    })),
    partition: {
      method: form.method,
      train_ratio: form.trainRatio,
      validation_ratio: form.validationRatio,
      test_ratio: form.testRatio,
      random_seed: form.randomSeed,
    },
    comments: form.comments,
    derived_dataset_count: derivedDatasets.length,
    derived_datasets: derivedDatasets,
  };
}
