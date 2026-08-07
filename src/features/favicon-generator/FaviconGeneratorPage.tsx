import { Helmet } from 'react-helmet-async';
import Container from '@/shared/components/ui/Container';
import ImageDropZone from '@/shared/components/ui/ImageDropZone';
import FaviconControls from './components/FaviconControls';
import { useImageUpload } from '@/shared/hooks/useImageUpload';

export default function FaviconGeneratorPage() {
  const { images, fileInputRef, handleDrop, handleFileInput, clearImages } = useImageUpload({ maxFiles: 1 });
  return (
    <>
      <Helmet><title>Favicon Generator – ImageCraft</title></Helmet>
      <Container className="py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Favicon Generator</h1>
        <ImageDropZone images={images} onDrop={handleDrop} onFileInput={handleFileInput} fileInputRef={fileInputRef} onClear={clearImages} />
        {images.length > 0 && !images[0].error && <FaviconControls image={images[0]} />}
      </Container>
    </>
  );
}