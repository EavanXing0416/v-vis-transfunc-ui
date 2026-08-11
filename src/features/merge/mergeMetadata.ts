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

export function isTabularMerge(inputs: MergeInputLike[]) {
  const objectType = getHomogeneousMergeDataObjectType(inputs);
  return objectType?.trim().toLowerCase() === 'tabular';
}

export function buildMergeMetadataSummary(
  inputs: MergeInputLike[],
  totalObjects: number,
  mode: 'attach' | 'reshuffle',
  schemaHandling: 'union_all_columns' | 'intersect_common_columns' | 'reference_dataset_with_na_fill',
  schemaReferenceDatasetName?: string | null,
) {
  if (!inputs.length) {
    return `Merged dataset, order mode: ${mode}.`;
  }

  const objectType = getHomogeneousMergeDataObjectType(inputs);
  if (objectType && objectType.toLowerCase() === 'image') {
    return buildImageMergeMetadata(inputs, totalObjects, mode);
  }

  if (isTabularMerge(inputs)) {
    return buildTabularMergeMetadata(inputs, totalObjects, mode, schemaHandling, schemaReferenceDatasetName);
  }

  const narratives = dedupeSentences(inputs.flatMap((input) => splitMetadataSentences(input.metadataSummary)));

  if (!narratives.length) {
    return `Merged dataset. Order mode: ${mode}.`;
  }

  return `${narratives.join('. ')}. Merged dataset. Order mode: ${mode}.`;
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
  return `${base}${shapeText} Merged dataset, order mode: ${mode}.`;
}

function buildTabularMergeMetadata(
  inputs: MergeInputLike[],
  totalObjects: number,
  mode: 'attach' | 'reshuffle',
  schemaHandling: 'union_all_columns' | 'intersect_common_columns' | 'reference_dataset_with_na_fill',
  schemaReferenceDatasetName?: string | null,
) {
  const sourceCounts = dedupeNumbers(inputs.flatMap((input) => extractCounts(input.metadataSummary, /(\d+)\s+event-CSV columns?/gi)));
  const labelHeadingCounts = dedupeNumbers(inputs.flatMap((input) => extractCounts(input.metadataSummary, /(\d+)\s+event-list label headings?/gi)));

  const columnSummary = sourceCounts.length
    ? schemaHandling === 'intersect_common_columns'
      ? `${sourceCounts.join(', ')} source event-CSV columns reduced to a shared schema`
      : schemaHandling === 'reference_dataset_with_na_fill'
        ? `${sourceCounts.join(', ')} source event-CSV columns aligned to the reference schema`
        : `${sourceCounts.join(', ')} source event-CSV columns merged into one schema`
    : 'Merged tabular schema';

  const labelSummary = labelHeadingCounts.length
    ? `${Math.max(...labelHeadingCounts)} inherited event-list label headings`
    : 'inherited event-list label headings';

  return `Time-series event dataset. Each data object is one event file. ${totalObjects} merged event files. ${columnSummary}. ${labelSummary}. Order mode: ${mode}. Schema handling: ${formatSchemaHandling(schemaHandling, schemaReferenceDatasetName)}.`;
}

export function formatSchemaHandling(
  value: 'union_all_columns' | 'intersect_common_columns' | 'reference_dataset_with_na_fill',
  referenceDatasetName?: string | null,
) {
  switch (value) {
    case 'intersect_common_columns':
      return 'keep common columns';
    case 'reference_dataset_with_na_fill':
      return `use ${referenceDatasetName ?? 'the selected reference dataset'} as the schema reference and fill missing values with NA`;
    case 'union_all_columns':
    default:
      return 'keep all columns';
  }
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
    .filter((item) => !/^merged dataset, /i.test(item));
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

function extractCounts(metadata: string, pattern: RegExp) {
  return Array.from(metadata.matchAll(pattern)).map((match) => Number(match[1])).filter((value) => Number.isFinite(value));
}

function dedupeNumbers(values: number[]) {
  return Array.from(new Set(values));
}
