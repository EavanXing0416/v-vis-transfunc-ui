import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft } from '../transformations/transformation.types';
import type { AlignLabelFormState } from './alignLabel.types';

interface AlignLabelInputDataset {
  id: string;
  name: string;
  type: DatasetRecord['type'];
  objectCount: number;
  itemCount?: number;
  metadataSummary: string;
  modality: string;
  dataObjectType?: string;
  filePath?: string;
}

export interface AlignLabelTransformationRecord {
  transformation_id: string;
  operation: 'AlignLabel';
  status: 'ready';
  created_at: string;
  input_datasets: AlignLabelInputDataset[];
  align_label: {
    time_series_dataset_id: string;
    annotation_source: AlignLabelFormState['annotationSource'];
    annotation_dataset_id: string | null;
    label_file: string;
    labelling_rule: AlignLabelFormState['labellingRule'];
    disruption_clip_s: number | null;
    annotation_span_margin_ms: number | null;
    event_type: AlignLabelFormState['eventType'];
  };
  comments: string;
  derived_dataset_count: number;
  derived_datasets: DerivedDatasetDraft[];
}

export function buildAlignLabelPayload(
  timeSeriesDataset: DatasetRecord,
  annotationDataset: DatasetRecord | null,
  form: AlignLabelFormState,
  derivedDataset: DerivedDatasetDraft,
): AlignLabelTransformationRecord {
  const inputs = annotationDataset ? [timeSeriesDataset, annotationDataset] : [timeSeriesDataset];

  return {
    transformation_id: createTransformationId(),
    operation: 'AlignLabel',
    status: 'ready',
    created_at: new Date().toISOString(),
    input_datasets: inputs.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      objectCount: dataset.objectCount,
      itemCount: dataset.itemCount,
      metadataSummary: dataset.metadataSummary,
      modality: dataset.modality,
      dataObjectType: dataset.dataObjectType,
      filePath: dataset.filePath,
    })),
    align_label: {
      time_series_dataset_id: timeSeriesDataset.id,
      annotation_source: form.annotationSource,
      annotation_dataset_id: annotationDataset?.id ?? null,
      label_file: form.labelFilePath.trim(),
      labelling_rule: form.labellingRule,
      disruption_clip_s: form.disruptionClipS.trim() ? Number(form.disruptionClipS) : null,
      annotation_span_margin_ms: form.annotationSpanMarginMs.trim() ? Number(form.annotationSpanMarginMs) : null,
      event_type: form.eventType,
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
