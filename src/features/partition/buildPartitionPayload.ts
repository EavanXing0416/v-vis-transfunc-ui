import type { DatasetRecord } from '../datasets/dataset.types';
import { createTransformationId } from '../../lib/ids';
import type { PartitionTransformationRecord } from '../transformations/transformation.types';
import type { PartitionFormState } from './partition.types';

export function buildPartitionPayload(
  datasets: DatasetRecord[],
  form: PartitionFormState,
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
    })),
    partition: {
      strategy: form.strategy,
      train_ratio: form.trainRatio,
      validation_ratio: form.validationRatio,
      test_ratio: form.testRatio,
      shuffle: form.shuffle,
      random_seed: form.randomSeed,
    },
    comments: {
      summary: form.commentSummary,
      details: form.commentDetails,
    },
    derived_datasets: [
      { role: 'train', assigned_id: null },
      { role: 'validation', assigned_id: null },
      { role: 'test', assigned_id: null },
    ],
  };
}
