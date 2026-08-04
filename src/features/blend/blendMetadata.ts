interface BlendInputLike {
  name: string;
  objectCount: number;
  metadataSummary: string;
  dataObjectType?: string;
  modality?: string;
}

export function buildBlendMetadataSummary(
  primaryDataset: BlendInputLike | null,
  auxiliaryDatasets: BlendInputLike[],
  fraction: number,
) {
  if (!primaryDataset) {
    return 'Blended dataset.';
  }

  const inputs = [primaryDataset.name, ...auxiliaryDatasets.map((dataset) => dataset.name)].join(', ');
  const labelHeadings = extractLabelHeadings(primaryDataset.metadataSummary);
  const labelSummary = labelHeadings.length
    ? ` Labels recorded: ${labelHeadings.join(', ')}. Labels inherited from ${primaryDataset.name}.`
    : '';

  return `Blended ${inferDatasetKind(primaryDataset)} dataset. ${formatObjectCount(primaryDataset.objectCount, primaryDataset.dataObjectType)}.${labelSummary} Inputs: ${inputs}. Noise pool fraction: ${formatPercentage(fraction)}.`;
}

export function getSelectedAuxiliaryObjectCount(dataset: Pick<BlendInputLike, 'objectCount'>, fraction: number) {
  if (dataset.objectCount <= 0 || fraction <= 0) {
    return 0;
  }

  return Math.min(dataset.objectCount, Math.max(1, Math.round(dataset.objectCount * fraction)));
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

function inferDatasetKind(dataset: BlendInputLike) {
  const type = (dataset.dataObjectType ?? dataset.modality ?? '').toLowerCase();

  if (type.includes('audio')) {
    return 'audio';
  }

  if (type.includes('image')) {
    return 'image';
  }

  if (type.includes('stft')) {
    return 'STFT';
  }

  return 'data';
}

function formatObjectCount(count: number, dataObjectType?: string) {
  const type = (dataObjectType ?? '').toLowerCase();

  if (type.includes('audio')) {
    return `${count} audio clips`;
  }

  if (type.includes('image')) {
    return `${count} images`;
  }

  if (type.includes('stft')) {
    return `${count} STFT objects`;
  }

  if (type.includes('field')) {
    return `${count} field objects`;
  }

  return `${count} data objects`;
}

function formatPercentage(value: number) {
  const percentage = value * 100;
  const formatted = Number.isInteger(percentage) ? String(percentage) : percentage.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return `${formatted}%`;
}
