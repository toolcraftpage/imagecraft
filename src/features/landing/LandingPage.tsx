import { Helmet } from 'react-helmet-async';
import HeroSection from './components/HeroSection';
import QuickActions from './components/QuickActions';
import ToolSearch from './components/ToolSearch';
import PopularTools from './components/PopularTools';
import BentoTools from './components/BentoTools';
import ToolCategories from './components/ToolCategories';
import WhyImageCraft from './components/WhyImageCraft';
import ContactSection from './components/ContactSection';
import FinalCTA from './components/FinalCTA';

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>ImageCraft – Professional Browser Image Tools</title>
        <meta
          name="description"
          content="Edit, resize, compress, convert, and optimize images with simple browser-based tools built for creators and teams."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'ImageCraft',
            url: 'https://imagecrafttool.vercel.app/',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Web Browser',
            description: 'Free browser-based image editing, conversion, compression, PDF, and background removal tools.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            featureList: ['Image compressor', 'Image resizer', 'Image converter', 'Photo editor', 'Background remover', 'PDF tools'],
          })}
        </script>
      </Helmet>

      <HeroSection />
      <QuickActions />
      <ToolSearch />
      <PopularTools />
      <BentoTools />
      <ToolCategories />
      <WhyImageCraft />
      <ContactSection />
      <FinalCTA />
    </>
  );
}