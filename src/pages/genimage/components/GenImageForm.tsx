import type { ChangeEvent } from 'react';
import { GENIMAGE_SHAPES, GENIMAGE_VARIABLES, type GenImageFormState, type GenImageShape, type GenImageVariable, type GenImageVariableMode } from '../../../features/genimage/genImage.types';

interface GenImageFormProps {
  form: GenImageFormState;
  onChange: (nextForm: GenImageFormState) => void;
  validationMessage: string | null;
}

type RangeKey = 'scale' | 'size' | 'posX' | 'posY' | 'rotation' | 'grey';

const RANGE_FIELDS: Array<{ label: string; key: RangeKey; variable: GenImageVariable; step?: number }> = [
  { label: 'scale', key: 'scale', variable: 'scale', step: 0.01 },
  { label: 'size', key: 'size', variable: 'size', step: 0.01 },
  { label: 'pos_x', key: 'posX', variable: 'pos_x', step: 0.01 },
  { label: 'pos_y', key: 'posY', variable: 'pos_y', step: 0.01 },
  { label: 'rotation', key: 'rotation', variable: 'rotation', step: 1 },
  { label: 'grey', key: 'grey', variable: 'grey', step: 1 },
];

export function GenImageForm({ form, onChange, validationMessage }: GenImageFormProps) {
  function update<K extends keyof GenImageFormState>(key: K, value: GenImageFormState[K]) {
    onChange({ ...form, [key]: value });
  }

  function updateRange(key: RangeKey, field: 'min' | 'max' | 'fixedValue' | 'levels', value: number) {
    update(key, { ...form[key], [field]: value });
  }

  function updateMode(variable: GenImageVariable, mode: GenImageVariableMode) {
    update('variableModes', { ...form.variableModes, [variable]: mode });
  }

  function handleNumberChange(key: 'numberOfImages' | 'imageWidth' | 'imageHeight' | 'randomSeed') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value));
    };
  }

  function handleRangeChange(key: RangeKey, field: 'min' | 'max' | 'fixedValue' | 'levels') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      updateRange(key, field, Number(event.target.value));
    };
  }

  function toggleChangedShape(value: GenImageShape) {
    const nextValues = form.changedShapeValues.includes(value)
      ? form.changedShapeValues.filter((item) => item !== value)
      : [...form.changedShapeValues, value];
    update('changedShapeValues', nextValues);
  }

  return (
    <div className="partition-split-layout">
      <div className="field field--stacked">
        <label>Variable configuration</label>
        <div className="dataset-summary-table dataset-summary-table--aligned genimage-range-table">
          <div className="dataset-summary-table__head genimage-range-table__head">
            <span>Variable</span>
            <span>Mode</span>
            <span>Configuration</span>
          </div>
          {GENIMAGE_VARIABLES.map((variable) => {
            const mode = form.variableModes[variable];
            const rangeField = RANGE_FIELDS.find((item) => item.variable === variable);
            return (
              <article className="dataset-summary-row genimage-range-table__row" key={variable}>
                <span>{variable}</span>
                <select value={mode} onChange={(event) => updateMode(variable, event.target.value as GenImageVariableMode)}>
                  <option value="changed">changed</option>
                  <option value="fixed">fixed</option>
                </select>
                <div className="field field--stacked" style={{ gap: '8px' }}>
                  {variable === 'shape' ? (
                    mode === 'changed' ? (
                      <div className="checkbox-grid genimage-checkbox-grid genimage-checkbox-grid--full genimage-checkbox-grid--shapes">
                        {GENIMAGE_SHAPES.map((shape) => (
                          <label className="checkbox-card" key={shape}>
                            <input checked={form.changedShapeValues.includes(shape)} onChange={() => toggleChangedShape(shape)} type="checkbox" />
                            <span>{shape}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <select value={form.fixedShapeValue} onChange={(event) => update('fixedShapeValue', event.target.value as GenImageShape)}>
                        {GENIMAGE_SHAPES.map((shape) => (
                          <option key={shape} value={shape}>{shape}</option>
                        ))}
                      </select>
                    )
                  ) : rangeField ? (
                    mode === 'changed' ? (
                      <div className="genimage-inline-config genimage-inline-config--three">
                        <label className="genimage-inline-pair">
                          <span>Min</span>
                          <input onChange={handleRangeChange(rangeField.key, 'min')} step={rangeField.step ?? 0.01} type="number" value={form[rangeField.key].min} />
                        </label>
                        <label className="genimage-inline-pair">
                          <span>Max</span>
                          <input onChange={handleRangeChange(rangeField.key, 'max')} step={rangeField.step ?? 0.01} type="number" value={form[rangeField.key].max} />
                        </label>
                        <label className="genimage-inline-pair">
                          <span>Levels</span>
                          <input min="1" onChange={handleRangeChange(rangeField.key, 'levels')} step="1" type="number" value={form[rangeField.key].levels} />
                        </label>
                      </div>
                    ) : (
                      <div className="genimage-inline-config genimage-inline-config--two">
                        <label className="genimage-inline-pair">
                          <span>Fixed value</span>
                          <input onChange={handleRangeChange(rangeField.key, 'fixedValue')} step={rangeField.step ?? 0.01} type="number" value={form[rangeField.key].fixedValue} />
                        </label>
                        <label className="genimage-inline-pair">
                          <span>Levels</span>
                          <input min="1" onChange={handleRangeChange(rangeField.key, 'levels')} step="1" type="number" value={form[rangeField.key].levels} />
                        </label>
                      </div>
                    )
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="field-row genimage-row genimage-row--four">
        <div className="field field--stacked">
          <label htmlFor="genimage-count">Number of images</label>
          <input id="genimage-count" min="1" onChange={handleNumberChange('numberOfImages')} step="1" type="number" value={form.numberOfImages} />
        </div>
        <div className="field field--stacked">
          <label htmlFor="genimage-width">Image width (px)</label>
          <input id="genimage-width" min="1" onChange={handleNumberChange('imageWidth')} step="1" type="number" value={form.imageWidth} />
        </div>
        <div className="field field--stacked">
          <label htmlFor="genimage-height">Image height (px)</label>
          <input id="genimage-height" min="1" onChange={handleNumberChange('imageHeight')} step="1" type="number" value={form.imageHeight} />
        </div>
        <div className="field field--stacked">
          <label htmlFor="genimage-random-seed">Random seed</label>
          <input id="genimage-random-seed" min="0" onChange={handleNumberChange('randomSeed')} step="1" type="number" value={form.randomSeed} />
        </div>
      </div>

      <div className="field-row genimage-row genimage-row--two">
        <div className="field field--stacked">
          <label htmlFor="genimage-output-format">Output format</label>
          <select id="genimage-output-format" onChange={(event) => update('outputFormat', event.target.value as GenImageFormState['outputFormat'])} value={form.outputFormat}>
            <option value="png">png</option>
            <option value="jpg">jpg</option>
          </select>
        </div>
        <div className="field field--stacked">
          <label htmlFor="genimage-sampling-rule">Sampling rule</label>
          <select id="genimage-sampling-rule" onChange={(event) => update('samplingRule', event.target.value as GenImageFormState['samplingRule'])} value={form.samplingRule}>
            <option value="enumerate">enumerate</option>
            <option value="random">random</option>
          </select>
        </div>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
