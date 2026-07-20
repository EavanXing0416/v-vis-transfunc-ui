import type { ChangeEvent } from 'react';
import type { PartitionFormState } from '../../../features/partition/partition.types';

interface PartitionFormProps {
  form: PartitionFormState;
  onChange: (nextForm: PartitionFormState) => void;
}

export function PartitionForm({ form, onChange }: PartitionFormProps) {
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
    <div className="stack">
      <div className="field">
        <label htmlFor="partition-strategy">Split strategy</label>
        <select
          id="partition-strategy"
          onChange={(event) => update('strategy', event.target.value as PartitionFormState['strategy'])}
          value={form.strategy}
        >
          <option value="random_split">Random split</option>
          <option value="stratified_split">Stratified split</option>
          <option value="time_based_split">Time-based split</option>
        </select>
      </div>

      <div className="ratio-grid">
        <div className="field">
          <label htmlFor="train-ratio">Train ratio</label>
          <input
            id="train-ratio"
            max="1"
            min="0"
            onChange={handleRatioChange('trainRatio')}
            step="0.01"
            type="number"
            value={form.trainRatio}
          />
        </div>
        <div className="field">
          <label htmlFor="validation-ratio">Validation ratio</label>
          <input
            id="validation-ratio"
            max="1"
            min="0"
            onChange={handleRatioChange('validationRatio')}
            step="0.01"
            type="number"
            value={form.validationRatio}
          />
        </div>
        <div className="field">
          <label htmlFor="test-ratio">Test ratio</label>
          <input
            id="test-ratio"
            max="1"
            min="0"
            onChange={handleRatioChange('testRatio')}
            step="0.01"
            type="number"
            value={form.testRatio}
          />
        </div>
      </div>

      <div className="ratio-grid">
        <div className="field">
          <label htmlFor="random-seed">Random seed</label>
          <input
            id="random-seed"
            onChange={(event) => update('randomSeed', Number(event.target.value))}
            step="1"
            type="number"
            value={form.randomSeed}
          />
        </div>
        <div className="field">
          <label htmlFor="shuffle">Shuffle before split</label>
          <select
            id="shuffle"
            onChange={(event) => update('shuffle', event.target.value === 'true')}
            value={String(form.shuffle)}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
    </div>
  );
}
