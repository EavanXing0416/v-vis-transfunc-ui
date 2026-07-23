import type { DatasetRecord } from '../datasets/dataset.types';
import { createTransformationId } from '../../lib/ids';
import type { PartitionTransformationRecord } from '../transformations/transformation.types';
import type { PartitionFormState } from './partition.types';

const PARTITION_ROLES: Array<'train' | 'validation' | 'test'> = ['train', 'validation', 'test'];

export function buildPartitionPayload(
  datasets: DatasetRecord[],
  form: PartitionFormState,
): PartitionTransformationRecord {
  const derivedDatasets = datasets.flatMap((dataset) =>
    PARTITION_ROLES.map((role) => ({
      role,
      assigned_id: null,
      parent_id: dataset.id,
    })),
  );

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
      stratify_by: form.strategy === 'stratified_split' ? form.stratifyBy : undefined,
      time_field: form.strategy === 'time_based_split' ? form.timeField : undefined,
      keep_temporal_order: form.strategy === 'time_based_split' ? form.keepTemporalOrder : undefined,
    },
    comments: {
      summary: form.commentSummary,
      details: form.commentDetails,
    },
    derived_dataset_count: derivedDatasets.length,
    derived_datasets: derivedDatasets,
  };
}
