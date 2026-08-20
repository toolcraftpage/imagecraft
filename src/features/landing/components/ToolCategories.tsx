import { ArrowRight, BrushCleaning, Camera, CircleDashed, FileText, ImageIcon, Scissors, Sparkles, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/ui/Container';

const categories = [
  { title: 'Image Editing', description: 'Adjust color and composition', icon: BrushCleaning, count: '8 tools', href: '/tools' },
  { title: 'Image Conversion', description: 'Switch formats fast', icon: Camera, count: '7 tools', href: '/tools' },
  { title: 'Compression', description: 'Reduce size without bloat', icon: CircleDashed, count: '1 tool', href: '/tools/image-compressor' },
  { title: 'Resize', description: 'Set exact output dimensions', icon: ImageIcon, count: '1 tool', href: '/tools/image-resizer' },
  { title: 'Crop', description: 'Refine framing and layout', icon: Scissors, count: '1 tool', href: '/tools/crop' },
  { title: 'PDF', description: 'Convert documents to visuals', icon: FileText, count: '2 tools', href: '/pdf-tools' },
  { title: 'Color', description: 'Fine tune hue and tone', icon: Sparkles, count: '3 tools', href: '/tools' },
  { title: 'AI', description: 'Advanced cleanup workflows', icon: Wand2, count: '1 tool', href: '/tools/background-remover' },
];

export default function ToolCategories() {
  return (
    <section className="py-18">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Categories</p>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">A complete image toolkit</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map(({ title, description, icon: Icon, count, href }) => (
            <Link key={title} to={href} className="group block h-full">
              <div className="flex h-full flex-col rounded-[24px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-md)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-muted">{count}</span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground-secondary">{description}</p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Open category <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
