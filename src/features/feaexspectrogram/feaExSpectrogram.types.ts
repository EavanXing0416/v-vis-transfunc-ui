export type FeaExSpectrogramComponent = 'complex' | 'magnitude' | 'phase' | 'magnitude_phase' | 'real_imaginary';

export interface FeaExSpectrogramFormState {
  selectedComponents: FeaExSpectrogramComponent;
  preserveLabelAssociations: boolean;
  enableAdvancedExtraction: boolean;
  advancedInstruction: string;
  comments: string;
}
