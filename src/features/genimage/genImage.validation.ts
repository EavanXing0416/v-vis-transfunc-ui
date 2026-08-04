import type { GenImageFormState } from './genImage.types';

export function getGenImageValidationMessage(form: GenImageFormState) {
  if (form.changedVariables.length === 0) {
    return 'Select at least one changed variable.';
  }

  if (form.changedVariables.includes('shape') && form.shapeValues.length === 0) {
    return 'Select at least one shape value when shape is a changed variable.';
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
    return 'Each variable range must have max greater than or equal to min.';
  }

  return null;
}
