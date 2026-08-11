import { createTransformationId } from '../../lib/ids';
import type { DatasetRecord } from '../datasets/dataset.types';
import type { DerivedDatasetDraft, FeaExSpectrogramTransformationRecord } from '../transformations/transformation.types';
import type { FeaExSpectrogramFormState } from './feaExSpectrogram.types';

export function buildFeaExSpectrogramPayload(
  dataset: DatasetRecord,
  form: FeaExSpectrogramFormState,
  derivedDataset: DerivedDatasetDraft,
): FeaExSpectrogramTransformationRecord {
  return {
    transformation_id: createTransformationId(),
    operation: 'FeaExSpectrogram',
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
    fea_ex_spectrogram: {
      selected_components: form.selectedComponents,
      preserve_label_associations: form.preserveLabelAssociations,
      enable_advanced_extraction: form.enableAdvancedExtraction,
      advanced_instruction: form.enableAdvancedExtraction ? form.advancedInstruction : '',
    },
    comments: form.comments,
    derived_dataset_count: 1,
    derived_datasets: [derivedDataset],
  };
}
