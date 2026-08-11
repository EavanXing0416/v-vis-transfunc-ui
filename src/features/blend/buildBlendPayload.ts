import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { BlendTransformationRecord, DerivedDatasetDraft } from '../transformations/transformation.types';
import type { BlendFormState } from './blend.types';

export function buildBlendPayload(
  datasets: DatasetRecord[],
  form: BlendFormState,
  derivedDatasets: DerivedDatasetDraft[],
): BlendTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'Blend',
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
    blend: {
      primary_dataset_id: form.primaryDatasetId,
      auxiliary_dataset_ids: form.auxiliaryDatasetIds,
      auxiliary_fraction: form.auxiliaryFraction,
      selection_rule: form.selectionRule,
      subset_selection_seed: form.subsetSelectionSeed,
      assignment_rule: form.assignmentRule,
      assignment_seed: form.assignmentSeed,
      signal_scaling_rule: form.signalScalingRule,
      target_snr: form.targetSnr,
      merge_rule: form.mergeRule,
    },
    comments: form.comments,
    derived_dataset_count: derivedDatasets.length,
    derived_datasets: derivedDatasets,
  };
}
