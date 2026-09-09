import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft } from '../transformations/transformation.types';
import type { CropTSFormState } from './cropTS.types';

export interface CropTSTransformationRecord {
  transformation_id: string;
  operation: 'CropTS';
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
  crop_ts: {
    ip_threshold_ka: number;
    flattop_min_frac: number;
    flattop_trim_start_frac: number | null;
    flattop_trim_end_frac: number | null;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export function buildCropTSPayload(
  dataset: DatasetRecord,
  form: CropTSFormState,
  derivedDataset: DerivedDatasetDraft,
): CropTSTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'CropTS',
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
    crop_ts: {
      ip_threshold_ka: form.ipThresholdKa,
      flattop_min_frac: form.flattopMinFrac,
      flattop_trim_start_frac: form.flattopTrimStartFrac.trim() ? Number(form.flattopTrimStartFrac) : null,
      flattop_trim_end_frac: form.flattopTrimEndFrac.trim() ? Number(form.flattopTrimEndFrac) : null,
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
