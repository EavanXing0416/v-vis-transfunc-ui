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
    return 'Select at least one variable or enter a comparison value.';
  }

  return null;
}
