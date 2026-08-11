import type { SelectConnector, SelectDatasetSchema, SelectFormState, SelectOperationDraft } from '../../../features/select/select.types';

type SelectionBasis = 'labels' | 'columns';

interface SelectFormProps {
  form: SelectFormState;
  schema: SelectDatasetSchema;
  onChange: (nextForm: SelectFormState) => void;
  draftValidationMessage: string | null;
}

export function SelectForm({ form, schema, onChange, draftValidationMessage }: SelectFormProps) {
  const hasColumnNames = schema.columnNames.length > 0;
  const selectionBasis: SelectionBasis = form.draftStep.mode === 'labels' ? 'labels' : 'columns';
  const availableLabelValues = schema.labelClassesByHeading[form.draftStep.field] ?? [];
  const availableLabelFields = schema.labelHeadings;
  const availableColumnNames = schema.columnNames;
  const currentColumnValueType = schema.columnValueTypes?.[form.draftStep.field] ?? 'text';
  const isAdvancedValueFilter = selectionBasis === 'columns' && !['in', 'notEquals'].includes(form.draftStep.operator);

  function updateDraft<K extends keyof SelectOperationDraft>(key: K, value: SelectOperationDraft[K]) {
    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        [key]: value,
      },
    });
  }

  function updateSelectionBasis(nextBasis: SelectionBasis) {
    if (nextBasis === 'labels') {
      const nextField = schema.labelHeadings[0] ?? '';
      onChange({
        ...form,
        draftStep: {
          ...form.draftStep,
          scope: 'across',
          mode: 'labels',
          field: nextField,
          operator: 'in',
          values: schema.labelClassesByHeading[nextField]?.map((item) => item.name) ?? [],
          minValue: '',
          maxValue: '',
        },
      });
      return;
    }

    const nextField = schema.columnNames[0] ?? '';
    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        scope: 'within',
        mode: 'variables',
        field: nextField,
        operator: 'in',
        values: [],
        minValue: '',
        maxValue: '',
      },
    });
  }

  function updateField(nextField: string) {
    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        field: nextField,
        values: form.draftStep.mode === 'labels'
          ? schema.labelClassesByHeading[nextField]?.map((item) => item.name) ?? []
          : form.draftStep.values,
        minValue: '',
        maxValue: '',
      },
    });
  }

  function updateLabelRule(nextOperator: SelectOperationDraft['operator']) {
    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        operator: nextOperator,
      },
    });
  }

  function updateLabelSelectionMode(nextMode: SelectOperationDraft['labelSelectionMode']) {
    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        labelSelectionMode: nextMode,
        operator: nextMode === 'proportion' ? 'in' : form.draftStep.operator,
        values: nextMode === 'proportion' ? [] : (schema.labelClassesByHeading[form.draftStep.field] ?? []).map((item) => item.name),
        minValue: '',
        maxValue: '',
      },
    });
  }

  function updateColumnRule(nextOperator: 'in' | 'notEquals') {
    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        operator: nextOperator,
        values: nextOperator === 'in' ? form.draftStep.values : form.draftStep.values,
        minValue: '',
        maxValue: '',
      },
    });
  }

  function toggleAdvancedValueFilter() {
    const nextField = form.draftStep.field || schema.columnNames[0] || '';

    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        scope: 'within',
        mode: 'variables',
        field: nextField,
        operator: isAdvancedValueFilter ? 'in' : 'equals',
        values: [],
        minValue: '',
        maxValue: '',
      },
    });
  }

  function toggleDraftValue(value: string) {
    const nextValues = form.draftStep.values.includes(value)
      ? form.draftStep.values.filter((item) => item !== value)
      : [...form.draftStep.values, value];

    updateDraft('values', nextValues);
  }

  function applyAllLabelValues() {
    updateDraft('values', availableLabelValues.map((item) => item.name));
  }

  function applyAllColumns() {
    updateDraft('values', [...availableColumnNames]);
  }

  function addOperation() {
    onChange({
      ...form,
      operations: [...form.operations, form.draftStep],
      draftStep: {
        ...form.draftStep,
        values: form.draftStep.mode === 'labels' && form.draftStep.labelSelectionMode === 'values'
          ? schema.labelClassesByHeading[form.draftStep.field]?.map((item) => item.name) ?? []
          : [],
        minValue: '',
        maxValue: '',
      },
    });
  }

  function removeOperation(index: number) {
    onChange({
      ...form,
      operations: form.operations.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function updateConnector(index: number, connectorToNext: SelectConnector) {
    onChange({
      ...form,
      operations: form.operations.map((operation, itemIndex) => (
        itemIndex === index ? { ...operation, connectorToNext } : operation
      )),
    });
  }

  return (
    <div className="partition-split-layout">
      <div className="field-row field-row--double select-builder-row">
        <div className="field field--inline select-builder-field">
          <label htmlFor="select-basis">Selection basis</label>
          <select id="select-basis" onChange={(event) => updateSelectionBasis(event.target.value as SelectionBasis)} value={selectionBasis}>
            <option value="labels">Data-object labels</option>
            {hasColumnNames ? <option value="columns">Internal columns</option> : null}
          </select>
        </div>
        {selectionBasis === 'labels' ? (
          <div className="field field--inline select-builder-field">
            <label>Label source</label>
            <span className="partition-note">{schema.labelSource || 'NA'}</span>
          </div>
        ) : (
          <div className="field field--inline select-builder-field">
            <label htmlFor="select-column-rule">Column rule</label>
            <select id="select-column-rule" onChange={(event) => updateColumnRule(event.target.value as 'in' | 'notEquals')} value={isAdvancedValueFilter ? 'in' : form.draftStep.operator} disabled={isAdvancedValueFilter}>
              <option value="in">Keep selected columns</option>
              <option value="notEquals">Remove selected columns</option>
            </select>
          </div>
        )}
      </div>

      {selectionBasis === 'labels' ? (
        <>
          <div className="field-row field-row--double select-builder-row">
            <div className="field field--inline select-builder-field">
              <label htmlFor="select-label-field">Label heading</label>
              <select id="select-label-field" onChange={(event) => updateField(event.target.value)} value={form.draftStep.field}>
                {availableLabelFields.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
            <div className="field field--inline select-builder-field">
              <label htmlFor="select-label-selection-mode">Label selection</label>
              <select id="select-label-selection-mode" onChange={(event) => updateLabelSelectionMode(event.target.value as SelectOperationDraft['labelSelectionMode'])} value={form.draftStep.labelSelectionMode}>
                <option value="values">Select label values</option>
                <option value="proportion">Select by proportion</option>
              </select>
            </div>
          </div>

          {form.draftStep.labelSelectionMode === 'values' ? (
            <>
              <div className="field-row field-row--double select-builder-row">
                <div className="field field--inline select-builder-field">
                  <label htmlFor="select-label-rule">Label rule</label>
                  <select id="select-label-rule" onChange={(event) => updateLabelRule(event.target.value as SelectOperationDraft['operator'])} value={form.draftStep.operator}>
                    <option value="in">Include selected labels</option>
                    <option value="notEquals">Exclude selected labels</option>
                    <option value="equals">Match one selected label</option>
                  </select>
                </div>
              </div>

              <div className="action-row action-row--tight select-builder-shortcuts">
                <button className="button button--ghost button--small" onClick={applyAllLabelValues} type="button">
                  Select all labels
                </button>
              </div>

              <div className="field">
                <label>Label values</label>
                <div className="checkbox-grid checkbox-grid--compact select-builder-card-grid">
                  {availableLabelValues.map((item) => (
                    <label className="checkbox-card" key={item.name}>
                      <input checked={form.draftStep.values.includes(item.name)} onChange={() => toggleDraftValue(item.name)} type="checkbox" />
                      <span>{item.name}</span>
                      {item.count > 0 ? <small>{item.count} objects</small> : null}
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="field-row field-row--double select-builder-row">
              <div className="field field--inline select-builder-field">
                <label htmlFor="select-label-proportion">Label proportion</label>
                <input id="select-label-proportion" onChange={(event) => updateDraft('labelProportion', event.target.value)} placeholder="e.g. 0.8" value={form.draftStep.labelProportion} />
              </div>
              <div className="field field--inline select-builder-field">
                <label htmlFor="select-label-random-seed">Random seed</label>
                <input id="select-label-random-seed" onChange={(event) => updateDraft('labelRandomSeed', event.target.value)} placeholder="e.g. 42" value={form.draftStep.labelRandomSeed} />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="field">
            <label>Column names</label>
            <div className="action-row action-row--tight select-builder-shortcuts">
              <button className="button button--ghost button--small" onClick={applyAllColumns} type="button">
                Select all columns
              </button>
            </div>
            <div className="checkbox-grid checkbox-grid--compact select-builder-card-grid">
              {availableColumnNames.map((item) => (
                <label className="checkbox-card" key={item}>
                  <input checked={form.draftStep.values.includes(item)} onChange={() => toggleDraftValue(item)} type="checkbox" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="checkbox-inline--compact">
              <input checked={isAdvancedValueFilter} onChange={toggleAdvancedValueFilter} type="checkbox" />
              <span>Use advanced value filter</span>
            </label>
          </div>

          {isAdvancedValueFilter ? (
            <>
              <div className="field-row field-row--double select-builder-row">
                <div className="field field--inline select-builder-field">
                  <label htmlFor="select-advanced-field">Column name</label>
                  <select id="select-advanced-field" onChange={(event) => updateField(event.target.value)} value={form.draftStep.field}>
                    {availableColumnNames.map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
                <div className="field field--inline select-builder-field">
                  <label htmlFor="select-advanced-operator">Value rule</label>
                  <select id="select-advanced-operator" onChange={(event) => updateDraft('operator', event.target.value as SelectOperationDraft['operator'])} value={form.draftStep.operator}>
                    {currentColumnValueType === 'numerical' ? (
                      <>
                        <option value="equals">Equals</option>
                        <option value="gt">Greater than</option>
                        <option value="lt">Less than</option>
                        <option value="between">Between</option>
                      </>
                    ) : (
                      <>
                        <option value="equals">Equals</option>
                        <option value="notEquals">Not equals</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="field-row field-row--double">
                <div className="field field--inline">
                  <label htmlFor="select-min-value">{form.draftStep.operator === 'between' ? 'Minimum value' : 'Value'}</label>
                  <input id="select-min-value" onChange={(event) => updateDraft('minValue', event.target.value)} placeholder={currentColumnValueType === 'numerical' ? 'e.g. 0.5' : 'Enter value'} value={form.draftStep.minValue} />
                </div>
                {form.draftStep.operator === 'between' ? (
                  <div className="field field--inline">
                    <label htmlFor="select-max-value">Maximum value</label>
                    <input id="select-max-value" onChange={(event) => updateDraft('maxValue', event.target.value)} placeholder="e.g. 1.0" value={form.draftStep.maxValue} />
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </>
      )}

      {draftValidationMessage ? <p className="field-error">{draftValidationMessage}</p> : null}

      <div className="action-row select-builder-add-row">
        <button className="button button--secondary" disabled={Boolean(draftValidationMessage)} onClick={addOperation} type="button">
          Add to operation
        </button>
      </div>

      <div className="section-title section-title--subtle">
        <h3>Added Operations</h3>
        <span className="muted">{form.operations.length} step{form.operations.length === 1 ? '' : 's'}</span>
      </div>

      {form.operations.length === 0 ? (
        <p className="partition-note">No operations added yet.</p>
      ) : (
        <div className="operation-list">
          {form.operations.map((operation, index) => (
            <div className="operation-list__item" key={`${operation.mode}-${operation.field}-${index}`}>
              <div>
                <span>{formatOperationBasis(operation)}</span>
                <span className="muted"> | {formatOperationValue(operation)}</span>
              </div>
              <div className="action-row action-row--tight select-builder-operation-actions">
                {index < form.operations.length - 1 ? (
                  <select className="operation-list__select" onChange={(event) => updateConnector(index, event.target.value as SelectConnector)} value={operation.connectorToNext}>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                ) : (
                  <span className="operation-list__connector">END</span>
                )}
                <button className="button button--ghost button--small" onClick={() => removeOperation(index)} type="button">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="action-row">
            <button className="button button--ghost button--small" onClick={() => onChange({ ...form, operations: [] })} type="button">
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatOperationBasis(operation: SelectOperationDraft) {
  if (operation.mode === 'labels') {
    return operation.labelSelectionMode === 'proportion'
      ? `By data-object labels: ${operation.field} (proportion)`
      : `By data-object labels: ${operation.field}`;
  }

  const isAdvancedValueFilter = !['in', 'notEquals'].includes(operation.operator);
  return isAdvancedValueFilter ? `By internal column values: ${operation.field}` : 'By internal columns';
}

function formatOperationValue(operation: SelectOperationDraft) {
  if (operation.mode === 'labels') {
    if (operation.labelSelectionMode === 'proportion') {
      return `randomly select ${operation.labelProportion} of label groups with seed ${operation.labelRandomSeed}`;
    }

    if (operation.operator === 'equals') {
      return `match ${operation.values[0] ?? ''}`;
    }

    return `${operation.operator === 'notEquals' ? 'exclude' : 'include'} ${operation.values.join(', ')}`;
  }

  if (operation.operator === 'in') {
    return `keep ${operation.values.join(', ')}`;
  }

  if (operation.operator === 'notEquals' && operation.values.length > 0) {
    return `remove ${operation.values.join(', ')}`;
  }

  if (operation.operator === 'between') {
    return `between ${operation.minValue} and ${operation.maxValue}`;
  }

  const symbol = operation.operator === 'gt' ? '>' : operation.operator === 'lt' ? '<' : operation.operator === 'notEquals' ? '!=' : '=';
  return `${symbol} ${operation.minValue}`;
}
