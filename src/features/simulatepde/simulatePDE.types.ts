export interface SimulatePDEFormState {
  solverMethod: 'fdm' | 'fem' | 'spectral';
  equationType: 'second_order_hyperbolic' | 'elliptic' | 'parabolic';
  spatialDimension: '1d' | '2d';
  hasTemporalDimension: boolean;
  boundaryCondition: 'dirichlet' | 'neumann' | 'robin' | 'periodic';
  xMin: number;
  xMax: number;
  xStep: number;
  yMin: number;
  yMax: number;
  yStep: number;
  tMin: number;
  tMax: number;
  tStep: number;
  comments: string;
}
