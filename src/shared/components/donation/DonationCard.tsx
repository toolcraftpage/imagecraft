import { useState } from 'react';
import { Heart, Copy, Check } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

interface DonationCardProps {
  platform: 'paypal' | 'kofi' | 'buymeacoffee' | 'github' | 'crypto';
  link: string;
  description: string;
  cryptoAddress?: string;   // only used when platform === 'crypto'
  cryptoNetwork?: string;   // e.g., 'Ethereum (ETH)'
}

const platformDetails = {
  paypal: { name: 'PayPal', color: '#003087' },
  kofi: { name: 'Ko-fi', color: '#FF5E5B' },
  buymeacoffee: { name: 'Buy Me a Coffee', color: '#FFDD00' },
  github: { name: 'GitHub Sponsors', color: '#333' },
  crypto: { name: 'Crypto Wallet', color: '#f7931a' },
};

export default function DonationCard({
  platform,
  link,
  description,
  cryptoAddress,
  cryptoNetwork,
}: DonationCardProps) {
  const { name, color } = platformDetails[platform];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (cryptoAddress) {
      try {
        await navigator.clipboard.writeText(cryptoAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = cryptoAddress;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <Card className="flex flex-col items-center text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        <Heart size={24} style={{ color }} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{description}</p>

      {platform === 'crypto' && cryptoAddress ? (
        <div className="mt-auto w-full space-y-2">
          {cryptoNetwork && (
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {cryptoNetwork}
            </p>
          )}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-800">
            <code className="flex-1 truncate text-xs text-gray-700 dark:text-gray-300 select-all">
              {cryptoAddress}
            </code>
          </div>
          <Button
            variant={copied ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleCopy}
            className="w-full gap-1"
          >
            {copied ? (
              <>
                <Check size={14} /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Address
              </>
            )}
          </Button>
        </div>
      ) : (
        <a href={link} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <Button variant="secondary" size="sm">
            Donate via {name}
          </Button>
        </a>
      )}
    </Card>
  );
}