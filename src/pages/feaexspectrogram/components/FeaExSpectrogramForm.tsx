import { formatSelectedComponents } from '../../../features/feaexspectrogram/feaExSpectrogramMetadata';
import type { FeaExSpectrogramComponent, FeaExSpectrogramFormState } from '../../../features/feaexspectrogram/feaExSpectrogram.types';

interface FeaExSpectrogramFormProps {
  availableComponents: FeaExSpectrogramComponent[];
  form: FeaExSpectrogramFormState;
  onChange: (nextForm: FeaExSpectrogramFormState) => void;
  showAdvancedInstruction: boolean;
  validationMessage: string | null;
}

export function FeaExSpectrogramForm({ availableComponents, form, onChange, showAdvancedInstruction, validationMessage }: FeaExSpectrogramFormProps) {
  function update<K extends keyof FeaExSpectrogramFormState>(key: K, value: FeaExSpectrogramFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  return (
    <div className="partition-split-layout">
      <div className="field field--inline">
        <label htmlFor="feature-components">Selected components</label>
        <select id="feature-components" onChange={(event) => update('selectedComponents', event.target.value as FeaExSpectrogramComponent)} value={form.selectedComponents}>
          {availableComponents.map((component) => (
            <option key={component} value={component}>{formatSelectedComponents(component)}</option>
          ))}
        </select>
      </div>

      {showAdvancedInstruction ? (
        <>
          <div className="field field--inline">
            <label htmlFor="feature-enable-advanced">Enable advanced extraction</label>
            <label className="checkbox-inline--compact" htmlFor="feature-enable-advanced">
              <input checked={form.enableAdvancedExtraction} id="feature-enable-advanced" onChange={(event) => update('enableAdvancedExtraction', event.target.checked)} type="checkbox" />
            </label>
          </div>

          {form.enableAdvancedExtraction ? (
            <div className="field">
              <label htmlFor="feature-advanced-instruction">Advanced extraction instruction</label>
              <textarea
                id="feature-advanced-instruction"
                onChange={(event) => update('advancedInstruction', event.target.value)}
                placeholder="For example: derive log-magnitude, export custom real/imaginary scaling, or apply a task-specific feature recipe."
                value={form.advancedInstruction}
              />
            </div>
          ) : null}
        </>
      ) : null}

      <div className="field field--inline">
        <label htmlFor="feature-preserve-labels">Preserve label associations</label>
        <label className="checkbox-inline--compact" htmlFor="feature-preserve-labels">
          <input checked={form.preserveLabelAssociations} id="feature-preserve-labels" onChange={(event) => update('preserveLabelAssociations', event.target.checked)} type="checkbox" />
        </label>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
