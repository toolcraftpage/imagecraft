import { ArrowRight, Crop, FileImage, FileText, ScanLine, Sparkles, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/ui/Container';
import { TOOLS, TOOL_PATH } from '@/shared/constants/routes';

const quickTools = [
  {
    id: 'image-compressor',
    title: 'Compress',
    description: 'Cut file size without sacrificing clarity.',
    icon: FileImage,
    tone: 'bg-[linear-gradient(135deg,#dfe8ff,#dff7ff)] dark:bg-[linear-gradient(135deg,#0f172a,#1d3557,#172033)]',
  },
  {
    id: 'image-resizer',
    title: 'Resize',
    description: 'Set exact dimensions for web, print, or social.',
    icon: ScanLine,
    tone: 'bg-[linear-gradient(135deg,#dffdf4,#e0f2fe)] dark:bg-[linear-gradient(135deg,#0f172a,#172e2a,#13263c)]',
  },
  {
    id: 'converter',
    title: 'Convert',
    description: 'Switch formats quickly between common file types.',
    icon: Sparkles,
    tone: 'bg-[linear-gradient(135deg,#fde7f3,#f5f3ff)] dark:bg-[linear-gradient(135deg,#1c1225,#1a1f3a,#121827)]',
  },
  {
    id: 'crop',
    title: 'Crop',
    description: 'Refine composition and remove distractions.',
    icon: Crop,
    tone: 'bg-[linear-gradient(135deg,#fff7ed,#fef3c7)] dark:bg-[linear-gradient(135deg,#20160f,#1f2338,#141827)]',
  },
  {
    id: 'brightness',
    title: 'Edit',
    description: 'Adjust color and appearance for polished output.',
    icon: Wand2,
    tone: 'bg-[linear-gradient(135deg,#dff5ff,#f3f4ff)] dark:bg-[linear-gradient(135deg,#101b2d,#18243b,#101827)]',
  },
  {
    id: 'background-remover',
    title: 'Background Remove',
    description: 'Create cleaner product and portrait visuals.',
    icon: Sparkles,
    tone: 'bg-[linear-gradient(135deg,#e0fdf4,#ecfeff)] dark:bg-[linear-gradient(135deg,#0f1b1d,#152438,#101827)]',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Bundle photos into a single exportable PDF.',
    icon: FileText,
    tone: 'bg-[linear-gradient(135deg,#fff7d6,#fdf2f8)] dark:bg-[linear-gradient(135deg,#251c10,#1a1f36,#101827)]',
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Turn pages into individual image files.',
    icon: FileText,
    tone: 'bg-[linear-gradient(135deg,#eaf1ff,#e0f2fe)] dark:bg-[linear-gradient(135deg,#101b2d,#17253d,#101827)]',
  },
];

export default function QuickActions() {
  return (
    <section className="py-18">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Quick start</p>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">Start with a tool</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickTools.map(({ id, title, description, icon: Icon, tone }) => {
            const tool = TOOLS.find((entry) => entry.id === id);
            const href = tool ? TOOL_PATH(tool.id) : '/tools';

            return (
              <Link key={id} to={href} className="group block h-full">
                <div className={`flex h-full flex-col rounded-[24px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_18px_40px_rgba(91,95,239,0.18)] ${tone}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-white/80 text-accent shadow-[0_12px_28px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur-sm transition group-hover:scale-105 dark:border-white/10 dark:bg-slate-900/50 dark:text-indigo-200 dark:ring-white/5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-foreground-muted transition duration-200 group-hover:translate-x-1 group-hover:text-accent" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-foreground transition-colors group-hover:text-foreground dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-secondary transition-colors group-hover:text-foreground-secondary dark:text-slate-200">{description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
