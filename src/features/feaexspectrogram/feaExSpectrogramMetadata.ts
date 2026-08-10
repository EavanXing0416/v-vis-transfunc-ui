import type { FeaExSpectrogramComponent } from './feaExSpectrogram.types';

interface FeatureInputLike {
  objectCount: number;
  metadataSummary: string;
}

export interface FeatureMetadataFormLike {
  selectedComponents: FeaExSpectrogramComponent;
  preserveLabelAssociations: boolean;
  advancedInstruction: string;
}

export function buildFeaExSpectrogramMetadataSummary(dataset: FeatureInputLike | null, form: FeatureMetadataFormLike) {
  if (!dataset) {
    return 'Feature dataset.';
  }

  const labelHeadings = extractLabelHeadings(dataset.metadataSummary);
  const labelSummary = labelHeadings.length
    ? ` Labels recorded: ${labelHeadings.join(', ')}. ${form.preserveLabelAssociations ? 'Labels preserved from STFT input.' : 'Labels not included in feature output.'}`
    : '';
  const advancedSummary = form.advancedInstruction.trim()
    ? ` Advanced extraction: ${form.advancedInstruction.trim()}.`
    : '';

  return `Feature dataset. ${dataset.objectCount} STFT / feature objects.${labelSummary} Selected components: ${formatSelectedComponents(form.selectedComponents)}.${advancedSummary}`;
}

export function extractLabelHeadings(metadata: string) {
  const match = metadata.match(/Labels recorded:\s*([^.]*)\./i);

  if (!match?.[1]) {
    return [] as string[];
  }

  return match[1]
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getAvailableFeatureComponents() {
  return ['magnitude', 'phase', 'magnitude_phase', 'complex', 'real_imaginary'] as FeaExSpectrogramComponent[];
}

export function formatSelectedComponents(value: FeaExSpectrogramComponent) {
  switch (value) {
    case 'complex':
      return 'complex';
    case 'phase':
      return 'phase';
    case 'magnitude_phase':
      return 'magnitude + phase';
    case 'real_imaginary':
      return 'real + imaginary';
    case 'magnitude':
    default:
      return 'magnitude';
  }
}
