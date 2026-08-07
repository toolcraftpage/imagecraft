import { Helmet } from 'react-helmet-async';
import Container from '@/shared/components/ui/Container';
import ImageDropZone from '@/shared/components/ui/ImageDropZone';
import CollageControls from './components/CollageControls';
import { useImageUpload } from '@/shared/hooks/useImageUpload';

export default function CollageMakerPage() {
  const { images, fileInputRef, handleDrop, handleFileInput, clearImages } = useImageUpload({ maxFiles: 9 });

  return (
    <>
      <Helmet><title>Collage Maker – ImageCraft</title></Helmet>
      <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Collage Maker
        </h1>
        <ImageDropZone
          images={images}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
          fileInputRef={fileInputRef}
          onClear={clearImages}
          maxFiles={9}
          multiple={true}
        />
        {images.length > 0 && <CollageControls images={images} onClear={clearImages} />}
      </Container>
    </>
  );
}