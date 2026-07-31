import { createHashRouter } from 'react-router-dom';
import { PartitionPage } from '../pages/partition/PartitionPage';
import { SampleFieldPage } from '../pages/samplefield/SampleFieldPage';
import { SearchPage } from '../pages/search/SearchPage';
import { SelectPage } from '../pages/select/SelectPage';
import { SimulatePDEPage } from '../pages/simulatepde/SimulatePDEPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <SearchPage />,
  },
  {
    path: '/transform/partition',
    element: <PartitionPage />,
  },
  {
    path: '/transform/sample-field',
    element: <SampleFieldPage />,
  },
  {
    path: '/transform/select',
    element: <SelectPage />,
  },
  {
    path: '/transform/simulate-pde',
    element: <SimulatePDEPage />,
  },
]);
