import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/shared/components/ui/Button';
import Container from '@/shared/components/ui/Container';

export default function FinalCTA() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-[32px] border border-border bg-[linear-gradient(135deg,#eef2ff_0%,#f5f3ff_32%,#fff7ed_100%)] p-8 shadow-[var(--shadow-lg)] md:p-12 dark:bg-[linear-gradient(135deg,#151a2b_0%,#1b2238_34%,#1a0f2c_100%)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Ready when you are</p>
              <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">Ready to work with your images?</h2>
              <p className="mt-4 text-base leading-7 text-muted">
                Create polished visuals, convert files, resize assets, and keep your workflow moving without friction.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link to="/editor" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2">
                  Start Creating <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to="/tools" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary">
                  Explore All Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
