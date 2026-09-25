import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft } from '../transformations/transformation.types';
import type { SegmentTSFormState } from './segmentTS.types';

export interface SegmentTSTransformationRecord {
  transformation_id: string;
  operation: 'SegmentTS';
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
  segment_ts: {
    window_ms: number;
    stride_ms: number;
    fs_hz: number;
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export function buildSegmentTSPayload(dataset: DatasetRecord, form: SegmentTSFormState, derivedDataset: DerivedDatasetDraft): SegmentTSTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'SegmentTS',
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
    segment_ts: {
      window_ms: Number(form.windowMs),
      stride_ms: Number(form.strideMs),
      fs_hz: Number(form.fsHz),
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
