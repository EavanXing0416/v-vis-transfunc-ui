import type { SimulatePDEFormState } from './simulatePDE.types';

export const defaultSimulatePDEForm: SimulatePDEFormState = {
  solverMethod: 'fdm',
  equationType: 'second_order_hyperbolic',
  spatialDimension: '2d',
  hasTemporalDimension: true,
  boundaryCondition: 'dirichlet',
  xMin: 0,
  xMax: 1,
  xStep: 0.01,
  yMin: 0,
  yMax: 1,
  yStep: 0.01,
  tMin: 0,
  tMax: 100,
  tStep: 1,
  comments: '',
};
