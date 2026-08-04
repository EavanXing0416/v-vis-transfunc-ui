interface STFTInputLike {
  name: string;
  objectCount: number;
  metadataSummary: string;
}

interface STFTFormLike {
  storedComponents: 'complex' | 'magnitude' | 'phase' | 'magnitude_phase';
  windowType: 'hann' | 'hamming' | 'rectangular';
  fftSize: number;
  windowLength: number;
  hopLength: number;
  applyToLabels: boolean;
}

export function buildSTFTMetadataSummary(dataset: STFTInputLike | null, form: STFTFormLike) {
  if (!dataset) {
    return 'STFT dataset.';
  }

  const labelHeadings = extractLabelHeadings(dataset.metadataSummary);
  const labelSummary = labelHeadings.length
    ? ` Labels recorded: ${labelHeadings.join(', ')}. ${form.applyToLabels ? 'Labels transformed with the input.' : 'Labels preserved from input dataset.'}`
    : '';

  return `Labelled STFT dataset. ${dataset.objectCount} STFT objects.${labelSummary} Stored components: ${formatStoredComponents(form.storedComponents)}. Window: ${formatWindowType(form.windowType)}. n_fft: ${form.fftSize}, window_length: ${form.windowLength}, hop_length: ${form.hopLength}.`;
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

export function formatStoredComponents(value: STFTFormLike['storedComponents']) {
  switch (value) {
    case 'complex':
      return 'complex';
    case 'phase':
      return 'phase';
    case 'magnitude_phase':
      return 'magnitude + phase';
    case 'magnitude':
    default:
      return 'magnitude';
  }
}

export function formatWindowType(value: STFTFormLike['windowType']) {
  switch (value) {
    case 'hamming':
      return 'hamming';
    case 'rectangular':
      return 'rectangular';
    case 'hann':
    default:
      return 'hann';
  }
}
