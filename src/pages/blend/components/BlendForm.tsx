import type { DatasetRecord } from '../../../features/datasets/dataset.types';
import { getSelectedAuxiliaryObjectCount } from '../../../features/blend/blendMetadata';
import type { BlendFormState } from '../../../features/blend/blend.types';

interface BlendFormProps {
  datasets: DatasetRecord[];
  form: BlendFormState;
  onChange: (nextForm: BlendFormState) => void;
  validationMessage: string | null;
}

export function BlendForm({ datasets, form, onChange, validationMessage }: BlendFormProps) {
  function update<K extends keyof BlendFormState>(key: K, value: BlendFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function handlePrimaryDatasetChange(primaryDatasetId: string) {
    onChange({
      ...form,
      primaryDatasetId,
      auxiliaryDatasetIds: form.auxiliaryDatasetIds.filter((datasetId) => datasetId !== primaryDatasetId),
    });
  }

  function handleAuxiliaryToggle(datasetId: string) {
    const auxiliaryDatasetIds = form.auxiliaryDatasetIds.includes(datasetId)
      ? form.auxiliaryDatasetIds.filter((item) => item !== datasetId)
      : [...form.auxiliaryDatasetIds, datasetId];

    onChange({
      ...form,
      auxiliaryDatasetIds,
    });
  }

  const auxiliaryCandidates = datasets.filter((dataset) => dataset.id !== form.primaryDatasetId);

  return (
    <div className="partition-split-layout">
      <div className="merge-complex-grid">
        <div className="field field--inline">
          <label htmlFor="blend-primary">Primary dataset</label>
          <select id="blend-primary" onChange={(event) => handlePrimaryDatasetChange(event.target.value)} value={form.primaryDatasetId}>
            {datasets.map((dataset) => (
              <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
            ))}
          </select>
        </div>

        <div className="field field--inline">
          <label htmlFor="blend-fraction">Auxiliary fraction</label>
          <input id="blend-fraction" max="1" min="0.01" onChange={(event) => update('auxiliaryFraction', Number(event.target.value))} step="0.01" type="number" value={form.auxiliaryFraction} />
        </div>

        <div className="field field--inline">
          <label htmlFor="blend-selection-rule">Selection rule</label>
          <select id="blend-selection-rule" onChange={(event) => update('selectionRule', event.target.value as BlendFormState['selectionRule'])} value={form.selectionRule}>
            <option value="random_without_replacement">Random without replacement</option>
            <option value="all_objects">All objects</option>
          </select>
        </div>

        <div className="field field--inline">
          <label htmlFor="blend-subset-seed">Subset seed</label>
          <input id="blend-subset-seed" onChange={(event) => update('subsetSelectionSeed', Number(event.target.value))} step="1" type="number" value={form.subsetSelectionSeed} />
        </div>

        <div className="field field--inline">
          <label htmlFor="blend-assignment-rule">Assignment rule</label>
          <select id="blend-assignment-rule" onChange={(event) => update('assignmentRule', event.target.value as BlendFormState['assignmentRule'])} value={form.assignmentRule}>
            <option value="random_with_reuse">Random with reuse</option>
            <option value="cyclic_reuse">Cyclic reuse</option>
          </select>
        </div>

        <div className="field field--inline">
          <label htmlFor="blend-assignment-seed">Assignment seed</label>
          <input id="blend-assignment-seed" onChange={(event) => update('assignmentSeed', Number(event.target.value))} step="1" type="number" value={form.assignmentSeed} />
        </div>

        <div className="field field--inline">
          <label htmlFor="blend-scaling-rule">Scaling rule</label>
          <select id="blend-scaling-rule" onChange={(event) => update('signalScalingRule', event.target.value as BlendFormState['signalScalingRule'])} value={form.signalScalingRule}>
            <option value="target_snr">Target SNR</option>
          </select>
        </div>

        <div className="field field--inline">
          <label htmlFor="blend-target-snr">Target SNR</label>
          <input id="blend-target-snr" onChange={(event) => update('targetSnr', Number(event.target.value))} step="1" type="number" value={form.targetSnr} />
        </div>

        <div className="field field--inline">
          <label htmlFor="blend-merge-rule">Merge rule</label>
          <select id="blend-merge-rule" onChange={(event) => update('mergeRule', event.target.value as BlendFormState['mergeRule'])} value={form.mergeRule}>
            <option value="add_signals">Add signals</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Auxiliary datasets</label>
        <div className="blend-auxiliary-grid">
          {auxiliaryCandidates.map((dataset) => {
            const checked = form.auxiliaryDatasetIds.includes(dataset.id);
            const selectedCount = getSelectedAuxiliaryObjectCount(dataset, form.auxiliaryFraction);
            return (
              <div className="blend-auxiliary-row" key={dataset.id}>
                <label className="checkbox-card blend-auxiliary-card">
                  <input checked={checked} onChange={() => handleAuxiliaryToggle(dataset.id)} type="checkbox" />
                  <span>{dataset.name}</span>
                </label>
                <span className="blend-auxiliary-count">{checked ? `${selectedCount} selected` : ''}</span>
              </div>
            );
          })}
        </div>
      </div>

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
