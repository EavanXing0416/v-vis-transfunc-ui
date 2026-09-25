import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft } from '../transformations/transformation.types';
import type { NormTSFormState } from './normTS.types';

export interface NormTSTransformationRecord {
  transformation_id: string;
  operation: 'NormTS';
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
  norm_ts: {
    method: NormTSFormState['method'];
    epsilon: number;
    fit_scope: NormTSFormState['fitScope'];
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export function buildNormTSPayload(
  dataset: DatasetRecord,
  form: NormTSFormState,
  derivedDataset: DerivedDatasetDraft,
): NormTSTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'NormTS',
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
    norm_ts: {
      method: form.method,
      epsilon: Number(form.epsilon),
      fit_scope: form.fitScope,
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
