import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Wand2 } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Container from '@/shared/components/ui/Container';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_8%_8%,rgba(14,165,233,0.28),transparent_24%),radial-gradient(circle_at_82%_0%,rgba(236,72,153,0.22),transparent_22%),radial-gradient(circle_at_46%_95%,rgba(245,158,11,0.16),transparent_26%),linear-gradient(135deg,#f8fcff_0%,#f7f1ff_42%,#fff9ed_100%)] pt-12 pb-16 md:pt-20 md:pb-20 dark:bg-[radial-gradient(circle_at_8%_8%,rgba(56,189,248,0.22),transparent_24%),radial-gradient(circle_at_82%_0%,rgba(217,70,239,0.2),transparent_22%),radial-gradient(circle_at_46%_95%,rgba(245,158,11,0.12),transparent_26%),linear-gradient(135deg,#09111c_0%,#111827_42%,#171225_100%)]">
      <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full border-[24px] border-pink-300/20 blur-[1px] dark:border-pink-400/10" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-44 w-44 rounded-full border-[18px] border-cyan-300/20 dark:border-cyan-400/10" />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent shadow-[0_10px_30px_rgba(91,95,239,0.18)] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Browser-first creative studio
            </div>

            <h1 className="text-5xl font-black tracking-[-0.07em] text-foreground md:text-6xl lg:text-7xl">
              Turn raw images into
              <span className="mt-2 block bg-[linear-gradient(110deg,#0891b2_0%,#6366f1_28%,#db2777_62%,#ea580c_100%)] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(219,39,119,0.24)]">powerful creative work.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-foreground-secondary md:text-lg">
              Edit, resize, convert, compress, and transform images in a polished browser workspace built for creators, teams, and small businesses.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/editor">
                <Button size="lg" className="gap-2 px-5">
                  Start Creating <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to="/tools">
                <Button variant="secondary" size="lg" className="px-5">
                  Explore Tools
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-foreground-secondary">
              {['No signup required', 'Fast browser processing', 'Private by default'].map((item) => (
                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
                  <Check className="h-4 w-4 text-accent" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-[560px] rounded-[30px] border border-white/80 bg-white/75 p-4 shadow-[0_30px_90px_rgba(79,70,229,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-elevated px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex items-center gap-2 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
                  <Wand2 className="h-3.5 w-3.5" />
                  AI workspace
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[24px] border border-border bg-surface-elevated p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-muted">Tools</p>
                  <div className="mt-4 space-y-2">
                    {['Resize', 'Crop', 'Convert', 'Remove BG'].map((tool, index) => (
                      <div key={tool} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${index === 3 ? 'bg-accent-soft text-accent' : 'bg-surface text-foreground/80'}`}>
                        <span>{tool}</span>
                        <span className="text-xs text-muted">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-border bg-surface-elevated p-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-foreground-muted">
                    <span>Project</span>
                    <span>PNG · 4.8 MB</span>
                  </div>

                  <div className="mt-4 rounded-[20px] border border-border bg-[linear-gradient(135deg,#f1f5f9,#e2e8f0)] p-4 dark:bg-[linear-gradient(135deg,#1f2937,#0f172a)]">
                    <div className="flex h-48 items-center justify-center rounded-[18px] border border-dashed border-border bg-[radial-gradient(circle_at_center,_rgba(91,95,239,0.15),_transparent_60%)]">
                      <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-surface shadow-[0_18px_50px_rgba(17,17,17,0.08)]">
                        <div className="h-16 w-16 rounded-[20px] bg-[linear-gradient(135deg,#67e8f9,#818cf8_46%,#f9a8d4)] shadow-[0_10px_25px_rgba(99,102,241,0.28)]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-foreground-secondary">
                    <div className="rounded-xl bg-surface px-2 py-2"><div className="font-semibold text-foreground">1080</div><div>Width</div></div>
                    <div className="rounded-xl bg-surface px-2 py-2"><div className="font-semibold text-foreground">1920</div><div>Height</div></div>
                    <div className="rounded-xl bg-surface px-2 py-2"><div className="font-semibold text-foreground">96%</div><div>Quality</div></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}