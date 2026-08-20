import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';
import Container from '@/shared/components/ui/Container';

const content = {
  privacy: {
    title: 'Privacy Policy',
    description: 'ImageCraft processes supported images in your browser whenever possible. Files are not uploaded to our servers for standard image tools.',
    sections: ['Browser processing', 'Information we collect', 'Advertising and analytics', 'Your choices'],
  },
  terms: {
    title: 'Terms of Service',
    description: 'Use ImageCraft responsibly and only with files you have permission to process. Tools are provided for personal and professional workflows as-is.',
    sections: ['Using the service', 'Your content', 'Availability', 'Contact'],
  },
  cookies: {
    title: 'Cookie Policy',
    description: 'ImageCraft may use essential storage for preferences such as theme settings. Advertising providers may use cookies only when advertising is configured and enabled.',
    sections: ['Essential storage', 'Advertising cookies', 'Managing preferences', 'Updates'],
  },
} as const;

type LegalKind = keyof typeof content;

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const page = content[kind];
  return (
    <>
      <Helmet><title>{page.title} – ImageCraft</title><meta name="description" content={page.description} /></Helmet>
      <div className="min-h-[70vh] bg-[radial-gradient(circle_at_12%_0%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(236,72,153,0.14),transparent_26%)] py-12">
        <Container>
          <div className="mx-auto max-w-3xl rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[var(--shadow-lg)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 md:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-pink-500 text-white"><ShieldCheck className="h-6 w-6" /></div>
              <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">ImageCraft policy</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-foreground">{page.title}</h1></div>
            </div>
            <p className="mt-8 text-base leading-8 text-foreground-secondary">{page.description}</p>
            <div className="mt-8 space-y-6">
              {page.sections.map((section) => <section key={section} className="border-t border-border pt-5"><h2 className="text-lg font-bold text-foreground">{section}</h2><p className="mt-2 text-sm leading-7 text-foreground-secondary">This section describes how ImageCraft handles this part of the service. We keep the experience clear, minimize data collection, and update this page when the product changes.</p></section>)}
            </div>
            <p className="mt-10 border-t border-border pt-5 text-xs text-foreground-muted">Last updated: August 19, 2026</p>
          </div>
        </Container>
      </div>
    </>
  );
}
