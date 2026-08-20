import { motion } from 'framer-motion';
import { ShieldCheck, SlidersHorizontal, Zap } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Container from '@/shared/components/ui/Container';

const features = [
  {
    icon: <Zap className="h-7 w-7 text-accent" />,
    title: 'Fast by default',
    description: 'Built for quick edits and instant exports, with a workflow designed to keep your momentum moving.',
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-accent" />,
    title: 'Privacy first',
    description: 'Browser-based processing keeps tools fast and your files under your control when local processing is used.',
  },
  {
    icon: <SlidersHorizontal className="h-7 w-7 text-accent" />,
    title: 'Built for editing',
    description: 'The platform combines real image utilities with a cleaner creator-focused workspace for modern work.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-background py-20">
      <Container>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Why ImageCraft
          </div>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">Built for modern image work.</h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
              <Card className="h-full rounded-[26px] border border-border bg-surface p-6" hover={false}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft">{feature.icon}</div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}