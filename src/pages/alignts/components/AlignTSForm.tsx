import type { ChangeEvent } from 'react';
import type { AlignTSFormState } from '../../../features/alignts/alignTS.types';

interface AlignTSFormProps {
  form: AlignTSFormState;
  onChange: (nextForm: AlignTSFormState) => void;
  validationMessage: string | null;
}

export function AlignTSForm({ form, onChange, validationMessage }: AlignTSFormProps) {
  function update<K extends keyof AlignTSFormState>(key: K, value: AlignTSFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function handleNumberChange(key: 'tMin' | 'dt') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value));
    };
  }

  return (
    <div className="partition-split-layout">
      <div className="stft-row stft-row--double">
        <div className="field field--inline">
          <label htmlFor="alignts-t-min">Start time t_min (s)</label>
          <input id="alignts-t-min" onChange={handleNumberChange('tMin')} step="0.0001" type="number" value={form.tMin} />
        </div>
        <div className="field field--inline">
          <label htmlFor="alignts-t-max">End time t_max (s)</label>
          <input id="alignts-t-max" onChange={(event) => update('tMax', event.target.value)} placeholder="leave empty for signal max" step="0.0001" type="number" value={form.tMax} />
        </div>
      </div>

      <div className="stft-row stft-row--double">
        <div className="field field--inline">
          <label htmlFor="alignts-dt">Grid spacing dt (s)</label>
          <input id="alignts-dt" min="0.0000001" onChange={handleNumberChange('dt')} step="0.0001" type="number" value={form.dt} />
        </div>
        <div className="field field--inline">
          <label htmlFor="alignts-method">Interpolation method</label>
          <select id="alignts-method" onChange={(event) => update('method', event.target.value as AlignTSFormState['method'])} value={form.method}>
            <option value="nearest">nearest</option>
            <option value="linear">linear</option>
            <option value="cubic">cubic</option>
            <option value="zero">zero</option>
          </select>
        </div>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
