import { createHashRouter } from 'react-router-dom';
import { SearchPage } from '../pages/search/SearchPage';
import { PartitionPage } from '../pages/partition/PartitionPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <SearchPage />,
  },
  {
    path: '/transform/partition',
    element: <PartitionPage />,
  },
]);
