import { Helmet } from 'react-helmet-async';
import Container from '@/shared/components/ui/Container';
import ImageDropZone from '@/shared/components/ui/ImageDropZone';
import PdfControls from './components/PdfControls';
import { useImageUpload } from '@/shared/hooks/useImageUpload';

export default function ImageToPdfPage() {
  const { images, fileInputRef, handleDrop, handleFileInput, clearImages } = useImageUpload({ maxFiles: 50 });

  return (
    <>
      <Helmet><title>Image to PDF – ImageCraft</title></Helmet>
      <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Image to PDF</h1>
        <ImageDropZone
          images={images}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
          fileInputRef={fileInputRef}
          onClear={clearImages}
          maxFiles={50}
          multiple={true}
        />
        {images.length > 0 && <PdfControls images={images} onClear={clearImages} />}
      </Container>
    </>
  );
}