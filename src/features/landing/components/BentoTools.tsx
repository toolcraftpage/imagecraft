import { ArrowRight, FolderOpen, Image, Scissors, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/ui/Container';
import { TOOL_PATH } from '@/shared/constants/routes';

const bentoItems = [
  {
    title: 'Image Editor',
    description: 'Tune lighting, crop, and refine image details in one flow.',
    href: '/editor',
    size: 'lg',
    accent: 'bg-[linear-gradient(135deg,#e0e7ff,#f5f3ff,#ddd6fe)]',
    icon: Image,
  },
  {
    title: 'Image Compressor',
    description: 'Reduce file size while keeping visuals clean.',
    href: TOOL_PATH('image-compressor'),
    size: 'md',
    accent: 'bg-[linear-gradient(135deg,#dcfce7,#ecfeff,#cffafe)]',
    icon: FolderOpen,
  },
  {
    title: 'Background Remover',
    description: 'Isolate subjects for product, portrait, and social assets.',
    href: TOOL_PATH('background-remover'),
    size: 'md',
    accent: 'bg-[linear-gradient(135deg,#fff7ed,#fef3c7,#ffedd5)]',
    icon: Sparkles,
  },
  {
    title: 'Resize',
    description: 'Create size-safe visuals for every screen.',
    href: TOOL_PATH('image-resizer'),
    size: 'sm',
    accent: 'bg-[linear-gradient(135deg,#f5f3ff,#dbeafe,#e0f2fe)]',
    icon: Scissors,
  },
  {
    title: 'Convert',
    description: 'Swap formats for faster sharing and publishing.',
    href: TOOL_PATH('converter'),
    size: 'sm',
    accent: 'bg-[linear-gradient(135deg,#ecfeff,#f5f3ff,#fce7f3)]',
    icon: Sparkles,
  },
  {
    title: 'PDF tools',
    description: 'Move PDFs into images or images into PDFs, without friction.',
    href: '/pdf-tools',
    size: 'lg',
    accent: 'bg-[linear-gradient(135deg,#e0f2fe,#eff6ff,#dbeafe)]',
    icon: FolderOpen,
  },
];

export default function BentoTools() {
  return (
    <section className="py-18">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Workflow</p>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">A smoother creative flow</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-3">
          {bentoItems.map(({ title, description, href, size, accent, icon: Icon }) => (
            <Link key={title} to={href} className={`group ${size === 'lg' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'}`}>
              <div className={`flex h-full min-h-[170px] flex-col justify-between rounded-[28px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:border-accent/40 sm:min-h-[200px] ${accent} dark:bg-[linear-gradient(135deg,#171d2a,#1b2434,#121827)]`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/75 text-accent shadow-[0_12px_28px_rgba(15,23,42,0.08)] ring-1 ring-white/60 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/35 dark:text-indigo-200 dark:ring-white/5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-[-0.05em] text-foreground">{title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-foreground-secondary">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
