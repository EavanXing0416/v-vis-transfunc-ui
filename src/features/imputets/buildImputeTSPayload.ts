import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft } from '../transformations/transformation.types';
import type { ImputeTSFormState } from './imputeTS.types';

export interface ImputeTSTransformationRecord {
  transformation_id: string;
  operation: 'ImputeTS';
  status: 'ready';
  created_at: string;
  input_datasets: Array<{
    id: string;
    name: string;
    type: DatasetRecord['type'];
    objectCount: number;
    metadataSummary: string;
    modality: string;
    dataObjectType?: string;
    selectMetadata?: DatasetRecord['selectMetadata'];
  }>;
  impute_ts: {
    fill_strategy: ImputeTSFormState['fillStrategy'];
    min_valid_samples: number;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export function buildImputeTSPayload(dataset: DatasetRecord, form: ImputeTSFormState, derivedDataset: DerivedDatasetDraft): ImputeTSTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'ImputeTS',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: [{
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      objectCount: dataset.objectCount,
      metadataSummary: dataset.metadataSummary,
      modality: dataset.modality,
      dataObjectType: dataset.dataObjectType,
      selectMetadata: dataset.selectMetadata,
    }],
    impute_ts: {
      fill_strategy: form.fillStrategy,
      min_valid_samples: form.minValidSamples,
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
