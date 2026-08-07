import DonationCard from './DonationCard';
import Container from '@/shared/components/ui/Container';

export default function DonationSection() {
  const donationOptions = [
    {
      platform: 'paypal' as const,
      link: 'https://paypal.me/Mite2003',
      description: 'Support us with a one-time donation.',
    },
    {
      platform: 'kofi' as const,
      link: 'https://ko-fi.com/toolcraftpage',
      description: 'Buy us a virtual coffee.',
    },
    {
      platform: 'buymeacoffee' as const,
      link: 'https://buymeacoffee.com/toolcraftpage',
      description: 'Another way to fuel development.',
    },
    {
      platform: 'github' as const,
      link: 'https://github.com/sponsors/toolcraftpage',
      description: 'Sponsor on GitHub.',
    },
    {
      platform: 'crypto' as const,
      link: '#',
      description: 'Send ETH or ERC‑20 tokens.',
      cryptoAddress: '0x3569Eb3E3E9d135a9D0F67Ebbe59f00490EA478A',
      cryptoNetwork: 'Ethereum (ETH / ERC‑20)',
    },
  ];

  return (
    <section id="donate" className="py-20 bg-surface-alt dark:bg-surface-alt">
      <Container>
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Support the Project
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            If you find ImageCraft useful, consider supporting us. Every contribution helps keep the
            tools free and ad‑free.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {donationOptions.map((opt) => (
            <DonationCard key={opt.platform} {...opt} />
          ))}
        </div>
      </Container>
    </section>
  );
}