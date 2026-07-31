import type { ChangeEvent } from 'react';
import type { SimulatePDEFormState } from '../../../features/simulatepde/simulatePDE.types';

interface SimulatePDEFormProps {
  form: SimulatePDEFormState;
  onChange: (nextForm: SimulatePDEFormState) => void;
  validationMessage: string | null;
}

export function SimulatePDEForm({ form, onChange, validationMessage }: SimulatePDEFormProps) {
  function update<K extends keyof SimulatePDEFormState>(key: K, value: SimulatePDEFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  function handleNumberChange(
    key: 'xMin' | 'xMax' | 'xStep' | 'yMin' | 'yMax' | 'yStep' | 'tMin' | 'tMax' | 'tStep',
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value));
    };
  }

  return (
    <div className="partition-split-layout">
      <div className="field-row simulatepde-row simulatepde-row--triple">
        <div className="field field--stacked">
          <label htmlFor="simulatepde-solver">Solver method</label>
          <select id="simulatepde-solver" onChange={(event) => update('solverMethod', event.target.value as SimulatePDEFormState['solverMethod'])} value={form.solverMethod}>
            <option value="fdm">Finite Difference Method (FDM)</option>
            <option value="fem">Finite Element Method (FEM)</option>
            <option value="spectral">Spectral Method</option>
          </select>
        </div>
        <div className="field field--stacked">
          <label htmlFor="simulatepde-equation">Equation type</label>
          <select id="simulatepde-equation" onChange={(event) => update('equationType', event.target.value as SimulatePDEFormState['equationType'])} value={form.equationType}>
            <option value="second_order_hyperbolic">2nd-order hyperbolic PDE</option>
            <option value="elliptic">Elliptic PDE</option>
            <option value="parabolic">Parabolic PDE</option>
          </select>
        </div>
        <div className="field field--stacked">
          <label htmlFor="simulatepde-boundary">Boundary condition</label>
          <select id="simulatepde-boundary" onChange={(event) => update('boundaryCondition', event.target.value as SimulatePDEFormState['boundaryCondition'])} value={form.boundaryCondition}>
            <option value="dirichlet">Dirichlet</option>
            <option value="neumann">Neumann</option>
            <option value="robin">Robin</option>
            <option value="periodic">Periodic</option>
          </select>
        </div>
      </div>

      <div className="field-row simulatepde-row simulatepde-row--triple">
        <div className="field field--stacked">
          <label>Spatial dimension</label>
          <div className="radio-row radio-row--compact">
            <label className="radio-inline">
              <input checked={form.spatialDimension === '1d'} onChange={() => update('spatialDimension', '1d')} type="radio" />
              <span>1D</span>
            </label>
            <label className="radio-inline">
              <input checked={form.spatialDimension === '2d'} onChange={() => update('spatialDimension', '2d')} type="radio" />
              <span>2D</span>
            </label>
          </div>
        </div>
        <div className="field field--stacked">
          <label>Temporal dimension</label>
          <label className="checkbox-inline checkbox-inline--compact">
            <input checked={form.hasTemporalDimension} onChange={(event) => update('hasTemporalDimension', event.target.checked)} type="checkbox" />
            <span>Enabled</span>
          </label>
        </div>
        <div className="field field--stacked simulatepde-field-spacer" aria-hidden="true" />
      </div>

      <div className="field-row simulatepde-row simulatepde-row--triple">
        <div className="field field--stacked">
          <label htmlFor="simulatepde-xmin">x-min</label>
          <input id="simulatepde-xmin" onChange={handleNumberChange('xMin')} step="0.01" type="number" value={form.xMin} />
        </div>
        <div className="field field--stacked">
          <label htmlFor="simulatepde-xmax">x-max</label>
          <input id="simulatepde-xmax" onChange={handleNumberChange('xMax')} step="0.01" type="number" value={form.xMax} />
        </div>
        <div className="field field--stacked">
          <label htmlFor="simulatepde-xstep">x step</label>
          <input id="simulatepde-xstep" min="0.0001" onChange={handleNumberChange('xStep')} step="0.001" type="number" value={form.xStep} />
        </div>
      </div>

      {form.spatialDimension === '2d' ? (
        <div className="field-row simulatepde-row simulatepde-row--triple">
          <div className="field field--stacked">
            <label htmlFor="simulatepde-ymin">y-min</label>
            <input id="simulatepde-ymin" onChange={handleNumberChange('yMin')} step="0.01" type="number" value={form.yMin} />
          </div>
          <div className="field field--stacked">
            <label htmlFor="simulatepde-ymax">y-max</label>
            <input id="simulatepde-ymax" onChange={handleNumberChange('yMax')} step="0.01" type="number" value={form.yMax} />
          </div>
          <div className="field field--stacked">
            <label htmlFor="simulatepde-ystep">y step</label>
            <input id="simulatepde-ystep" min="0.0001" onChange={handleNumberChange('yStep')} step="0.001" type="number" value={form.yStep} />
          </div>
        </div>
      ) : null}

      {form.hasTemporalDimension ? (
        <div className="field-row simulatepde-row simulatepde-row--triple">
          <div className="field field--stacked">
            <label htmlFor="simulatepde-tmin">t-min</label>
            <input id="simulatepde-tmin" onChange={handleNumberChange('tMin')} step="0.01" type="number" value={form.tMin} />
          </div>
          <div className="field field--stacked">
            <label htmlFor="simulatepde-tmax">t-max</label>
            <input id="simulatepde-tmax" onChange={handleNumberChange('tMax')} step="0.01" type="number" value={form.tMax} />
          </div>
          <div className="field field--stacked">
            <label htmlFor="simulatepde-tstep">t step</label>
            <input id="simulatepde-tstep" min="0.0001" onChange={handleNumberChange('tStep')} step="0.001" type="number" value={form.tStep} />
          </div>
        </div>
      ) : null}

      {validationMessage ? <p className="field-error">{validationMessage}</p> : null}
    </div>
  );
}
