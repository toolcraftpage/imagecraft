import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Container from '@/shared/components/ui/Container';
import { useTheme } from '@/shared/hooks/useTheme';

const toolLinks = [
  { label: 'Image Compressor', to: '/tools/image-compressor' },
  { label: 'Image Resizer', to: '/tools/image-resizer' },
  { label: 'Image Converter', to: '/tools/converter' },
  { label: 'Image Editor', to: '/editor' },
  { label: 'Background Remover', to: '/tools/background-remover' },
  { label: 'Image to PDF', to: '/tools/image-to-pdf' },
];

const categoryLinks = [
  { label: 'Image Editing', to: '/tools' },
  { label: 'Conversion', to: '/tools' },
  { label: 'Compression', to: '/tools/image-compressor' },
  { label: 'PDF Tools', to: '/pdf-tools' },
  { label: 'AI Tools', to: '/tools/background-remover' },
  { label: 'Utilities', to: '/tools' },
];

const resourceLinks = [
  { label: 'Blog', to: '/' },
  { label: 'Guides', to: '/tools' },
  { label: 'FAQ', to: '/tools#resources' },
  { label: 'Help', to: '/editor' },
];

const companyLinks = [
  { label: 'About', to: '/' },
  { label: 'Contact', to: '/donate' },
  { label: 'Support', to: '/donate' },
  { label: 'Resources', to: '/tools' },
];

const legalLinks = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Cookies', to: '/cookies' },
];

export default function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="relative border-t border-border bg-[linear-gradient(180deg,var(--background-secondary),transparent_32%,var(--surface-muted))] pt-14 pb-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <Container>
        <div className="grid gap-8 border-b border-border pb-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 text-xl font-black tracking-[-0.04em] text-foreground">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5B5FEF,#7C3AED,#22C55E)] text-white shadow-[0_12px_30px_rgba(91,95,239,0.28)]">
                <Sparkles className="h-5 w-5" />
              </span>
              ImageCraft
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-foreground-secondary">
              Simple, powerful image tools for creators, teams, and small businesses.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {['Resize', 'Convert', 'Design', 'Brand'].map((tag) => (
                <span key={tag} className="rounded-full border border-accent/20 bg-[linear-gradient(135deg,rgba(91,95,239,0.12),rgba(124,58,237,0.10))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">Tools</h3>
            <ul className="space-y-3 text-sm text-foreground-secondary">
              {toolLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="inline-flex items-center gap-2 transition hover:text-accent">
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">Categories</h3>
            <ul className="space-y-3 text-sm text-foreground-secondary">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">Resources</h3>
            <ul className="space-y-3 text-sm text-foreground-secondary">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">Company</h3>
            <ul className="space-y-3 text-sm text-foreground-secondary">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition hover:text-accent">{link.label}</Link>
                </li>
              ))}
              <li>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent/40 hover:text-accent"
                  >
                    {theme === 'light' ? 'Dark mode' : 'Light mode'}
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5 text-sm text-foreground-secondary md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-semibold text-foreground">© {new Date().getFullYear()} ImageCraft</span>
            <span className="hidden h-1 w-1 rounded-full bg-border md:inline-block" />
            <span>All rights reserved.</span>
            <span className="hidden h-1 w-1 rounded-full bg-border md:inline-block" />
            <span className="text-xs">Private browser-first image tools</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.label} to={link.to} className="font-medium transition hover:text-accent">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}