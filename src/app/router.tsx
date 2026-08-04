import { createHashRouter } from 'react-router-dom';
import { BlendPage } from '../pages/blend/BlendPage';
import { GenImagePage } from '../pages/genimage/GenImagePage';
import { MergePage } from '../pages/merge/MergePage';
import { PartitionPage } from '../pages/partition/PartitionPage';
import { SampleFieldPage } from '../pages/samplefield/SampleFieldPage';
import { SearchPage } from '../pages/search/SearchPage';
import { SelectPage } from '../pages/select/SelectPage';
import { SimulatePDEPage } from '../pages/simulatepde/SimulatePDEPage';
import { STFTPage } from '../pages/stft/STFTPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <SearchPage />,
  },
  {
    path: '/transform/blend',
    element: <BlendPage />,
  },
  {
    path: '/transform/gen-image',
    element: <GenImagePage />,
  },
  {
    path: '/transform/merge',
    element: <MergePage />,
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
  {
    path: '/transform/stft',
    element: <STFTPage />,
  },
]);
