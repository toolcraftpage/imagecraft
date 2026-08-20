import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '@/shared/components/ui/Container';
import Card from '@/shared/components/ui/Card';
import { TOOLS, TOOL_PATH } from '@/shared/constants/routes';
import { ArrowRight, FileText, ShieldCheck, Zap } from 'lucide-react';

const iconMap: Record<string, string> = {
  'pdf-to-image': '📄',
  'image-to-pdf': '📑',
  'pdf-merge': '🧩',
};

export default function PdfToolsPage() {
  const pdfTools = TOOLS.filter((t) => ['pdf-to-image', 'image-to-pdf', 'pdf-merge'].includes(t.id));

  return (
    <>
      <Helmet>
        <title>PDF Tools – ImageCraft</title>
        <meta name="description" content="Convert between PDF and images right in your browser." />
      </Helmet>

      <div className="min-h-[70vh] bg-[radial-gradient(circle_at_15%_10%,rgba(14,165,233,0.22),transparent_28%),radial-gradient(circle_at_85%_8%,rgba(168,85,247,0.18),transparent_25%),linear-gradient(180deg,rgba(248,250,252,0.55),transparent)] pb-16 pt-8 dark:bg-[radial-gradient(circle_at_15%_10%,rgba(14,165,233,0.14),transparent_28%),radial-gradient(circle_at_85%_8%,rgba(168,85,247,0.14),transparent_25%)]">
      <Container className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#0ea5e9,#6366f1,#a855f7)] text-white shadow-[0_18px_45px_rgba(99,102,241,0.3)]"><FileText size={30} /></div>
          <h1 className="text-5xl font-black tracking-[-0.06em] text-foreground md:text-6xl">
            PDF work, simplified
          </h1>
          <p className="mt-3 text-lg text-foreground-secondary">
            Convert between PDF and images – entirely in your browser.
          </p>
        </motion.div>

        <div className="mx-auto mb-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[{ icon: Zap, label: 'Fast in-browser processing' }, { icon: ShieldCheck, label: 'Private file handling' }, { icon: FileText, label: 'Export-ready results' }].map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-4 text-sm font-semibold text-foreground shadow-[var(--shadow-sm)] dark:border-white/10 dark:bg-slate-900/60"><Icon className="h-5 w-5 text-accent" />{label}</div>)}
        </div>

        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pdfTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link to={TOOL_PATH(tool.id)} className="block h-full">
                <Card className="group h-full bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_22px_50px_rgba(91,95,239,0.16)]">
                  <div className="flex flex-col items-start text-left">
                    <div className="mb-5 flex w-full items-center justify-between"><span className="text-3xl">{iconMap[tool.id] || '🛠️'}</span><ArrowRight className="h-5 w-5 text-foreground-muted transition group-hover:translate-x-1 group-hover:text-accent" /></div>
                    <h3 className="text-lg font-bold text-foreground">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-sm text-foreground-secondary">
                      {tool.description}
                    </p>
                    <div className="mt-5 text-sm font-semibold text-accent">Open PDF tool</div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
      </div>
    </>
  );
}