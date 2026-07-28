import type { DatasetRecord } from '../datasets/dataset.types';
import { createTransformationId } from '../../lib/ids';
import type { DerivedDatasetDraft, SampleFieldTransformationRecord } from '../transformations/transformation.types';
import type { SampleFieldFormState } from './sampleField.types';

export function buildSampleFieldPayload(
  datasets: DatasetRecord[],
  form: SampleFieldFormState,
  derivedDatasets: DerivedDatasetDraft[],
): SampleFieldTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'SampleField',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: datasets.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      objectCount: dataset.objectCount,
      metadataSummary: dataset.metadataSummary,
    })),
    sample_field: {
      random_seed: form.randomSeed,
      number_of_data_objects: form.numberOfDataObjects,
      number_of_samples_per_object: form.numberOfSamplesPerObject,
    },
    comments: form.comments,
    derived_dataset_count: derivedDatasets.length,
    derived_datasets: derivedDatasets,
  };
}
