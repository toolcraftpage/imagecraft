import { Helmet } from 'react-helmet-async';
import Container from '@/shared/components/ui/Container';
import ImageDropZone from '@/shared/components/ui/ImageDropZone';
import BackgroundRemoverControls from './components/BackgroundRemoverControls';
import { useImageUpload } from '@/shared/hooks/useImageUpload';

export default function BackgroundRemoverPage() {
  const { images, fileInputRef, handleDrop, handleFileInput, clearImages } = useImageUpload({ maxFiles: 1 });

  return (
    <>
      <Helmet>
        <title>Background Remover – ImageCraft</title>
        <meta
          name="description"
          content="Remove image backgrounds with a professional transparent PNG workflow inside your browser."
        />
      </Helmet>

      <Container className="py-12">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
            Professional tool
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Background Remover
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 md:text-lg">
            Clean up product, portrait, and marketing photos into transparent PNG assets with a polished export workflow.
          </p>
        </div>

        <ImageDropZone
          images={images}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
          fileInputRef={fileInputRef}
          onClear={clearImages}
        />

        {images.length > 0 && !images[0].error && (
          <BackgroundRemoverControls image={images[0]} />
        )}
      </Container>
    </>
  );
}
