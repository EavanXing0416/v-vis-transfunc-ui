import type { ChangeEvent } from 'react';
import type { ImputeTSFormState } from '../../../features/imputets/imputeTS.types';

interface ImputeTSFormProps {
  form: ImputeTSFormState;
  onChange: (nextForm: ImputeTSFormState) => void;
  validationMessage: string | null;
}

export function ImputeTSForm({ form, onChange, validationMessage }: ImputeTSFormProps) {
  function update<K extends keyof ImputeTSFormState>(key: K, value: ImputeTSFormState[K]) {
    onChange({ ...form, [key]: value });
  }

  function handleMinimumChange(event: ChangeEvent<HTMLInputElement>) {
    update('minValidSamples', Number(event.target.value));
  }

  return (
    <div className="partition-split-layout">
      <div className="stft-row stft-row--double">
        <div className="field field--inline field--inline-long">
          <label htmlFor="imputets-fill-strategy">Fill strategy</label>
          <div className="field-control-stack">
            <input id="imputets-fill-strategy" onChange={(event) => update('fillStrategy', event.target.value)} type="text" value={form.fillStrategy} />
            <span className="field-hint">Default: ffill_then_zero. Enter another backend-supported strategy name if needed.</span>
          </div>
        </div>
        <div className="field field--inline field--inline-long">
          <label htmlFor="imputets-min-valid">Minimum valid samples</label>
          <div className="field-control-stack">
            <input id="imputets-min-valid" min="1" onChange={handleMinimumChange} step="1" type="number" value={form.minValidSamples} />
            <span className="field-hint">Minimum observed samples required before a signal is retained; otherwise it is zeroed.</span>
          </div>
        </div>
      </div>
      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
