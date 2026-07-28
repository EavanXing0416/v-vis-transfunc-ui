import type { SelectConnector, SelectDatasetSchema, SelectFormState, SelectOperationDraft } from '../../../features/select/select.types';

interface SelectFormProps {
  form: SelectFormState;
  schema: SelectDatasetSchema;
  onChange: (nextForm: SelectFormState) => void;
  draftValidationMessage: string | null;
}

export function SelectForm({ form, schema, onChange, draftValidationMessage }: SelectFormProps) {
  const availableLabelValues = schema.labelClassesByHeading[form.draftStep.field] ?? [];
  const availableVariableFields = schema.variableHeadings;
  const availableLabelFields = schema.labelHeadings;

  function updateDraft<K extends keyof SelectOperationDraft>(key: K, value: SelectOperationDraft[K]) {
    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        [key]: value,
      },
    });
  }

  function updateScope(nextScope: SelectOperationDraft['scope']) {
    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        scope: nextScope,
      },
    });
  }

  function updateMode(nextMode: SelectOperationDraft['mode']) {
    const nextField = nextMode === 'labels' ? schema.labelHeadings[0] ?? '' : schema.variableHeadings[0] ?? '';
    const nextValues = nextMode === 'labels'
      ? schema.labelClassesByHeading[nextField]?.map((item) => item.name) ?? []
      : [];

    onChange({
      ...form,
      draftStep: {
        ...form.draftStep,
        mode: nextMode,
        field: nextField,
        operator: nextMode === 'labels' ? 'in' : form.draftStep.scope === 'within' ? 'in' : 'in',
        values: nextValues,
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

  function applyAllVariables() {
    updateDraft('values', [...availableVariableFields]);
  }

  function addOperation() {
    onChange({
      ...form,
      operations: [...form.operations, form.draftStep],
      draftStep: {
        ...form.draftStep,
        values: form.draftStep.mode === 'labels'
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
          <label htmlFor="select-scope">Scope</label>
          <select id="select-scope" onChange={(event) => updateScope(event.target.value as SelectOperationDraft['scope'])} value={form.draftStep.scope}>
            <option value="across">Across data objects</option>
            <option value="within">Within each data object</option>
          </select>
        </div>
        <div className="field field--inline select-builder-field">
          <label htmlFor="select-mode">Select by</label>
          <select id="select-mode" onChange={(event) => updateMode(event.target.value as SelectOperationDraft['mode'])} value={form.draftStep.mode}>
            <option value="labels">Labels</option>
            <option value="variables">Variables</option>
          </select>
        </div>
      </div>

      {form.draftStep.mode === 'labels' ? (
        <>
          <div className="field-row field-row--double select-builder-row">
            <div className="field field--inline select-builder-field">
              <label htmlFor="select-label-field">Label heading</label>
              <select id="select-label-field" onChange={(event) => updateField(event.target.value)} value={form.draftStep.field}>
                {availableLabelFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            <div className="field field--inline select-builder-field">
              <label htmlFor="select-label-operator">Label rule</label>
              <select id="select-label-operator" onChange={(event) => updateDraft('operator', event.target.value as SelectOperationDraft['operator'])} value={form.draftStep.operator}>
                <option value="in">include selected labels</option>
                <option value="notEquals">exclude selected labels</option>
                <option value="equals">match one selected label</option>
              </select>
            </div>
          </div>

          <div className="action-row action-row--tight select-builder-shortcuts">
            <button className="button button--ghost button--small" onClick={applyAllLabelValues} type="button">
              Select all common labels
            </button>
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
                  <small>{item.count} objects</small>
                </label>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="field-row field-row--double select-builder-row">
            <div className="field field--inline select-builder-field">
              <label htmlFor="select-variable-field">Variable field</label>
              <select id="select-variable-field" onChange={(event) => updateField(event.target.value)} value={form.draftStep.field}>
                {availableVariableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            <div className="field field--inline select-builder-field">
              <label htmlFor="select-variable-operator">Variable rule</label>
              <select id="select-variable-operator" onChange={(event) => updateDraft('operator', event.target.value as SelectOperationDraft['operator'])} value={form.draftStep.operator}>
                {form.draftStep.scope === 'within' ? (
                  <>
                    <option value="in">keep selected variables</option>
                    <option value="notEquals">remove selected variables</option>
                    <option value="between">filter by value range</option>
                    <option value="gt">filter values &gt;</option>
                    <option value="lt">filter values &lt;</option>
                    <option value="equals">filter values =</option>
                  </>
                ) : (
                  <>
                    <option value="in">include objects containing selected variables</option>
                    <option value="notEquals">exclude objects containing selected variables</option>
                    <option value="between">filter by value range</option>
                    <option value="gt">filter values &gt;</option>
                    <option value="lt">filter values &lt;</option>
                    <option value="equals">filter values =</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {(form.draftStep.operator === 'in' || form.draftStep.operator === 'notEquals') ? (
            <>
              <div className="action-row action-row--tight select-builder-shortcuts">
                <button className="button button--ghost button--small" onClick={applyAllVariables} type="button">
                  Select all common variables
                </button>
                <button className="button button--ghost button--small" onClick={applyAllVariables} type="button">
                  Select all variables
                </button>
              </div>

              <div className="field">
                <label>Variables</label>
                <div className="checkbox-grid checkbox-grid--compact select-builder-card-grid">
                  {availableVariableFields.map((item) => (
                    <label className="checkbox-card" key={item}>
                      <input checked={form.draftStep.values.includes(item)} onChange={() => toggleDraftValue(item)} type="checkbox" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="field-row field-row--double">
              <div className="field field--inline">
                <label htmlFor="select-min-value">{form.draftStep.operator === 'between' ? 'Minimum value' : 'Value'}</label>
                <input id="select-min-value" onChange={(event) => updateDraft('minValue', event.target.value)} placeholder="e.g. 0.5" value={form.draftStep.minValue} />
              </div>
              {form.draftStep.operator === 'between' ? (
                <div className="field field--inline">
                  <label htmlFor="select-max-value">Maximum value</label>
                  <input id="select-max-value" onChange={(event) => updateDraft('maxValue', event.target.value)} placeholder="e.g. 1.0" value={form.draftStep.maxValue} />
                </div>
              ) : null}
            </div>
          )}
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
                <span>{operation.scope === 'across' ? 'Across data objects' : 'Within data objects'}</span>
                <span className="muted"> | {operation.mode === 'labels' ? 'Labels' : 'Variables'} | {operation.field} | {formatOperationValue(operation)}</span>
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

function formatOperationValue(operation: SelectOperationDraft) {
  if (operation.mode === 'labels') {
    if (operation.operator === 'equals') {
      return `match ${operation.values[0] ?? ''}`;
    }

    return `${operation.operator === 'notEquals' ? 'exclude' : 'include'} ${operation.values.join(', ')}`;
  }

  if (operation.operator === 'in') {
    return `${operation.scope === 'within' ? 'keep' : 'include'} ${operation.values.join(', ')}`;
  }

  if (operation.operator === 'notEquals') {
    return `${operation.scope === 'within' ? 'remove' : 'exclude'} ${operation.values.join(', ')}`;
  }

  if (operation.operator === 'between') {
    return `between ${operation.minValue} and ${operation.maxValue}`;
  }

  const symbol = operation.operator === 'gt' ? '>' : operation.operator === 'lt' ? '<' : '=';
  return `${symbol} ${operation.minValue}`;
}
