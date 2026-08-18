import type { DatasetRecord } from '../datasets/dataset.types';
import { createTransformationId } from '../../lib/ids';
import type { DerivedDatasetDraft, SigExMASTTransformationRecord } from '../transformations/transformation.types';
import type { SigExMASTFormState } from './sigExMAST.types';
import { parseManualShotIds } from './sigExMAST.validation';

export function buildSigExMASTPayload(
  datasets: DatasetRecord[],
  form: SigExMASTFormState,
  derivedDatasets: DerivedDatasetDraft[],
): SigExMASTTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'SigExMAST',
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
    sig_ex_mast: {
      campaign: form.campaign,
      shot_source: form.shotSource,
      shot_dataset_id: form.shotSource === 'input_dataset' ? form.selectedShotDatasetId : null,
      shot_path: form.shotSource === 'input_path' ? form.shotPath.trim() : null,
      shot_ids: form.shotSource === 'manual' ? parseManualShotIds(form.manualShotIds) : [],
      channels: form.signals,
    },
    comments: form.comments,
    derived_dataset_count: derivedDatasets.length,
    derived_datasets: derivedDatasets,
  };
}
