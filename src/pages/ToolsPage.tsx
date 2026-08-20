import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Container from '@/shared/components/ui/Container';
import Card from '@/shared/components/ui/Card';
import { TOOLS, TOOL_CATEGORIES, TOOL_PATH } from '@/shared/constants/routes';
import { ArrowRight, BookOpen, CircleHelp, FileText, Search, Sparkles, Wrench } from 'lucide-react';

const iconMap: Record<string, string> = {
  'image-compressor': '📦',
  crop: '✂️',
  'image-resizer': '📐',
  flip: '🔄',
  rotate: '↻',
  brightness: '☀️',
  contrast: '🌓',
  saturation: '🎨',
  hue: '🌈',
  'text-overlay': '🔤',
  'collage-maker': '🖼️',
  'meme-generator-pro': '😂',
  'pdf-to-image': '📄',
  'image-to-pdf': '📑',
  'pdf-merge': '🧩',
  'watermark': '💧',
  'favicon-generator': '⭐',
  'metadata-viewer': '📋',
  'palette-extractor': '🎨',
  'background-remover': '✨',
  converter: '🔄',
};

const sectionLinks = [
  { label: 'Tools', href: '#overview', icon: Wrench },
  { label: 'PDF Tools', href: '/pdf-tools', icon: FileText },
  { label: 'Resources', href: '#resources', icon: BookOpen },
];

const resourceLinks = [
  { label: 'Guides', description: 'Browse tool walkthroughs and quick tips.', href: '/tools', icon: BookOpen },
  { label: 'FAQ', description: 'Answer common questions about editing and exports.', href: '/tools', icon: CircleHelp },
  { label: 'Help Center', description: 'Jump into the editor and get product support.', href: '/editor', icon: Sparkles },
];

const categoryTones: Record<string, string> = {
  basic: 'from-sky-500/20 via-cyan-500/10 to-transparent border-sky-200/70',
  adjust: 'from-amber-400/25 via-orange-400/10 to-transparent border-amber-200/80',
  create: 'from-pink-500/20 via-rose-400/10 to-transparent border-pink-200/70',
  convert: 'from-emerald-500/20 via-teal-400/10 to-transparent border-emerald-200/70',
  other: 'from-violet-500/22 via-indigo-400/10 to-transparent border-violet-200/70',
};

export default function ToolsPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const liveTools = TOOLS.filter((tool) => tool.live);
  const filteredTools = useMemo(() => liveTools.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const haystack = `${tool.name} ${tool.description}`.toLowerCase();
    return matchesCategory && haystack.includes(query.trim().toLowerCase());
  }), [activeCategory, liveTools, query]);

  return (
    <>
      <Helmet>
        <title>All Image Tools – ImageCraft</title>
        <meta name="description" content="Explore all free client‑side image editing tools." />
      </Helmet>

      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.20),transparent_26%),radial-gradient(circle_at_90%_12%,rgba(236,72,153,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.7),transparent_45%)] pb-16 pt-10 dark:bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.16),transparent_26%),radial-gradient(circle_at_90%_12%,rgba(217,70,239,0.16),transparent_24%)]">
      <Container className="relative py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#38bdf8,#6366f1_48%,#ec4899)] text-white shadow-[0_18px_45px_rgba(99,102,241,0.28)]">
            <Wrench size={30} />
          </div>
          <h1 className="text-5xl font-black tracking-[-0.06em] text-foreground md:text-6xl">
            Your creative toolkit
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-foreground-secondary">
            Find the right tool, drop in your file, and ship a polished result without leaving your browser.
          </p>
        </motion.div>

        <div className="mx-auto mb-10 grid max-w-4xl gap-3 sm:grid-cols-3">
          {[
            { value: liveTools.length, label: 'ready-to-use tools', tone: 'from-sky-500 to-cyan-400' },
            { value: '100%', label: 'browser processing', tone: 'from-emerald-500 to-teal-400' },
            { value: '0', label: 'signups required', tone: 'from-pink-500 to-orange-400' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4 text-center shadow-[var(--shadow-sm)] backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
              <div className={`bg-gradient-to-r ${stat.tone} bg-clip-text text-2xl font-black text-transparent`}>{stat.value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {sectionLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              to={href}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-soft hover:text-accent dark:hover:bg-accent-soft"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="mb-10 rounded-[24px] border border-white/80 bg-white/75 p-3 shadow-[var(--shadow-md)] backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground-secondary">
              <Search className="h-5 w-5 text-accent" />
              <span className="sr-only">Search tools</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resize, PDF, background removal..." className="w-full bg-transparent text-foreground outline-none placeholder:text-foreground-muted" />
            </label>
            <div className="flex gap-2 overflow-x-auto">
              <button type="button" onClick={() => setActiveCategory('all')} className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${activeCategory === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-surface text-foreground-secondary hover:bg-accent-soft hover:text-accent'}`}>All tools</button>
              {TOOL_CATEGORIES.map((category) => <button key={category.key} type="button" onClick={() => setActiveCategory(category.key)} className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${activeCategory === category.key ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-surface text-foreground-secondary hover:bg-accent-soft hover:text-accent'}`}>{category.label}</button>)}
            </div>
          </div>
        </div>

        <section id="overview" className="space-y-8">
          {TOOL_CATEGORIES.map((category) => {
            const categoryTools = filteredTools.filter((t) => t.category === category.key);
            if (categoryTools.length === 0) return null;
            return (
              <section key={category.key} className="mb-12">
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Tool family</p><h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-foreground">{category.label}</h2></div>
                  <span className="text-sm font-semibold text-foreground-muted">{categoryTools.length} tools</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link to={TOOL_PATH(tool.id)} className="block h-full">
                        <Card className={`h-full bg-gradient-to-br ${categoryTones[category.key]} transition-all hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(91,95,239,0.16)]`}>
                          <div className="flex flex-col items-start text-left">
                            <div className="mb-5 flex w-full items-center justify-between"><span className="text-3xl">{iconMap[tool.id] || '🛠️'}</span><span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:bg-slate-900/60 dark:text-emerald-300">Ready</span></div>
                            <h3 className="text-lg font-bold text-foreground">
                              {tool.name}
                            </h3>
                            <p className="mt-1 text-sm text-foreground-secondary">
                              {tool.description}
                            </p>
                            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">Open tool <ArrowRight className="h-4 w-4" /></div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
          {filteredTools.length === 0 && <div className="rounded-[24px] border border-dashed border-border bg-surface p-12 text-center"><p className="text-xl font-bold text-foreground">No matching tools</p><p className="mt-2 text-sm text-foreground-secondary">Try a different name or category.</p></div>}
        </section>

        <section id="resources" className="pt-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Resources</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support and learning</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {resourceLinks.map(({ label, description, href, icon: Icon }) => (
              <Link key={label} to={href} className="group block h-full">
                <div className="flex h-full flex-col rounded-[24px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-md)]">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-foreground-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">{label}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-secondary">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>
      </div>
    </>
  );
}