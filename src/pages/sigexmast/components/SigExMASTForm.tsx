import type { ChangeEvent } from 'react';
import { normalizeSignalKey } from '../../../features/sigexmast/sigExMAST.validation';
import { SIGEXMAST_DEFAULT_SIGNALS } from '../../../features/sigexmast/sigExMAST.types';
import type { SigExMASTDefaultSignal, SigExMASTFormState } from '../../../features/sigexmast/sigExMAST.types';

interface ShotListOption {
  id: string;
  name: string;
}

interface SigExMASTFormProps {
  form: SigExMASTFormState;
  onChange: (nextForm: SigExMASTFormState) => void;
  validationMessage: string | null;
  shotListDatasets: ShotListOption[];
}

export function SigExMASTForm({ form, onChange, validationMessage, shotListDatasets }: SigExMASTFormProps) {
  const customSignals = form.signals.filter((signal) => !SIGEXMAST_DEFAULT_SIGNALS.includes(signal as SigExMASTDefaultSignal));
  function update<K extends keyof SigExMASTFormState>(key: K, value: SigExMASTFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function toggleSignal(signal: SigExMASTDefaultSignal | string) {
    const nextSignals = form.signals.includes(signal)
      ? form.signals.filter((item) => item !== signal)
      : [...form.signals, signal];

    update('signals', nextSignals);
  }

  function handleManualShotIdsChange(event: ChangeEvent<HTMLTextAreaElement>) {
    update('manualShotIds', event.target.value);
  }

  function handleShotPathChange(event: ChangeEvent<HTMLInputElement>) {
    update('shotPath', event.target.value);
  }

  function handleCustomSignalChange(event: ChangeEvent<HTMLInputElement>) {
    update('customSignalKey', event.target.value);
  }

  function handleAddCustomSignal() {
    const normalized = normalizeSignalKey(form.customSignalKey);

    if (!normalized || form.signals.includes(normalized)) {
      update('customSignalKey', '');
      return;
    }

    onChange({
      ...form,
      signals: [...form.signals, normalized],
      customSignalKey: '',
    });
  }

  function removeCustomSignal(signalToRemove: string) {
    update(
      'signals',
      form.signals.filter((signal) => signal !== signalToRemove),
    );
  }

  return (
    <div className="partition-split-layout">
      <div className="sigexmast-row sigexmast-row--double">
        <div className="field field--inline">
          <label htmlFor="sigexmast-campaign">Campaign</label>
          <select id="sigexmast-campaign" onChange={(event) => update('campaign', event.target.value as SigExMASTFormState['campaign'])} value={form.campaign}>
            <option value="MAST">MAST</option>
            <option value="MAST-U">MAST-U</option>
          </select>
        </div>
        <div className="field field--inline">
          <label htmlFor="sigexmast-shot-source">Shot source</label>
          <select id="sigexmast-shot-source" onChange={(event) => update('shotSource', event.target.value as SigExMASTFormState['shotSource'])} value={form.shotSource}>
            {shotListDatasets.length > 0 ? <option value="input_dataset">Shot from input datasets</option> : null}
            <option value="input_path">Input path</option>
            <option value="manual">Manual shot IDs</option>
          </select>
        </div>
      </div>

      {form.shotSource === 'input_dataset' ? (
        <div className="field field--inline">
          <label htmlFor="sigexmast-shot-dataset">Shot-list dataset</label>
          <select id="sigexmast-shot-dataset" onChange={(event) => update('selectedShotDatasetId', event.target.value)} value={form.selectedShotDatasetId}>
            {shotListDatasets.map((dataset) => (
              <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
            ))}
          </select>
        </div>
      ) : null}

      {form.shotSource === 'input_path' ? (
        <div className="field">
          <label htmlFor="sigexmast-shot-path">Shot-list path</label>
          <input
            id="sigexmast-shot-path"
            onChange={handleShotPathChange}
            placeholder="e.g. data/shots/train_shots.csv"
            type="text"
            value={form.shotPath}
          />
        </div>
      ) : null}

      {form.shotSource === 'manual' ? (
        <div className="field">
          <label htmlFor="sigexmast-shot-ids">Shot IDs</label>
          <textarea
            id="sigexmast-shot-ids"
            onChange={handleManualShotIdsChange}
            placeholder="e.g. 24123, 24124, 24125"
            value={form.manualShotIds}
          />
        </div>
      ) : null}

      <div className="field">
        <label>Signals to retrieve</label>
        <div className="sigexmast-channel-grid">
          {SIGEXMAST_DEFAULT_SIGNALS.map((signal) => (
            <label className="sigexmast-channel-option" key={signal}>
              <input
                checked={form.signals.includes(signal)}
                onChange={() => toggleSignal(signal)}
                type="checkbox"
              />
              <span>{signal}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sigexmast-custom-row">
        <div className="field field--inline">
          <label htmlFor="sigexmast-custom-signal">Custom signal key</label>
          <input
            id="sigexmast-custom-signal"
            onChange={handleCustomSignalChange}
            placeholder="e.g. sxr_edge"
            type="text"
            value={form.customSignalKey}
          />
        </div>
        <button className="button button--secondary" onClick={handleAddCustomSignal} type="button">
          Add key
        </button>
      </div>

      {customSignals.length > 0 ? (
        <div className="sigexmast-custom-list">
          <p className="sigexmast-inline-note">Custom keys</p>
          <div className="sigexmast-custom-tags">
            {customSignals.map((signal) => (
              <button
                className="sigexmast-custom-tag"
                key={signal}
                onClick={() => removeCustomSignal(signal)}
                type="button"
              >
                <span>{signal}</span>
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="sigexmast-inline-note">Selected key names ({form.signals.length}): {form.signals.join(', ')}</p>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
