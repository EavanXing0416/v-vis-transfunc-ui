import type { ChangeEvent } from 'react';
import type { CropTSFormState } from '../../../features/cropts/cropTS.types';

interface CropTSFormProps {
  form: CropTSFormState;
  onChange: (nextForm: CropTSFormState) => void;
  validationMessage: string | null;
}

export function CropTSForm({ form, onChange, validationMessage }: CropTSFormProps) {
  function update<K extends keyof CropTSFormState>(key: K, value: CropTSFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function handleNumberChange(key: 'ipThresholdKa' | 'flattopMinFrac') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value));
    };
  }

  return (
    <div className="partition-split-layout">
      <div className="stft-row stft-row--double">
        <div className="field field--inline field--inline-long">
          <label htmlFor="cropts-ip-threshold">ip_threshold_ka</label>
          <div className="field-control-stack">
            <input id="cropts-ip-threshold" min="0" onChange={handleNumberChange('ipThresholdKa')} step="0.1" type="number" value={form.ipThresholdKa} />
            <span className="field-hint">Minimum plasma current used to detect plasma-on, in kA.</span>
          </div>
        </div>
        <div className="field field--inline field--inline-long">
          <label htmlFor="cropts-flattop-min-frac">flattop_min_frac</label>
          <div className="field-control-stack">
            <input id="cropts-flattop-min-frac" max="1" min="0" onChange={handleNumberChange('flattopMinFrac')} step="0.01" type="number" value={form.flattopMinFrac} />
            <span className="field-hint">Fraction of peak ip used to define the flat-top interval.</span>
          </div>
        </div>
      </div>

      <div className="stft-row stft-row--double">
        <div className="field field--inline field--inline-long">
          <label htmlFor="cropts-trim-start">flattop_trim_start_frac</label>
          <div className="field-control-stack">
            <input id="cropts-trim-start" max="1" min="0" onChange={(event) => update('flattopTrimStartFrac', event.target.value)} placeholder="optional" step="0.01" type="number" value={form.flattopTrimStartFrac} />
            <span className="field-hint">Optional fraction trimmed from the detected interval start.</span>
          </div>
        </div>
        <div className="field field--inline field--inline-long">
          <label htmlFor="cropts-trim-end">flattop_trim_end_frac</label>
          <div className="field-control-stack">
            <input id="cropts-trim-end" max="1" min="0" onChange={(event) => update('flattopTrimEndFrac', event.target.value)} placeholder="optional" step="0.01" type="number" value={form.flattopTrimEndFrac} />
            <span className="field-hint">Optional fraction trimmed from the detected interval end.</span>
          </div>
        </div>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
