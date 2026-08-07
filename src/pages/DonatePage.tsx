import { Helmet } from 'react-helmet-async';
import Container from '@/shared/components/ui/Container';
import DonationSection from '@/shared/components/donation/DonationSection';

export default function DonatePage() {
  return (
    <>
      <Helmet>
        <title>Support ImageCraft – Donate</title>
        <meta name="description" content="Help keep ImageCraft free and ad‑free by making a donation." />
      </Helmet>
      <Container className="py-16">
        <DonationSection />
      </Container>
    </>
  );
}