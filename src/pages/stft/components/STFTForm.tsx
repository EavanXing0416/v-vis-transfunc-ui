import type { ChangeEvent } from 'react';
import type { STFTFormState } from '../../../features/stft/stft.types';

interface STFTFormProps {
  form: STFTFormState;
  onChange: (nextForm: STFTFormState) => void;
  validationMessage: string | null;
  labelsAvailable: boolean;
}

export function STFTForm({ form, onChange, validationMessage, labelsAvailable }: STFTFormProps) {
  function update<K extends keyof STFTFormState>(key: K, value: STFTFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function handleNumberChange(key: 'sampleRate' | 'fftSize' | 'windowLength' | 'hopLength') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value));
    };
  }

  return (
    <div className="partition-split-layout">
      <div className="stft-row stft-row--double">
        <div className="field field--inline">
          <label htmlFor="stft-sample-rate">Sample rate</label>
          <input id="stft-sample-rate" min="1" onChange={handleNumberChange('sampleRate')} step="1" type="number" value={form.sampleRate} />
        </div>
        <div className="field field--inline">
          <label htmlFor="stft-fft-size">FFT size</label>
          <input id="stft-fft-size" min="1" onChange={handleNumberChange('fftSize')} step="1" type="number" value={form.fftSize} />
        </div>
      </div>

      <div className="stft-row stft-row--double">
        <div className="field field--inline">
          <label htmlFor="stft-window-length">Window length</label>
          <input id="stft-window-length" min="1" onChange={handleNumberChange('windowLength')} step="1" type="number" value={form.windowLength} />
        </div>
        <div className="field field--inline">
          <label htmlFor="stft-hop-length">Hop length</label>
          <input id="stft-hop-length" min="1" onChange={handleNumberChange('hopLength')} step="1" type="number" value={form.hopLength} />
        </div>
      </div>

      <div className="stft-row stft-row--double">
        <div className="field field--inline">
          <label htmlFor="stft-window-type">Window type</label>
          <select id="stft-window-type" onChange={(event) => update('windowType', event.target.value as STFTFormState['windowType'])} value={form.windowType}>
            <option value="hann">hann</option>
            <option value="hamming">hamming</option>
            <option value="rectangular">rectangular</option>
          </select>
        </div>
        <div className="field field--inline">
          <label htmlFor="stft-stored-components">Stored components</label>
          <select id="stft-stored-components" onChange={(event) => update('storedComponents', event.target.value as STFTFormState['storedComponents'])} value={form.storedComponents}>
            <option value="complex">complex</option>
            <option value="magnitude">magnitude</option>
            <option value="phase">phase</option>
            <option value="magnitude_phase">magnitude + phase</option>
          </select>
        </div>
      </div>

      <div className="stft-row">
        <div className="field field--inline">
          <label htmlFor="stft-apply-labels">Apply STFT to labels</label>
          <label className="checkbox-inline--compact" htmlFor="stft-apply-labels">
            <input checked={form.applyToLabels} disabled={!labelsAvailable} id="stft-apply-labels" onChange={(event) => update('applyToLabels', event.target.checked)} type="checkbox" />
          </label>
        </div>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
