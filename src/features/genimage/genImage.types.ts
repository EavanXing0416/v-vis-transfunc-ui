export const GENIMAGE_VARIABLES = ['shape', 'scale', 'size', 'pos_x', 'pos_y', 'rotation', 'grey'] as const;
export const GENIMAGE_SHAPES = ['circle', 'square', 'triangle', 'star', 'ellipse', 'pentagon', 'hexagon', 'rectangle', 'cross'] as const;

export type GenImageVariable = (typeof GENIMAGE_VARIABLES)[number];
export type GenImageShape = (typeof GENIMAGE_SHAPES)[number];

export interface GenImageRangeConfig {
  min: number;
  max: number;
  levels: number;
}

export interface GenImageFormState {
  changedVariables: GenImageVariable[];
  shapeValues: GenImageShape[];
  numberOfImages: number;
  imageWidth: number;
  imageHeight: number;
  outputFormat: 'png' | 'jpg';
  samplingRule: 'enumerate' | 'random';
  randomSeed: number;
  scale: GenImageRangeConfig;
  size: GenImageRangeConfig;
  posX: GenImageRangeConfig;
  posY: GenImageRangeConfig;
  rotation: GenImageRangeConfig;
  grey: GenImageRangeConfig;
  comments: string;
}
