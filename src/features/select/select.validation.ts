import type { SelectDatasetSchema, SelectFormState, SelectOperationDraft } from './select.types';

export function getSelectValidationMessage(form: SelectFormState) {
  if (!form.outputName.trim()) {
    return 'Output dataset name is required.';
  }

  if (form.operations.length === 0) {
    return 'Add at least one selection operation before committing.';
  }

  return null;
}

export function getSelectDraftValidationMessage(step: SelectOperationDraft, schema: SelectDatasetSchema) {
  if (!step.field) {
    return 'Choose a field.';
  }

  if (step.mode === 'labels') {
    if (!schema.labelClassesByHeading[step.field]?.length) {
      return 'The selected label heading has no available values.';
    }

    if (step.labelSelectionMode === 'proportion') {
      const proportion = Number(step.labelProportion);

      if (!Number.isFinite(proportion) || proportion <= 0 || proportion > 1) {
        return 'Enter a label proportion greater than 0 and up to 1.';
      }

      const seed = Number(step.labelRandomSeed);

      if (!Number.isInteger(seed) || seed < 0) {
        return 'Enter a non-negative integer random seed.';
      }

      return null;
    }

    if (step.values.length === 0) {
      return 'Select at least one label value.';
    }

    return null;
  }

  if (step.operator === 'between') {
    if (!step.minValue.trim() || !step.maxValue.trim()) {
      return 'Enter both minimum and maximum values.';
    }

    return null;
  }

  if (step.values.length === 0 && !step.minValue.trim()) {
    return 'Select at least one column or enter a comparison value.';
  }

  return null;
}
