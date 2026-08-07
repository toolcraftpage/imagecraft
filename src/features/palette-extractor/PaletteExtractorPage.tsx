import { Helmet } from 'react-helmet-async';
import Container from '@/shared/components/ui/Container';
import ImageDropZone from '@/shared/components/ui/ImageDropZone';
import PaletteControls from './components/PaletteControls';
import { useImageUpload } from '@/shared/hooks/useImageUpload';

export default function PaletteExtractorPage() {
  const { images, fileInputRef, handleDrop, handleFileInput, clearImages } = useImageUpload({ maxFiles: 1 });

  return (
    <>
      <Helmet><title>Color Palette Extractor – ImageCraft</title></Helmet>
      <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Color Palette Extractor
        </h1>
        <ImageDropZone
          images={images}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
          fileInputRef={fileInputRef}
          onClear={clearImages}
          maxFiles={1}
        />
        {images.length > 0 && !images[0].error && (
          <PaletteControls image={images[0]} />
        )}
      </Container>
    </>
  );
}