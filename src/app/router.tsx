import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '@/shared/components/layout/MainLayout';

// ---- Page imports (lazy) ----
const LandingPage = lazy(() => import('@/features/landing'));
const ToolsPage = lazy(() => import('@/pages/ToolsPage'));
const DonatePage = lazy(() => import('@/pages/DonatePage'));
const PdfToolsPage = lazy(() => import('@/pages/PdfToolsPage'));
const EditorPage = lazy(() => import('@/features/editor'));

// Original live tools
const CompressorPage = lazy(() => import('@/features/image-compressor'));
const CropPage = lazy(() => import('@/features/crop'));
const ResizerPage = lazy(() => import('@/features/image-resizer'));

// New tools – each in its own feature folder
const ConverterPage = lazy(() => import('@/features/converter'));
const FlipPage = lazy(() => import('@/features/flip'));
const RotatePage = lazy(() => import('@/features/rotate'));
const BrightnessPage = lazy(() => import('@/features/brightness'));
const ContrastPage = lazy(() => import('@/features/contrast'));
const SaturationPage = lazy(() => import('@/features/saturation'));
const HuePage = lazy(() => import('@/features/hue'));
const TextOverlayPage = lazy(() => import('@/features/text-overlay'));
const CollageMakerPage = lazy(() => import('@/features/collage-maker'));
const PaletteExtractorPage = lazy(() => import('@/features/palette-extractor'));
const FaviconGeneratorPage = lazy(() => import('@/features/favicon-generator'));
const BackgroundRemoverPage = lazy(() => import('@/features/background-remover'));
const PdfToImagePage = lazy(() => import('@/features/pdf-to-image'));
const ImageToPdfPage = lazy(() => import('@/features/image-to-pdf'));
const PdfMergePage = lazy(() => import('@/features/pdf-merge'));
const WatermarkPage = lazy(() => import('@/features/watermark'));
const MetadataViewerPage = lazy(() => import('@/features/metadata-viewer'));

// Non‑live tools still use ComingSoonPage
import ComingSoonPage from '@/pages/ComingSoonPage';
import LegalPage from '@/pages/LegalPage';
import { TOOLS, TOOL_PATH } from '@/shared/constants/routes';

// ---- Loading fallback ----
const LoadingFallback = () => (
  <div className="flex h-96 items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// ---- Build routes for non‑live tools (only background‑remover) ----
const comingSoonRoutes = TOOLS.filter((t) => !t.live).map((t) => ({
  path: TOOL_PATH(t.id).slice(1),
  element: (
    <Suspense fallback={<LoadingFallback />}>
      <ComingSoonPage />
    </Suspense>
  ),
}));

// ---- Router ----
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      // Home
      { index: true, element: <Suspense fallback={<LoadingFallback />}><LandingPage /></Suspense> },

      // Editor
      { path: 'editor', element: <Suspense fallback={<LoadingFallback />}><EditorPage /></Suspense> },

      // Donate page
      { path: 'donate', element: <Suspense fallback={<LoadingFallback />}><DonatePage /></Suspense> },
      { path: 'privacy', element: <LegalPage kind="privacy" /> },
      { path: 'terms', element: <LegalPage kind="terms" /> },
      { path: 'cookies', element: <LegalPage kind="cookies" /> },

      // PDF Tools page
      { path: 'pdf-tools', element: <Suspense fallback={<LoadingFallback />}><PdfToolsPage /></Suspense> },

      // Tools directory
      { path: 'tools', element: <Suspense fallback={<LoadingFallback />}><ToolsPage /></Suspense> },

      // ---- Original tools ----
      { path: 'tools/image-compressor', element: <Suspense fallback={<LoadingFallback />}><CompressorPage /></Suspense> },
      { path: 'tools/crop', element: <Suspense fallback={<LoadingFallback />}><CropPage /></Suspense> },
      { path: 'tools/image-resizer', element: <Suspense fallback={<LoadingFallback />}><ResizerPage /></Suspense> },
      { path: 'tools/converter', element: <Suspense fallback={<LoadingFallback />}><ConverterPage /></Suspense> },

      // ---- New tools ----
      { path: 'tools/flip', element: <Suspense fallback={<LoadingFallback />}><FlipPage /></Suspense> },
      { path: 'tools/rotate', element: <Suspense fallback={<LoadingFallback />}><RotatePage /></Suspense> },
      { path: 'tools/brightness', element: <Suspense fallback={<LoadingFallback />}><BrightnessPage /></Suspense> },
      { path: 'tools/contrast', element: <Suspense fallback={<LoadingFallback />}><ContrastPage /></Suspense> },
      { path: 'tools/saturation', element: <Suspense fallback={<LoadingFallback />}><SaturationPage /></Suspense> },
      { path: 'tools/hue', element: <Suspense fallback={<LoadingFallback />}><HuePage /></Suspense> },
      { path: 'tools/text-overlay', element: <Suspense fallback={<LoadingFallback />}><TextOverlayPage /></Suspense> },
      { path: 'tools/collage-maker', element: <Suspense fallback={<LoadingFallback />}><CollageMakerPage /></Suspense> },
      { path: 'tools/palette-extractor', element: <Suspense fallback={<LoadingFallback />}><PaletteExtractorPage /></Suspense> },
      { path: 'tools/favicon-generator', element: <Suspense fallback={<LoadingFallback />}><FaviconGeneratorPage /></Suspense> },
      { path: 'tools/pdf-to-image', element: <Suspense fallback={<LoadingFallback />}><PdfToImagePage /></Suspense> },
      { path: 'tools/image-to-pdf', element: <Suspense fallback={<LoadingFallback />}><ImageToPdfPage /></Suspense> },
      { path: 'tools/pdf-merge', element: <Suspense fallback={<LoadingFallback />}><PdfMergePage /></Suspense> },
      { path: 'tools/watermark', element: <Suspense fallback={<LoadingFallback />}><WatermarkPage /></Suspense> },
      { path: 'tools/metadata-viewer', element: <Suspense fallback={<LoadingFallback />}><MetadataViewerPage /></Suspense> },
      { path: 'tools/background-remover', element: <Suspense fallback={<LoadingFallback />}><BackgroundRemoverPage /></Suspense> },

      // ---- Non‑live tools (only background‑remover) ----
      ...comingSoonRoutes,

      // 404
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);