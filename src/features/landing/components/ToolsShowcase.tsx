import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/shared/components/ui/Card';
import Container from '@/shared/components/ui/Container';
import AdSlot from '@/shared/components/ads/AdSlot';
import { TOOLS, TOOL_PATH } from '@/shared/constants/routes';

const iconMap: Record<string, string> = {
  'image-compressor': '📦',
  crop: '✂️',
  'image-resizer': '📐',
  flip: '↔️',
  rotate: '↻',
  brightness: '☀️',
  contrast: '◐',
  saturation: '🎨',
  hue: '🌈',
  'text-overlay': 'T',
  'collage-maker': '▣',
  'pdf-to-image': '📄',
  'image-to-pdf': '📑',
  'favicon-generator': '☆',
  'metadata-viewer': '⌁',
  'palette-extractor': '◫',
  'background-remover': '✦',
  converter: '⇄',
};

const quickActions = [
  { id: 'image-compressor', label: 'Compress' },
  { id: 'image-resizer', label: 'Resize' },
  { id: 'converter', label: 'Convert' },
  { id: 'crop', label: 'Crop' },
  { id: 'background-remover', label: 'Remove BG' },
  { id: 'image-to-pdf', label: 'To PDF' },
  { id: 'pdf-to-image', label: 'From PDF' },
  { id: 'brightness', label: 'Editor' },
];

export default function ToolsShowcase() {
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return TOOLS.filter((tool) => tool.live);
    return TOOLS.filter((tool) => tool.live && `${tool.name} ${tool.description}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <section className="bg-surface-muted py-20">
      <Container>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Tool discovery
          </div>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">Find the right tool</h2>
          <p className="mt-3 max-w-2xl text-base text-muted md:text-lg">Search, compare, and jump into the tools you need without leaving the creative flow.</p>
        </motion.div>

        <div className="mb-10 rounded-[28px] border border-border bg-surface p-4 shadow-[var(--shadow-sm)] md:p-5">
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
            <Search className="h-4 w-4 text-accent" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search image tools..."
              className="w-full border-0 bg-transparent text-foreground placeholder:text-muted focus:outline-none"
              aria-label="Search image tools"
            />
          </label>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((tool) => {
            const item = TOOLS.find((entry) => entry.id === tool.id);
            if (!item) return null;
            return (
              <Link key={tool.id} to={TOOL_PATH(item.id)} className="group block">
                <Card className="h-full rounded-[22px] border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-md)]" hover={false}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-lg text-accent">{iconMap[item.id] || '✦'}</div>
                    <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{tool.label}</h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredTools.map((tool, index) => (
            <motion.div key={tool.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
              <Link to={TOOL_PATH(tool.id)} className="block h-full">
                <Card className="flex h-full flex-col rounded-[24px] border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/30 hover:shadow-[var(--shadow-md)]" hover={false}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-2xl text-accent">{iconMap[tool.id] || '✦'}</div>
                    <span className="rounded-full border border-border bg-surface-elevated px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{tool.live ? 'Live' : 'Soon'}</span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{tool.description}</p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
                    Open tool <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="mt-8 rounded-[24px] border border-dashed border-border bg-surface p-8 text-center text-muted">
            No tools match your search. Try “resize”, “compress”, “background” or “pdf”.
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <AdSlot size="inline" />
        </div>
      </Container>
    </section>
  );
}