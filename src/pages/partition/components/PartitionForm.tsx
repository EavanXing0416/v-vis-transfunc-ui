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

  const shuffleDisabled = form.strategy === 'time_based_split' && form.keepTemporalOrder;

  return (
    <div className="partition-split-layout">
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
        <span className="field-hint">{strategyHint(form.strategy)}</span>
      </div>

      <div className="ratio-grid">
        <div className="field">
          <label htmlFor="train-ratio">Train ratio</label>
          <input id="train-ratio" max="1" min="0" onChange={handleRatioChange('trainRatio')} step="0.01" type="number" value={form.trainRatio} />
        </div>
        <div className="field">
          <label htmlFor="validation-ratio">Validation ratio</label>
          <input id="validation-ratio" max="1" min="0" onChange={handleRatioChange('validationRatio')} step="0.01" type="number" value={form.validationRatio} />
        </div>
        <div className="field">
          <label htmlFor="test-ratio">Test ratio</label>
          <input id="test-ratio" max="1" min="0" onChange={handleRatioChange('testRatio')} step="0.01" type="number" value={form.testRatio} />
        </div>
      </div>

      <div className="two-col-grid">
        <div className="field">
          <label htmlFor="random-seed">Random seed</label>
          <input id="random-seed" onChange={(event) => update('randomSeed', Number(event.target.value))} step="1" type="number" value={form.randomSeed} />
        </div>
        <div className={`field ${shuffleDisabled ? 'field--disabled' : ''}`}>
          <label htmlFor="shuffle">Shuffle before split</label>
          <select
            id="shuffle"
            disabled={shuffleDisabled}
            onChange={(event) => update('shuffle', event.target.value === 'true')}
            value={String(form.shuffle)}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      {form.strategy === 'stratified_split' ? (
        <div className="field">
          <label htmlFor="stratify-by">Stratify by</label>
          <input id="stratify-by" onChange={(event) => update('stratifyBy', event.target.value)} placeholder="label, status_type_id, class_name" value={form.stratifyBy} />
          <span className="field-hint">Keeps class distribution similar across train, validation, and test outputs.</span>
        </div>
      ) : null}

      {form.strategy === 'time_based_split' ? (
        <div className="two-col-grid">
          <div className="field">
            <label htmlFor="time-field">Time field</label>
            <input id="time-field" onChange={(event) => update('timeField', event.target.value)} placeholder="time_stamp" value={form.timeField} />
          </div>
          <div className="field">
            <label htmlFor="keep-temporal-order">Keep temporal order</label>
            <select id="keep-temporal-order" onChange={(event) => update('keepTemporalOrder', event.target.value === 'true')} value={String(form.keepTemporalOrder)}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function strategyHint(strategy: PartitionFormState['strategy']) {
  switch (strategy) {
    case 'random_split':
      return 'Use when records can be mixed freely.';
    case 'stratified_split':
      return 'Use when label balance should stay similar across outputs.';
    case 'time_based_split':
      return 'Use for temporal data so later records stay out of training.';
    default:
      return '';
  }
}
