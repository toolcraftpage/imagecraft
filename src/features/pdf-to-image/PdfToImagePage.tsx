import { Helmet } from 'react-helmet-async';
import Container from '@/shared/components/ui/Container';
import PdfControls from './components/PdfControls';

export default function PdfToImagePage() {
  return (
    <>
      <Helmet><title>PDF to Image – ImageCraft</title></Helmet>
      <Container className="py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">PDF to Image</h1>
        <PdfControls />
      </Container>
    </>
  );
}