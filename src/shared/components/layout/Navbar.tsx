import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Search, Sparkles, ArrowRight, Command } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';
import Container from '@/shared/components/ui/Container';
import { TOOLS, TOOL_CATEGORIES, TOOL_PATH } from '@/shared/constants/routes';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [toolsHover, setToolsHover] = useState(false);
  const [pdfHover, setPdfHover] = useState(false);

  let toolsTimeout: ReturnType<typeof setTimeout> | null = null;
  let pdfTimeout: ReturnType<typeof setTimeout> | null = null;

  const showTools = () => {
    if (toolsTimeout) clearTimeout(toolsTimeout);
    setToolsHover(true);
  };
  const hideTools = () => {
    toolsTimeout = setTimeout(() => setToolsHover(false), 120);
  };

  const showPdf = () => {
    if (pdfTimeout) clearTimeout(pdfTimeout);
    setPdfHover(true);
  };
  const hidePdf = () => {
    pdfTimeout = setTimeout(() => setPdfHover(false), 120);
  };

  const groupedTools = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    items: TOOLS.filter((t) => t.category === cat.key && t.live),
  }));

  const pdfTools = TOOLS.filter((t) => ['pdf-to-image', 'image-to-pdf', 'pdf-merge'].includes(t.id));
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return TOOLS.filter((tool) => tool.live).slice(0, 8);
    return TOOLS.filter((tool) => tool.live && `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query)).slice(0, 10);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-background/70">
      <Container className="py-3">
        <nav className="flex items-center justify-between gap-4 rounded-full border border-border bg-surface/80 px-3 py-2 shadow-[var(--shadow-sm)]">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-[0_12px_30px_rgba(47,93,255,0.25)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-[-0.04em] text-foreground">ImageCraft</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[linear-gradient(135deg,#5B5FEF,#7C3AED)] text-white shadow-[0_10px_24px_rgba(91,95,239,0.3)]' : 'text-muted hover:bg-[linear-gradient(135deg,rgba(91,95,239,0.12),rgba(124,58,237,0.08))] hover:text-foreground dark:text-slate-200 dark:hover:text-white'}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/editor"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[linear-gradient(135deg,#5B5FEF,#7C3AED)] text-white shadow-[0_10px_24px_rgba(91,95,239,0.3)]' : 'text-muted hover:bg-[linear-gradient(135deg,rgba(91,95,239,0.12),rgba(124,58,237,0.08))] hover:text-foreground dark:text-slate-200 dark:hover:text-white'}`
              }
            >
              Editor
            </NavLink>

            <div className="relative" onMouseEnter={showTools} onMouseLeave={hideTools}>
              <NavLink
                to="/tools"
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[linear-gradient(135deg,#5B5FEF,#7C3AED)] text-white shadow-[0_10px_24px_rgba(91,95,239,0.3)]' : 'text-muted hover:bg-[linear-gradient(135deg,rgba(91,95,239,0.12),rgba(124,58,237,0.08))] hover:text-foreground dark:text-slate-200 dark:hover:text-white'}`
                }
              >
                Tools
              </NavLink>

              {toolsHover && (
                <div className="absolute left-0 top-full mt-3 w-64 max-h-[360px] overflow-y-auto rounded-2xl border border-border bg-surface-elevated p-3 shadow-[var(--shadow-md)] backdrop-blur-xl scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  {groupedTools.map((group) => (
                    <div key={group.key} className="mb-2 last:mb-0">
                      <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">{group.label}</p>
                      {group.items.map((tool) => (
                        <Link key={tool.id} to={TOOL_PATH(tool.id)} className="block rounded-xl px-2 py-2 text-sm text-foreground-secondary transition hover:bg-accent-soft hover:text-accent">
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={showPdf} onMouseLeave={hidePdf}>
              <NavLink
                to="/pdf-tools"
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[linear-gradient(135deg,#5B5FEF,#7C3AED)] text-white shadow-[0_10px_24px_rgba(91,95,239,0.3)]' : 'text-muted hover:bg-[linear-gradient(135deg,rgba(91,95,239,0.12),rgba(124,58,237,0.08))] hover:text-foreground dark:text-slate-200 dark:hover:text-white'}`
                }
              >
                PDF Tools
              </NavLink>

              {pdfHover && (
                <div className="absolute left-0 top-full mt-3 w-48 max-h-[260px] overflow-y-auto rounded-2xl border border-border bg-surface-elevated p-3 shadow-[var(--shadow-md)] backdrop-blur-xl scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  {pdfTools.map((tool) => (
                    <Link key={tool.id} to={TOOL_PATH(tool.id)} className="block rounded-xl px-2 py-2 text-sm text-foreground-secondary transition hover:bg-accent-soft hover:text-accent">
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/donate"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[linear-gradient(135deg,#F59E0B,#F97316)] text-white shadow-[0_10px_24px_rgba(249,115,22,0.28)]' : 'text-muted hover:bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(249,115,22,0.08))] hover:text-foreground dark:text-slate-200 dark:hover:text-white'}`
              }
            >
              Donate
            </NavLink>

          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search image tools"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-accent/40 hover:text-accent md:flex"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-accent/40 hover:text-accent"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <Link
              to="/editor"
              className="hidden rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_30px_rgba(47,93,255,0.25)] transition hover:bg-accent-hover sm:inline-flex"
            >
              Start Creating
            </Link>

            <button
              type="button"
              aria-label="Open mobile menu"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/35 px-4 pt-24 backdrop-blur-sm"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setSearchOpen(false);
              }}
            >
              <div className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-border bg-surface-elevated shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
                <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                  <Search className="h-5 w-5 shrink-0 text-accent" />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && searchResults[0]) {
                        navigate(TOOL_PATH(searchResults[0].id));
                        setSearchOpen(false);
                      }
                    }}
                    placeholder="Search resize, compress, PDF, background removal..."
                    aria-label="Search tools"
                    className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-foreground-muted"
                  />
                  <kbd className="hidden items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1 text-[10px] font-semibold text-foreground-muted sm:inline-flex"><Command className="h-3 w-3" /> Enter</kbd>
                  <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="rounded-lg p-2 text-foreground-muted hover:bg-surface-muted hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>

                <div className="max-h-[min(60vh,480px)] overflow-y-auto p-3">
                  <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-muted">{searchQuery ? 'Matching tools' : 'Popular tools'}</p>
                  {searchResults.length > 0 ? searchResults.map((tool) => (
                    <Link key={tool.id} to={TOOL_PATH(tool.id)} onClick={() => setSearchOpen(false)} className="group flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-accent-soft">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-bold text-accent">{tool.name.charAt(0)}</span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-foreground">{tool.name}</span><span className="block truncate text-xs text-foreground-secondary">{tool.description}</span></span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                    </Link>
                  )) : <div className="px-3 py-8 text-center"><p className="font-semibold text-foreground">No tools found</p><p className="mt-1 text-sm text-foreground-secondary">Try “crop”, “PDF”, “resize”, or “background”.</p></div>}
                </div>
                <div className="flex items-center justify-between border-t border-border bg-surface-muted px-4 py-3 text-xs text-foreground-muted"><span>Search all ImageCraft tools</span><Link to="/tools" onClick={() => setSearchOpen(false)} className="font-semibold text-accent hover:text-accent-hover">Browse directory</Link></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden md:hidden"
            >
              <div className="mt-3 rounded-[var(--radius-xl)] border border-border bg-surface p-3 shadow-[var(--shadow-sm)]">
                <div className="space-y-1">
                  <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-foreground hover:bg-surface-elevated">Home</NavLink>
                  <NavLink to="/editor" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-foreground hover:bg-surface-elevated">Editor</NavLink>
                  <NavLink to="/tools" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-foreground hover:bg-surface-elevated">Tools</NavLink>
                  <NavLink to="/pdf-tools" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-foreground hover:bg-surface-elevated">PDF Tools</NavLink>
                  <NavLink to="/donate" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-foreground hover:bg-surface-elevated">Donate</NavLink>
                  <Link to="/editor" onClick={() => setMobileMenuOpen(false)} className="mt-2 flex items-center justify-center rounded-xl bg-accent px-3 py-2.5 text-sm font-semibold text-white">Start Creating</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}