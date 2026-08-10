import type { DatasetRecord } from '../datasets/dataset.types';
import { getAvailableFeatureComponents } from './feaExSpectrogramMetadata';
import type { FeaExSpectrogramFormState } from './feaExSpectrogram.types';

export const defaultFeaExSpectrogramForm: FeaExSpectrogramFormState = {
  selectedComponents: 'magnitude',
  preserveLabelAssociations: true,
  enableAdvancedExtraction: false,
  advancedInstruction: '',
  comments: '',
};

export function buildDefaultFeaExSpectrogramForm(dataset?: DatasetRecord): FeaExSpectrogramFormState {
  if (!dataset) {
    return defaultFeaExSpectrogramForm;
  }

  const availableComponents = getAvailableFeatureComponents();

  return {
    ...defaultFeaExSpectrogramForm,
    selectedComponents: availableComponents[0] ?? defaultFeaExSpectrogramForm.selectedComponents,
  };
}
