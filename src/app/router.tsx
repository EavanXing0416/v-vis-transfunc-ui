import { createHashRouter } from 'react-router-dom';
import { AlignLabelPage } from '../pages/alignlabel/AlignLabelPage';
import { AlignTSPage } from '../pages/alignts/AlignTSPage';
import { BlendPage } from '../pages/blend/BlendPage';
import { CropTSPage } from '../pages/cropts/CropTSPage';
import { FeaExSpectrogramPage } from '../pages/feaexspectrogram/FeaExSpectrogramPage';
import { GenImagePage } from '../pages/genimage/GenImagePage';
import { ImputeTSPage } from '../pages/imputets/ImputeTSPage';
import { MergePage } from '../pages/merge/MergePage';
import { NormTSPage } from '../pages/normts/NormTSPage';
import { PartitionPage } from '../pages/partition/PartitionPage';
import { SampleFieldPage } from '../pages/samplefield/SampleFieldPage';
import { SegmentTSPage } from '../pages/segmentts/SegmentTSPage';
import { SearchPage } from '../pages/search/SearchPage';
import { SelectPage } from '../pages/select/SelectPage';
import { SigExMASTPage } from '../pages/sigexmast/SigExMASTPage';
import { SimulatePDEPage } from '../pages/simulatepde/SimulatePDEPage';
import { STFTPage } from '../pages/stft/STFTPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <SearchPage />,
  },
  {
    path: '/transform/align-label',
    element: <AlignLabelPage />,
  },
  {
    path: '/transform/align-ts',
    element: <AlignTSPage />,
  },
  {
    path: '/transform/blend',
    element: <BlendPage />,
  },
  {
    path: '/transform/crop-ts',
    element: <CropTSPage />,
  },
  {
    path: '/transform/fea-ex-spectrogram',
    element: <FeaExSpectrogramPage />,
  },
  {
    path: '/transform/gen-image',
    element: <GenImagePage />,
  },
  {
    path: '/transform/impute-ts',
    element: <ImputeTSPage />,
  },
  {
    path: '/transform/norm-ts',
    element: <NormTSPage />,
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
    path: '/transform/segment-ts',
    element: <SegmentTSPage />,
  },
  {
    path: '/transform/select',
    element: <SelectPage />,
  },
  {
    path: '/transform/sigex-mast',
    element: <SigExMASTPage />,
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
