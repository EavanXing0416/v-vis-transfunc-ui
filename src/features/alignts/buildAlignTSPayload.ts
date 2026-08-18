import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft } from '../transformations/transformation.types';
import type { AlignTSFormState } from './alignTS.types';

export interface AlignTSTransformationRecord {
  transformation_id: string;
  operation: 'AlignTS';
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
  align_ts: {
    t_min: number;
    t_max: number | null;
    dt: number;
    method: 'nearest' | 'linear' | 'cubic' | 'zero';
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export function buildAlignTSPayload(
  dataset: DatasetRecord,
  form: AlignTSFormState,
  derivedDataset: DerivedDatasetDraft,
): AlignTSTransformationRecord {
  const parsedTMax = form.tMax.trim() ? Number(form.tMax) : null;

  return {
    transformation_id: createTransformationId(),
    operation: 'AlignTS',
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
    align_ts: {
      t_min: form.tMin,
      t_max: parsedTMax,
      dt: form.dt,
      method: form.method,
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
