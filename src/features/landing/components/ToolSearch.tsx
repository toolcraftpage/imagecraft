import { Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '@/shared/components/ui/Container';
import { TOOLS, TOOL_PATH } from '@/shared/constants/routes';

export default function ToolSearch() {
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return TOOLS.filter((tool) => tool.live).slice(0, 6);
    }

    return TOOLS.filter((tool) => {
      if (!tool.live) return false;
      const haystack = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
      return haystack.includes(normalized);
    }).slice(0, 8);
  }, [query]);

  return (
    <section className="py-16">
      <Container>
        <div className="rounded-[30px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] md:p-7">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Tool finder</p>
              <h2 className="text-3xl font-black tracking-[-0.05em] text-foreground md:text-4xl">Search image tools</h2>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-2 text-sm text-muted md:min-w-[360px]">
              <Search className="h-4 w-4 text-accent" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search tools"
                placeholder="Search image tools..."
                className="w-full border-0 bg-transparent text-foreground placeholder:text-muted focus:outline-none"
              />
            </div>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={TOOL_PATH(tool.id)}
                  className="group rounded-[20px] border border-border bg-surface-elevated p-4 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-base text-accent">
                      {tool.name.charAt(0)}
                    </div>
                    <Sparkles className="h-4 w-4 text-foreground-muted transition group-hover:text-accent" />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-secondary">{tool.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-border bg-surface-elevated p-8 text-center">
              <p className="text-lg font-semibold text-foreground">No tools found</p>
              <p className="mt-2 text-sm text-muted">Try “resize”, “compress”, “convert”, or “pdf”.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
