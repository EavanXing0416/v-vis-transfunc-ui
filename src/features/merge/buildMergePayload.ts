import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { MergeTransformationRecord, DerivedDatasetDraft } from '../transformations/transformation.types';
import type { MergeFormState } from './merge.types';
import { isTabularMerge } from './mergeMetadata';

export function buildMergePayload(
  datasets: DatasetRecord[],
  form: MergeFormState,
  derivedDatasets: DerivedDatasetDraft[],
  orderedDatasetIds: string[],
): MergeTransformationRecord {
  const usesSchemaHandling = form.mergeMethod === 'data_objects' && isTabularMerge(datasets);

  return {
    transformation_id: createTransformationId(),
    operation: 'Merge',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: datasets.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      objectCount: dataset.objectCount,
      metadataSummary: dataset.metadataSummary,
      modality: dataset.modality,
      dataObjectType: dataset.dataObjectType,
      selectMetadata: dataset.selectMetadata,
    })),
    merge: {
      method: form.mergeMethod,
      mode: form.mergeMethod === 'data_objects' ? form.mode : null,
      schema_handling: usesSchemaHandling ? form.schemaHandling : null,
      schema_reference_dataset_id: usesSchemaHandling && form.schemaHandling === 'reference_dataset_with_na_fill'
        ? form.schemaReferenceDatasetId
        : null,
      input_order: orderedDatasetIds,
      random_seed: form.mergeMethod === 'data_objects' && form.mode === 'reshuffle' ? form.randomSeed : null,
      complex_operation: form.mergeMethod === 'complex' ? form.complexOperation : null,
      add_label: form.mergeMethod === 'complex'
        ? {
            primary_dataset_id: form.primaryDatasetId,
            duplicate_primary_dataset: form.duplicatePrimaryDataset,
            label_dataset_ids: form.labelDatasetIds,
            association_rule: form.associationRule,
            label_headings_by_source: form.labelHeadingsBySource,
          }
        : null,
    },
    comments: form.comments,
    derived_dataset_count: derivedDatasets.length,
    derived_datasets: derivedDatasets,
  };
}
