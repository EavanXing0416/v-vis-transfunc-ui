import type { SelectDatasetSchema, SelectFormState, SelectOperationDraft } from './select.types';

function buildDefaultDraftStep(schema: SelectDatasetSchema): SelectOperationDraft {
  return {
    scope: 'across',
    mode: 'labels',
    field: schema.labelHeadings[0] ?? schema.columnNames[0] ?? '',
    operator: 'in',
    values: schema.labelClassesByHeading[schema.labelHeadings[0] ?? '']?.map((item) => item.name) ?? [],
    minValue: '',
    maxValue: '',
    connectorToNext: 'AND',
    labelSelectionMode: 'values',
    labelProportion: '0.8',
    labelRandomSeed: '42',
  };
}

export function buildDefaultSelectForm(datasetName: string, schema: SelectDatasetSchema): SelectFormState {
  return {
    outputName: `${datasetName}_sel`,
    draftStep: buildDefaultDraftStep(schema),
    operations: [],
    comments: '',
  };
}

export function buildEmptyDraftStep(schema: SelectDatasetSchema) {
  return buildDefaultDraftStep(schema);
}
