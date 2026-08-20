import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/ui/Container';
import { TOOLS, TOOL_PATH } from '@/shared/constants/routes';

const popularToolIds = ['image-compressor', 'image-resizer', 'background-remover', 'converter', 'image-to-pdf', 'crop'];
const featureTones = [
  'bg-[linear-gradient(135deg,#edf4ff,#f5f3ff)]',
  'bg-[linear-gradient(135deg,#f0fdf4,#ecfeff)]',
  'bg-[linear-gradient(135deg,#fff7ed,#fdf2f8)]',
  'bg-[linear-gradient(135deg,#eef2ff,#ecfeff)]',
];

export default function PopularTools() {
  const tools = TOOLS.filter((tool) => popularToolIds.includes(tool.id));

  return (
    <section className="py-18">
      <Container>
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Popular tools</p>
            <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">Powerful tools for everyday work</h2>
          </div>
          <Link to="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover">
            Explore all tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_1fr]">
          <Link to={TOOL_PATH(tools[0].id)} className="group xl:row-span-2">
            <div className="flex h-full min-h-[280px] flex-col justify-between rounded-[28px] border border-border bg-[linear-gradient(135deg,#edf4ff,#f5f3ff,#fff7ed)] p-6 shadow-[var(--shadow-md)] transition hover:-translate-y-1 hover:border-accent/40 dark:bg-[linear-gradient(135deg,#161d2a,#1b2233,#121827)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-accent shadow-[var(--shadow-sm)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-secondary">
                  Featured
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{tools[0].category}</p>
                <h3 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-foreground">{tools[0].name}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-foreground-secondary">{tools[0].description}</p>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
                Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {tools.slice(1, 5).map((tool, index) => (
            <Link key={tool.id} to={TOOL_PATH(tool.id)} className="group block">
              <div className={`flex h-full min-h-[160px] flex-col justify-between rounded-[24px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:border-accent/40 ${featureTones[index % featureTones.length]} dark:bg-[linear-gradient(135deg,#171d2a,#182433,#111827)]`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface-elevated text-accent shadow-sm">{tool.name.charAt(0)}</div>
                  <ArrowRight className="h-4 w-4 text-foreground-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-muted">{tool.category}</p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-secondary">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
