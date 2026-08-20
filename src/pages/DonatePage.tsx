import { Helmet } from 'react-helmet-async';
import Container from '@/shared/components/ui/Container';
import DonationSection from '@/shared/components/donation/DonationSection';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function DonatePage() {
  return (
    <>
      <Helmet>
        <title>Support ImageCraft – Donate</title>
        <meta name="description" content="Help keep ImageCraft free and ad‑free by making a donation." />
      </Helmet>
      <div className="min-h-[70vh] bg-[radial-gradient(circle_at_12%_0%,rgba(251,146,60,0.22),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(236,72,153,0.20),transparent_26%),linear-gradient(180deg,rgba(255,247,237,0.72),transparent)] pb-16 pt-8 dark:bg-[radial-gradient(circle_at_12%_0%,rgba(251,146,60,0.14),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(236,72,153,0.14),transparent_26%)]">
      <Container className="py-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#f97316,#ec4899)] text-white shadow-[0_18px_45px_rgba(236,72,153,0.28)]"><Heart size={30} /></div>
          <h1 className="text-5xl font-black tracking-[-0.06em] text-foreground md:text-6xl">Keep creative work open</h1>
          <p className="mt-4 text-lg leading-8 text-foreground-secondary">Your support helps keep ImageCraft private, accessible, and useful for creators everywhere.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-semibold"><span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-3 py-2 text-orange-700 dark:border-orange-400/20 dark:bg-slate-900/60 dark:text-orange-200"><ShieldCheck className="h-4 w-4" /> Private by default</span><span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-3 py-2 text-pink-700 dark:border-pink-400/20 dark:bg-slate-900/60 dark:text-pink-200"><Sparkles className="h-4 w-4" /> Built for creators</span></div>
        </div>
        <DonationSection />
      </Container>
      </div>
    </>
  );
}