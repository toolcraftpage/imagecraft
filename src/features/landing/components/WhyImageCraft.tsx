import { CheckCircle2, Lock, Smartphone, Sparkles, Zap } from 'lucide-react';
import Container from '@/shared/components/ui/Container';

const reasons = [
  { title: 'Fast', description: 'Built for quick edits and fast exports.', icon: Zap, tone: 'bg-[linear-gradient(135deg,#eef2ff,#e0f2fe)]' },
  { title: 'Simple', description: 'Straightforward workflows with clear controls.', icon: Sparkles, tone: 'bg-[linear-gradient(135deg,#fdf2f8,#f5f3ff)]' },
  { title: 'Private', description: 'Your files stay under your control when processed locally.', icon: Lock, tone: 'bg-[linear-gradient(135deg,#ecfeff,#f0fdf4)]' },
  { title: 'Mobile friendly', description: 'Responsive tools that work across common devices.', icon: Smartphone, tone: 'bg-[linear-gradient(135deg,#fff7ed,#fef3c7)]' },
  { title: 'Accessible', description: 'Clear layouts and touch-friendly interactions.', icon: CheckCircle2, tone: 'bg-[linear-gradient(135deg,#f5f3ff,#ecfeff)]' },
];

export default function WhyImageCraft() {
  return (
    <section className="py-18">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Why ImageCraft</p>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">Simple tools. Serious results.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {reasons.map(({ title, description, icon: Icon, tone }) => (
            <div key={title} className={`rounded-[24px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] ${tone} dark:border-border dark:bg-[linear-gradient(135deg,#1a2437,#151d2d)]`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface-elevated text-accent shadow-sm backdrop-blur-sm">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
