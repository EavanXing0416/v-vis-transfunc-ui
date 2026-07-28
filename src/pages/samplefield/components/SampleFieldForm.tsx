import type { ChangeEvent } from 'react';
import type { SampleFieldFormState } from '../../../features/samplefield/sampleField.types';

interface SampleFieldFormProps {
  form: SampleFieldFormState;
  onChange: (nextForm: SampleFieldFormState) => void;
  validationMessage: string | null;
}

export function SampleFieldForm({ form, onChange, validationMessage }: SampleFieldFormProps) {
  function update<K extends keyof SampleFieldFormState>(key: K, value: SampleFieldFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function handleNumberChange(key: 'randomSeed' | 'numberOfDataObjects' | 'numberOfSamplesPerObject') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value));
    };
  }

  return (
    <div className="partition-split-layout">
      <div className="field field--inline">
        <label htmlFor="samplefield-random-seed">Random seed</label>
        <input id="samplefield-random-seed" onChange={handleNumberChange('randomSeed')} step="1" type="number" value={form.randomSeed} />
      </div>

      <div className="field field--inline">
        <label htmlFor="samplefield-object-count">Number of data objects</label>
        <input id="samplefield-object-count" min="1" onChange={handleNumberChange('numberOfDataObjects')} step="1" type="number" value={form.numberOfDataObjects} />
      </div>

      <div className="field field--inline">
        <label htmlFor="samplefield-samples-per-object">Number of samples per object</label>
        <input id="samplefield-samples-per-object" min="1" onChange={handleNumberChange('numberOfSamplesPerObject')} step="1" type="number" value={form.numberOfSamplesPerObject} />
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
