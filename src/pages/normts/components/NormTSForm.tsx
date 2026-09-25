import type { NormTSFormState } from '../../../features/normts/normTS.types';

interface NormTSFormProps {
  form: NormTSFormState;
  onChange: (nextForm: NormTSFormState) => void;
  validationMessage: string | null;
}

export function NormTSForm({ form, onChange, validationMessage }: NormTSFormProps) {
  function update<K extends keyof NormTSFormState>(key: K, value: NormTSFormState[K]) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className="partition-split-layout">
      <div className="stft-row stft-row--double">
        <div className="field field--inline field--inline-long">
          <label htmlFor="normts-method">Normalization method</label>
          <div className="field-control-stack">
            <select id="normts-method" onChange={(event) => update('method', event.target.value as NormTSFormState['method'])} value={form.method}>
              <option value="robust_zscore">Robust z-score</option>
              <option value="standard_scaler">Standard scaler</option>
            </select>
            <span className="field-hint">Scaling scheme applied independently to each signal.</span>
          </div>
        </div>
        <div className="field field--inline field--inline-long">
          <label htmlFor="normts-epsilon">Epsilon</label>
          <div className="field-control-stack">
            <input id="normts-epsilon" min="0" onChange={(event) => update('epsilon', event.target.value)} step="0.00000001" type="number" value={form.epsilon} />
            <span className="field-hint">Small positive value that prevents divide-by-zero on flat signals.</span>
          </div>
        </div>
      </div>

      <div className="stft-row stft-row--double">
        <div className="field field--inline field--inline-long">
          <label htmlFor="normts-fit-scope">Fit scope</label>
          <div className="field-control-stack">
            <select id="normts-fit-scope" onChange={(event) => update('fitScope', event.target.value as NormTSFormState['fitScope'])} value={form.fitScope}>
              <option value="per_shot">Per shot</option>
              <option value="per_cv_fold">Per CV fold</option>
            </select>
            <span className="field-hint">Controls where normalization statistics are fitted.</span>
          </div>
        </div>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
