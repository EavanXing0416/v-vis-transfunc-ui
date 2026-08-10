import type { DatasetRecord } from '../datasets/dataset.types';
import type { GenImageFormState, GenImageShape, GenImageVariable, GenImageVariableMode } from './genImage.types';

const defaultVariableModes: Record<GenImageVariable, GenImageVariableMode> = {
  shape: 'changed',
  scale: 'fixed',
  size: 'fixed',
  pos_x: 'fixed',
  pos_y: 'fixed',
  rotation: 'fixed',
  grey: 'fixed',
};

export const defaultGenImageForm: GenImageFormState = {
  variableModes: defaultVariableModes,
  changedShapeValues: ['circle', 'square', 'triangle'],
  fixedShapeValue: 'circle',
  numberOfImages: 10000,
  imageWidth: 64,
  imageHeight: 64,
  outputFormat: 'png',
  samplingRule: 'enumerate',
  randomSeed: 42,
  scale: { min: 0.2, max: 0.8, fixedValue: 0.5, levels: 8 },
  size: { min: 0.2, max: 0.8, fixedValue: 0.5, levels: 8 },
  posX: { min: 0.2, max: 0.8, fixedValue: 0.5, levels: 8 },
  posY: { min: 0.2, max: 0.8, fixedValue: 0.5, levels: 4 },
  rotation: { min: 0, max: 180, fixedValue: 90, levels: 2 },
  grey: { min: 50, max: 255, fixedValue: 128, levels: 16 },
  comments: '',
};

export function buildGenImageDefaults(dataset?: DatasetRecord): GenImageFormState {
  if (!dataset?.readmeContent) {
    return defaultGenImageForm;
  }

  const metadata = parseLine(dataset.readmeContent, 'Metadata') ?? '';
  const imageSize = parsePair(metadata, 'image_size', [defaultGenImageForm.imageWidth, defaultGenImageForm.imageHeight]);
  const changedVariables = parseVariableList(metadata, 'changed_variables', getChangedVariables(defaultVariableModes));
  const variableModes = buildVariableModes(changedVariables);

  return {
    variableModes,
    changedShapeValues: parseShapeList(metadata, 'shape_values', defaultGenImageForm.changedShapeValues),
    fixedShapeValue: parseFixedShapeValue(metadata, defaultGenImageForm.fixedShapeValue),
    numberOfImages: parseNumber(metadata, 'number_of_images', defaultGenImageForm.numberOfImages),
    imageWidth: imageSize[0],
    imageHeight: imageSize[1],
    outputFormat: parseOutputFormat(metadata, defaultGenImageForm.outputFormat),
    samplingRule: parseSamplingRule(metadata, defaultGenImageForm.samplingRule),
    randomSeed: parseNumber(metadata, 'random_seed', defaultGenImageForm.randomSeed),
    scale: parseRangeConfig(metadata, 'scale', defaultGenImageForm.scale),
    size: parseRangeConfig(metadata, 'size', defaultGenImageForm.size),
    posX: parseRangeConfig(metadata, 'pos_x', defaultGenImageForm.posX),
    posY: parseRangeConfig(metadata, 'pos_y', defaultGenImageForm.posY),
    rotation: parseRangeConfig(metadata, 'rotation', defaultGenImageForm.rotation),
    grey: parseRangeConfig(metadata, 'grey', defaultGenImageForm.grey),
    comments: '',
  };
}

function getChangedVariables(variableModes: Record<GenImageVariable, GenImageVariableMode>) {
  return Object.entries(variableModes)
    .filter(([, mode]) => mode === 'changed')
    .map(([key]) => key as GenImageVariable);
}

function buildVariableModes(changedVariables: GenImageVariable[]) {
  return {
    shape: changedVariables.includes('shape') ? 'changed' : 'fixed',
    scale: changedVariables.includes('scale') ? 'changed' : 'fixed',
    size: changedVariables.includes('size') ? 'changed' : 'fixed',
    pos_x: changedVariables.includes('pos_x') ? 'changed' : 'fixed',
    pos_y: changedVariables.includes('pos_y') ? 'changed' : 'fixed',
    rotation: changedVariables.includes('rotation') ? 'changed' : 'fixed',
    grey: changedVariables.includes('grey') ? 'changed' : 'fixed',
  } as Record<GenImageVariable, GenImageVariableMode>;
}

function parseLine(readme: string, label: string) {
  const prefix = `- ${label}:`;
  const line = readme.split('\n').find((item) => item.trimStart().startsWith(prefix));
  if (!line) {
    return null;
  }

  return line.slice(line.indexOf(prefix) + prefix.length).trim();
}

