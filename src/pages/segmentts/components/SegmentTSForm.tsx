import type { SegmentTSFormState } from '../../../features/segmentts/segmentTS.types';
import { getSegmentTSCalculations } from '../../../features/segmentts/segmentTSMetadata';

interface SegmentTSFormProps {
  form: SegmentTSFormState;
  onChange: (nextForm: SegmentTSFormState) => void;
  validationMessage: string | null;
}

export function SegmentTSForm({ form, onChange, validationMessage }: SegmentTSFormProps) {
  const calculations = getSegmentTSCalculations(form);

  function update<K extends keyof SegmentTSFormState>(key: K, value: SegmentTSFormState[K]) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className="partition-split-layout">
        <div className="field field--inline field--inline-long">
          <label htmlFor="segmentts-window-ms">Window length (ms)</label>
          <div className="field-control-stack">
            <input id="segmentts-window-ms" min="0" onChange={(event) => update('windowMs', event.target.value)} placeholder="e.g. 20.0" step="0.1" type="number" value={form.windowMs} />
            <span className="field-hint">Duration covered by each generated time-series window.</span>
          </div>
        </div>
        <div className="field field--inline field--inline-long">
          <label htmlFor="segmentts-stride-ms">Stride (ms)</label>
          <div className="field-control-stack">
            <input id="segmentts-stride-ms" min="0" onChange={(event) => update('strideMs', event.target.value)} placeholder="e.g. 5.0" step="0.1" type="number" value={form.strideMs} />
            <span className="field-hint">Time step between the starting positions of consecutive windows.</span>
          </div>
        </div>

      <div className="field field--inline field--inline-long">
        <label htmlFor="segmentts-fs-hz">Sampling frequency (Hz)</label>
        <div className="field-control-stack">
          <input id="segmentts-fs-hz" min="1" onChange={(event) => update('fsHz', event.target.value)} placeholder="e.g. 10000" step="1" type="number" value={form.fsHz} />
          <span className="field-hint">Converts window and stride durations from milliseconds to sample counts.</span>
        </div>
      </div>

      <dl className="summary-list">
        <div className="summary-list__row"><dt>Window samples</dt><dd>{formatCalculation(calculations.windowSamples)}</dd></div>
        <div className="summary-list__row"><dt>Stride samples</dt><dd>{formatCalculation(calculations.strideSamples)}</dd></div>
        <div className="summary-list__row"><dt>Window relationship</dt><dd>{formatWindowRelationship(calculations.overlapPercent)}</dd></div>
        <div className="summary-list__row"><dt>Estimated output windows</dt><dd>n.a.</dd></div>
      </dl>

      {calculations.overlapPercent !== null && calculations.overlapPercent < 0 ? (
        <p className="inline-hint inline-hint--warning">Stride is greater than window length, so parts of the time series will not be covered.</p>
      ) : null}
      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}

function formatCalculation(value: number | null) {
  return value === null ? 'n.a.' : value;
}

function formatWindowRelationship(overlapPercent: number | null) {
  if (overlapPercent === null) return 'n.a.';
  if (Math.abs(overlapPercent) < 0.0001) return 'No overlap or gap';
  if (overlapPercent > 0) return `${formatPercent(overlapPercent)} overlap`;
  return `${formatPercent(Math.abs(overlapPercent))} gap`;
}

function formatPercent(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded}%`;
}
