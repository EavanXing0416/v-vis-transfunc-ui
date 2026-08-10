import type { GenImageFormState } from './genImage.types';

export function getGenImageValidationMessage(form: GenImageFormState) {
  const changedVariables = Object.entries(form.variableModes)
    .filter(([, mode]) => mode === 'changed')
    .map(([key]) => key);

  if (changedVariables.length === 0) {
    return 'Select at least one changed variable.';
  }

  if (form.variableModes.shape === 'changed' && form.changedShapeValues.length === 0) {
    return 'Select at least one shape value when shape is changed.';
  }

  if (form.numberOfImages < 1) {
    return 'Number of images must be at least 1.';
  }

  if (form.imageWidth < 1 || form.imageHeight < 1) {
    return 'Image width and height must be at least 1.';
  }

  if (form.randomSeed < 0) {
    return 'Random seed must be 0 or greater.';
  }

  const ranges = [form.scale, form.size, form.posX, form.posY, form.rotation, form.grey];

  if (ranges.some((range) => range.levels < 1)) {
    return 'Each variable must have at least 1 level.';
  }

  if (ranges.some((range) => range.max < range.min)) {
    return 'Each changed variable range must have max greater than or equal to min.';
  }

  return null;
}