function parseVariableList(source: string, key: string, fallback: GenImageVariable[]) {
  const value = parseTuple(source, key);
  if (!value) return fallback;

  const allowed = new Set<GenImageVariable>(['shape', 'scale', 'size', 'pos_x', 'pos_y', 'rotation', 'grey']);
  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is GenImageVariable => allowed.has(item as GenImageVariable));

  return parsed.length ? parsed : fallback;
}

function parseShapeList(source: string, key: string, fallback: GenImageShape[]) {
  const value = parseTuple(source, key);
  if (!value) return fallback;

  const allowed = new Set<GenImageShape>(['circle', 'square', 'triangle', 'star', 'ellipse', 'pentagon', 'hexagon', 'rectangle', 'cross']);
  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is GenImageShape => allowed.has(item as GenImageShape));

  return parsed.length ? parsed : fallback;
}

function parseFixedShapeValue(source: string, fallback: GenImageShape) {
  const regex = /fixed_shape\s*=\s*([a-zA-Z_]+)/i;
  const match = regex.exec(source)?.[1]?.trim();
  const allowed = new Set<GenImageShape>(['circle', 'square', 'triangle', 'star', 'ellipse', 'pentagon', 'hexagon', 'rectangle', 'cross']);
  return match && allowed.has(match as GenImageShape) ? (match as GenImageShape) : fallback;
}

function parseNumber(source: string, key: string, fallback: number) {
  const regex = new RegExp(`${escapeRegExp(key)}\\s*=\\s*([-]?\\d+(?:\\.\\d+)?)`, 'i');
  const match = source.match(regex);
  return match ? Number(match[1]) : fallback;
}

function parsePair(source: string, key: string, fallback: [number, number]): [number, number] {
  const regex = new RegExp(`${escapeRegExp(key)}\\s*=\\s*\\(([-]?\\d+(?:\\.\\d+)?),\\s*([-]?\\d+(?:\\.\\d+)?)\\)`, 'i');
  const match = source.match(regex);
  return match ? [Number(match[1]), Number(match[2])] : fallback;
}

function parseOutputFormat(source: string, fallback: 'png' | 'jpg') {
  const regex = /output_format\s*=\s*([a-zA-Z]+)/i;
  const match = source.match(regex)?.[1]?.toLowerCase();
  return match === 'jpg' || match === 'jpeg' ? 'jpg' : match === 'png' ? 'png' : fallback;
}

function parseSamplingRule(source: string, fallback: 'enumerate' | 'random') {
  const regex = /sampling_rule\s*=\s*([a-zA-Z]+)/i;
  const match = source.match(regex)?.[1]?.toLowerCase();
  return match === 'random' ? 'random' : match === 'enumerate' ? 'enumerate' : fallback;
}

function parseRangeConfig(source: string, key: string, fallback: GenImageFormState['scale']) {
  const rangeRegex = new RegExp(`${escapeRegExp(key)}\\s*\\(([-]?\\d+(?:\\.\\d+)?),\\s*([-]?\\d+(?:\\.\\d+)?)\\)`, 'i');
  const levelRegex = new RegExp(`${escapeRegExp(key)}\\((\\d+)\\)`, 'i');
  const fixedRegex = new RegExp(`fixed_${escapeRegExp(key)}\\s*=\\s*([-]?\\d+(?:\\.\\d+)?)`, 'i');

  let min = fallback.min;
  let max = fallback.max;
  let levels = fallback.levels;
  let fixedValue = fallback.fixedValue;

  const variableRangesSection = extractSection(source, 'variable_ranges');
  const discretizationSection = extractSection(source, 'discretization_levels');

  const rangeMatch = variableRangesSection.match(rangeRegex);
  if (rangeMatch) {
    min = Number(rangeMatch[1]);
    max = Number(rangeMatch[2]);
  }

  const levelMatch = discretizationSection.match(levelRegex);
  if (levelMatch) {
    levels = Number(levelMatch[1]);
  }

  const fixedMatch = source.match(fixedRegex);
  if (fixedMatch) {
    fixedValue = Number(fixedMatch[1]);
  }

  return { min, max, fixedValue, levels };
}

function parseTuple(source: string, key: string) {
  const regex = new RegExp(`${escapeRegExp(key)}\\s*=\\s*\\(([^)]*)\\)`, 'i');
  return source.match(regex)?.[1]?.trim() ?? null;
}

function extractSection(source: string, key: string) {
  const regex = new RegExp(`${escapeRegExp(key)}\\s*=\\s*([^;.]*)`, 'i');
  return source.match(regex)?.[1]?.trim() ?? '';
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
