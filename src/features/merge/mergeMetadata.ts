import { getDatasetDataObjectType } from '../datasets/dataObjectType';

interface MergeInputLike {
  id?: string;
  name: string;
  modality: string;
  dataObjectType?: string;
  metadataSummary: string;
  objectCount?: number;
}

export function getHomogeneousMergeDataObjectType(inputs: MergeInputLike[]) {
  if (!inputs.length) {
    return null;
  }

  const types = Array.from(new Set(inputs.map((input) => getDatasetDataObjectType(input).trim().toLowerCase())));
  if (types.length !== 1) {
    return null;
  }

  return getDatasetDataObjectType(inputs[0]);
}

export function buildMergeMetadataSummary(inputs: MergeInputLike[], totalObjects: number, mode: 'attach' | 'reshuffle') {
  if (!inputs.length) {
    return `Merged dataset, mode: ${mode}.`;
  }

  const objectType = getHomogeneousMergeDataObjectType(inputs);
  if (objectType && objectType.toLowerCase() === 'image') {
    return buildImageMergeMetadata(inputs, totalObjects, mode);
  }

  const narratives = dedupeSentences(inputs.flatMap((input) => splitMetadataSentences(input.metadataSummary)));
  if (!narratives.length) {
    return `Merged dataset, mode: ${mode}.`;
  }

  return `${narratives.join(' ')} Merged dataset, mode: ${mode}.`;
}

export function buildAddLabelMetadataSummary(
  primaryDataset: MergeInputLike | null,
  labelDatasets: MergeInputLike[],
  duplicatePrimaryDataset: boolean,
  labelHeadingsBySource: Record<string, string>,
) {
  if (!primaryDataset) {
    return 'Labelled dataset. Labels recorded: label_1.';
  }

  const objectType = getDatasetDataObjectType(primaryDataset);
  const objectCount = primaryDataset.objectCount ?? 0;
  const countText = formatCountText(objectCount, objectType);
  const labelNames = [
    ...(duplicatePrimaryDataset ? [primaryDataset.name] : []),
    ...labelDatasets.map((dataset) => dataset.name),
  ];
  const headingNames = [
    ...(duplicatePrimaryDataset ? [labelHeadingsBySource.duplicate_primary].filter(Boolean) : []),
    ...labelDatasets.map((dataset) => labelHeadingsBySource[dataset.id ?? '']).filter(Boolean),
  ];
  const labelCount = Math.max(headingNames.length, 1);

  const labelsText = `${labelCount} label${labelCount === 1 ? '' : 's'} per data object.`;

  const sourceText = duplicatePrimaryDataset && !labelDatasets.length
    ? `Labels duplicated from ${primaryDataset.name}.`
    : `Labels attached from ${labelNames.join(', ')}.`;

  return `Labelled ${objectType.toLowerCase()} dataset. ${countText}. ${labelsText} Labels recorded: ${headingNames.join(', ') || 'label_1'}. ${sourceText}`;
}

function buildImageMergeMetadata(inputs: MergeInputLike[], totalObjects: number, mode: 'attach' | 'reshuffle') {
  const imageSize = inputs.map((input) => extractImageSize(input.metadataSummary)).find(Boolean);
  const shapes = Array.from(new Set(inputs.flatMap((input) => extractShapes(input.metadataSummary))));
  const base = `Generated image dataset. ${totalObjects}${imageSize ? ` ${imageSize}` : ''} images.`;
  const shapeText = shapes.length ? ` Shapes: ${shapes.join(', ')}.` : '';
  return `${base}${shapeText} Merged dataset, mode: ${mode}.`;
}

function formatCountText(count: number, objectType: string) {
  if (count <= 0) {
    return '0 data objects';
  }

  const normalized = objectType.toLowerCase();

  if (normalized.includes('audio')) {
    return `${count} audio clips`;
  }

  if (normalized.includes('image')) {
    return `${count} images`;
  }

  if (normalized.includes('stft')) {
    return `${count} STFT objects`;
  }

  if (normalized.includes('feature')) {
    return `${count} feature objects`;
  }

  if (normalized.includes('field')) {
    return `${count} field objects`;
  }

  return `${count} data objects`;
}

function extractImageSize(metadata: string) {
  const match = metadata.match(/(\d+x\d+)\s+images/i);
  return match?.[1] ?? null;
}

function extractShapes(metadata: string) {
  const match = metadata.match(/Shapes?:\s*([^\.]+)/i);
  if (!match) {
    return [];
  }

  return match[1]
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitMetadataSentences(metadata: string) {
  return metadata
    .split('.')
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => !/^merged dataset, mode:/i.test(item));
}

function dedupeSentences(items: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item.endsWith('.') ? item.slice(0, -1) : item);
    }
  }

  return result;
}
