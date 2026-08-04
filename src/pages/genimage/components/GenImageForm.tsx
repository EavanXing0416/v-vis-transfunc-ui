import type { ChangeEvent } from 'react';
import { GENIMAGE_SHAPES, GENIMAGE_VARIABLES, type GenImageFormState, type GenImageShape, type GenImageVariable } from '../../../features/genimage/genImage.types';

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
  const shapeEnabled = form.changedVariables.includes('shape');
  const visibleRangeFields = RANGE_FIELDS.filter(({ variable }) => form.changedVariables.includes(variable));

  function update<K extends keyof GenImageFormState>(key: K, value: GenImageFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function updateRange(key: RangeKey, field: 'min' | 'max' | 'levels', value: number) {
    update(key, {
      ...form[key],
      [field]: value,
    });
  }

  function handleNumberChange(key: 'numberOfImages' | 'imageWidth' | 'imageHeight' | 'randomSeed') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value));
    };
  }

  function handleRangeChange(key: RangeKey, field: 'min' | 'max' | 'levels') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      updateRange(key, field, Number(event.target.value));
    };
  }

  function toggleVariable(value: GenImageVariable) {
    const nextValues = form.changedVariables.includes(value)
      ? form.changedVariables.filter((item) => item !== value)
      : [...form.changedVariables, value];

    update('changedVariables', nextValues);
  }

  function toggleShape(value: GenImageShape) {
    const nextValues = form.shapeValues.includes(value)
      ? form.shapeValues.filter((item) => item !== value)
      : [...form.shapeValues, value];

    update('shapeValues', nextValues);
  }

  return (
    <div className="partition-split-layout">
      <div className="field field--stacked">
        <label>Changed variables</label>
        <div className="checkbox-grid genimage-checkbox-grid genimage-checkbox-grid--full">
          {GENIMAGE_VARIABLES.map((variable) => (
            <label className="checkbox-card" key={variable}>
              <input checked={form.changedVariables.includes(variable)} onChange={() => toggleVariable(variable)} type="checkbox" />
              <span>{variable}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="field field--stacked">
        <div className="section-title section-title--field">
          <label>Variable configuration</label>
          {!shapeEnabled && visibleRangeFields.length === 0 ? (
            <span className="inline-hint inline-hint--warning">Select changed variables to configure this section.</span>
          ) : !shapeEnabled ? (
            <span className="inline-hint inline-hint--warning">Enable `shape` above if you need shape values.</span>
          ) : null}
        </div>

        {shapeEnabled ? (
          <div className="field field--stacked genimage-subsection">
            <label>Shape values</label>
            <div className="checkbox-grid genimage-checkbox-grid genimage-checkbox-grid--full genimage-checkbox-grid--shapes">
              {GENIMAGE_SHAPES.map((shape) => (
                <label className="checkbox-card" key={shape}>
                  <input checked={form.shapeValues.includes(shape)} onChange={() => toggleShape(shape)} type="checkbox" />
                  <span>{shape}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {visibleRangeFields.length > 0 ? (
          <div className="field field--stacked genimage-subsection">
            <label>Ranges and levels</label>
            <div className="dataset-summary-table dataset-summary-table--aligned genimage-range-table">
              <div className="dataset-summary-table__head genimage-range-table__head">
                <span>Variable</span>
                <span>Min</span>
                <span>Max</span>
                <span>Levels</span>
              </div>
              {visibleRangeFields.map(({ label, key, step }) => (
                <article className="dataset-summary-row genimage-range-table__row" key={key}>
                  <span>{label}</span>
                  <input onChange={handleRangeChange(key, 'min')} step={step ?? 0.01} type="number" value={form[key].min} />
                  <input onChange={handleRangeChange(key, 'max')} step={step ?? 0.01} type="number" value={form[key].max} />
                  <input min="1" onChange={handleRangeChange(key, 'levels')} step="1" type="number" value={form[key].levels} />
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="field-row genimage-row genimage-row--four">
        <div className="field field--stacked">
          <label htmlFor="genimage-count">Number of images</label>
          <input id="genimage-count" min="1" onChange={handleNumberChange('numberOfImages')} step="1" type="number" value={form.numberOfImages} />
        </div>
        <div className="field field--stacked">
          <label htmlFor="genimage-width">Image width</label>
          <input id="genimage-width" min="1" onChange={handleNumberChange('imageWidth')} step="1" type="number" value={form.imageWidth} />
        </div>
        <div className="field field--stacked">
          <label htmlFor="genimage-height">Image height</label>
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
