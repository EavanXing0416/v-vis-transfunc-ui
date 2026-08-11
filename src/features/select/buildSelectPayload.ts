import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { SelectFormState } from './select.types';
import type { DerivedDatasetDraft, SelectTransformationRecord } from '../transformations/transformation.types';

export function buildSelectPayload(
  dataset: DatasetRecord,
  form: SelectFormState,
  derivedDataset: DerivedDatasetDraft,
): SelectTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'Select',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: [
      {
        id: dataset.id,
        name: dataset.name,
        type: dataset.type,
        objectCount: dataset.objectCount,
        metadataSummary: dataset.metadataSummary,
        modality: dataset.modality,
        dataObjectType: dataset.dataObjectType,
      selectMetadata: dataset.selectMetadata,
      },
    ],
    select: {
      operations: form.operations,
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
