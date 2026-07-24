import type { ChangeEvent } from 'react';
import type { PartitionFormState } from '../../../features/partition/partition.types';

interface PartitionFormProps {
  form: PartitionFormState;
  onChange: (nextForm: PartitionFormState) => void;
  validationMessage: string | null;
}

export function PartitionForm({ form, onChange, validationMessage }: PartitionFormProps) {
  function update<K extends keyof PartitionFormState>(key: K, value: PartitionFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function handleRatioChange(key: 'trainRatio' | 'validationRatio' | 'testRatio') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value));
    };
  }

  return (
    <div className="partition-split-layout">
      <div className="field field--inline">
        <label htmlFor="partition-method">Method</label>
        <select id="partition-method" onChange={(event) => update('method', event.target.value as PartitionFormState['method'])} value={form.method}>
          <option value="random">Random</option>
          <option value="chunk">Chunk</option>
        </select>
      </div>

      {form.method === 'random' ? (
        <div className="field field--inline">
          <label htmlFor="random-seed">Random seed</label>
          <input id="random-seed" onChange={(event) => update('randomSeed', Number(event.target.value))} step="1" type="number" value={form.randomSeed} />
        </div>
      ) : null}

      <div className="ratio-grid">
        <div className="field">
          <label htmlFor="train-ratio">Train ratio</label>
          <input id="train-ratio" max="0.999" min="0" onChange={handleRatioChange('trainRatio')} step="0.01" type="number" value={form.trainRatio} />
        </div>
        <div className="field">
          <label htmlFor="validation-ratio">Validation ratio</label>
          <input id="validation-ratio" max="0.999" min="0" onChange={handleRatioChange('validationRatio')} step="0.01" type="number" value={form.validationRatio} />
        </div>
        <div className="field">
          <label htmlFor="test-ratio">Test ratio</label>
          <input id="test-ratio" max="0.999" min="0" onChange={handleRatioChange('testRatio')} step="0.01" type="number" value={form.testRatio} />
        </div>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
