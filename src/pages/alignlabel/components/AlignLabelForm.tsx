import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import type { AlignLabelFormState } from '../../../features/alignlabel/alignLabel.types';

interface AlignLabelFormProps {
  form: AlignLabelFormState;
  onChange: (nextForm: AlignLabelFormState) => void;
  timeSeriesDatasets: DatasetRecord[];
  annotationDatasets: DatasetRecord[];
  selectedDatasetCount: number;
  validationMessage: string | null;
}

export function AlignLabelForm({ form, onChange, timeSeriesDatasets, annotationDatasets, selectedDatasetCount, validationMessage }: AlignLabelFormProps) {
  const requiresRoleConfirmation = selectedDatasetCount > 1;

  function update<K extends keyof AlignLabelFormState>(key: K, value: AlignLabelFormState[K]) {
    onChange({ ...form, [key]: value });
  }

  function handleAnnotationSourceChange(source: AlignLabelFormState['annotationSource']) {
    const annotationDataset = annotationDatasets.find((dataset) => dataset.id === form.annotationDatasetId) ?? annotationDatasets[0];
    onChange({
      ...form,
      annotationSource: source,
      annotationDatasetId: source === 'input_dataset' ? annotationDataset?.id ?? '' : '',
      labelFilePath: source === 'input_dataset' ? annotationDataset?.filePath ?? '' : '',
    });
  }

  function handleAnnotationDatasetChange(datasetId: string) {
    const dataset = annotationDatasets.find((item) => item.id === datasetId);
    onChange({
      ...form,
      annotationDatasetId: datasetId,
      labelFilePath: dataset?.filePath ?? '',
    });
  }

  return (
    <div className="partition-split-layout">
      {requiresRoleConfirmation ? (
      <div className="stft-row stft-row--double">
        <div className="field field--inline field--inline-long">
          <label htmlFor="alignlabel-time-series">Time-series dataset</label>
          <div className="field-control-stack">
            <select id="alignlabel-time-series" onChange={(event) => update('timeSeriesDatasetId', event.target.value)} value={form.timeSeriesDatasetId}>
              {timeSeriesDatasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name}</option>)}
            </select>
            <span className="field-hint">Confirms which selected TimeSeries dataset receives the annotations.</span>
          </div>
        </div>
        <div className="field field--inline field--inline-long">
          <label htmlFor="alignlabel-source">Annotation source</label>
          <div className="field-control-stack">
            <select id="alignlabel-source" onChange={(event) => handleAnnotationSourceChange(event.target.value as AlignLabelFormState['annotationSource'])} value={form.annotationSource}>
              {annotationDatasets.length > 0 ? <option value="input_dataset">Annotation from input datasets</option> : null}
              <option value="input_path">Input annotation JSON path</option>
            </select>
            <span className="field-hint">Use a selected annotation dataset or provide an external JSON file.</span>
          </div>
        </div>
      </div>
      ) : null}

      {requiresRoleConfirmation && form.annotationSource === 'input_dataset' ? (
        <div className="stft-row stft-row--double">
          <div className="field field--inline field--inline-long">
            <label htmlFor="alignlabel-annotation-dataset">Annotation dataset</label>
            <div className="field-control-stack">
              <select id="alignlabel-annotation-dataset" onChange={(event) => handleAnnotationDatasetChange(event.target.value)} value={form.annotationDatasetId}>
                {annotationDatasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name}</option>)}
              </select>
              <span className="field-hint">Confirms which selected EventAnnotation dataset supplies labels.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="field">
          <label htmlFor="alignlabel-file-path">Label file path</label>
          <input id="alignlabel-file-path" onChange={(event) => update('labelFilePath', event.target.value)} placeholder="e.g. data/annotations/elms.json" type="text" value={form.labelFilePath} />
          <span className="field-hint">Path to an annotation JSON file outside the currently selected datasets.</span>
        </div>
      )}

      <div className="stft-row stft-row--double">
        <div className="field field--inline field--inline-long">
          <label htmlFor="alignlabel-event-type">Event type</label>
          <div className="field-control-stack">
            <select id="alignlabel-event-type" onChange={(event) => update('eventType', event.target.value as AlignLabelFormState['eventType'])} value={form.eventType}>
              <option value="elms">ELMs</option>
              <option value="ires">IREs</option>
              <option value="sawteeth">Sawteeth</option>
              <option value="confinement">Confinement</option>
            </select>
            <span className="field-hint">Selects the task-specific annotation set.</span>
          </div>
        </div>
        <div className="field field--inline field--inline-long">
          <label htmlFor="alignlabel-rule">Labelling rule</label>
          <div className="field-control-stack">
            <select id="alignlabel-rule" onChange={(event) => update('labellingRule', event.target.value as AlignLabelFormState['labellingRule'])} value={form.labellingRule}>
              <option value="overlap">Overlap</option>
              <option value="centre_in_event">Centre in event</option>
            </select>
            <span className="field-hint">Defines when a later window is considered positive.</span>
          </div>
        </div>
      </div>

      <div className="stft-row stft-row--double">
        <div className="field field--inline field--inline-long">
          <label htmlFor="alignlabel-disruption-clip">Disruption clip (s)</label>
          <div className="field-control-stack">
            <input id="alignlabel-disruption-clip" min="0" onChange={(event) => update('disruptionClipS', event.target.value)} placeholder="optional" step="0.001" type="number" value={form.disruptionClipS} />
            <span className="field-hint">Optional exclusion margin before a disruption, in seconds.</span>
          </div>
        </div>
        <div className="field field--inline field--inline-long">
          <label htmlFor="alignlabel-span-margin">Annotation span margin (ms)</label>
          <div className="field-control-stack">
            <input id="alignlabel-span-margin" min="0" onChange={(event) => update('annotationSpanMarginMs', event.target.value)} placeholder="optional" step="0.1" type="number" value={form.annotationSpanMarginMs} />
            <span className="field-hint">Optional background-sampling margin around annotation spans.</span>
          </div>
        </div>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
