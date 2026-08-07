import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Heart, Image } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';
import Container from '@/shared/components/ui/Container';
import { TOOLS, TOOL_CATEGORIES, TOOL_PATH } from '@/shared/constants/routes';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hover states
  const [toolsHover, setToolsHover] = useState(false);
  let toolsTimeout: ReturnType<typeof setTimeout> | null = null;
  const showTools = () => {
    if (toolsTimeout) clearTimeout(toolsTimeout);
    setToolsHover(true);
  };
  const hideTools = () => {
    toolsTimeout = setTimeout(() => setToolsHover(false), 100);
  };

  const [pdfHover, setPdfHover] = useState(false);
  let pdfTimeout: ReturnType<typeof setTimeout> | null = null;
  const showPdf = () => {
    if (pdfTimeout) clearTimeout(pdfTimeout);
    setPdfHover(true);
  };
  const hidePdf = () => {
    pdfTimeout = setTimeout(() => setPdfHover(false), 100);
  };

  const groupedTools = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    items: TOOLS.filter((t) => t.category === cat.key && t.live),
  }));

  const pdfTools = TOOLS.filter(
    (t) => t.id === 'pdf-to-image' || t.id === 'image-to-pdf'
  );

  const isDark = theme === 'dark';

  // ----- Inline styles for dark mode (keep as before) -----
  const headerDarkStyle = isDark
    ? { background: 'linear-gradient(to right, #1f2937, #1f2937)', borderColor: '#374151' }
    : {};

  const linkBaseStyle = isDark
    ? { color: '#f1f5f9' }
    : {};

  const linkActiveStyle = isDark
    ? { backgroundColor: '#4b5563', color: '#ffffff' }
    : {};

  const donateBaseStyle = isDark
    ? { color: '#fca5a5' }
    : {};

  const donateActiveStyle = isDark
    ? { backgroundColor: '#7f1d1d', color: '#fecaca' }
    : {};

  const toggleStyle = isDark
    ? { color: '#f1f5f9' }
    : {};

  const mobileLinkStyle = isDark
    ? { color: '#f1f5f9' }
    : {};

  return (
    <header
      className="sticky top-0 z-50 bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-100 shadow-md border-b border-indigo-200 transition-colors duration-300"
      style={headerDarkStyle}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
              <Image size={20} />
            </span>
            <span className="text-gradient font-extrabold tracking-tight">
              ImageCraft
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center space-x-1.5 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-700 hover:bg-white/80 hover:text-primary-700 hover:shadow-sm'
                }`
              }
              style={({ isActive }) => ({
                ...linkBaseStyle,
                ...(isActive ? linkActiveStyle : {}),
              })}
            >
              Home
            </NavLink>

            <NavLink
              to="/editor"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-700 hover:bg-white/80 hover:text-primary-700 hover:shadow-sm'
                }`
              }
              style={({ isActive }) => ({
                ...linkBaseStyle,
                ...(isActive ? linkActiveStyle : {}),
              })}
            >
              Editor
            </NavLink>

            {/* Tools dropdown */}
            <div className="relative" onMouseEnter={showTools} onMouseLeave={hideTools}>
              <NavLink
                to="/tools"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-gray-700 hover:bg-white/80 hover:text-primary-700 hover:shadow-sm'
                  }`
                }
                style={({ isActive }) => ({
                  ...linkBaseStyle,
                  ...(isActive ? linkActiveStyle : {}),
                })}
              >
                Tools
              </NavLink>
              {toolsHover && (
                <div
                  onMouseEnter={showTools}
                  onMouseLeave={hideTools}
                  className="absolute left-0 mt-2 w-56 origin-top-left rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none dark:bg-gray-700 dark:ring-gray-600 max-h-80 overflow-y-auto z-[var(--z-dropdown)]"
                >
                  {groupedTools.map((group) => (
                    <div key={group.key}>
                      <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                        {group.label}
                      </div>
                      {group.items.map((tool) => (
                        <Link
                          key={tool.id}
                          to={TOOL_PATH(tool.id)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors"
                          style={isDark ? { color: '#f1f5f9' } : {}}
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PDF Tools dropdown */}
            <div className="relative" onMouseEnter={showPdf} onMouseLeave={hidePdf}>
              <NavLink
                to="/pdf-tools"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-gray-700 hover:bg-white/80 hover:text-primary-700 hover:shadow-sm'
                  }`
                }
                style={({ isActive }) => ({
                  ...linkBaseStyle,
                  ...(isActive ? linkActiveStyle : {}),
                })}
              >
                PDF Tools
              </NavLink>
              {pdfHover && (
                <div
                  onMouseEnter={showPdf}
                  onMouseLeave={hidePdf}
                  className="absolute left-0 mt-2 w-48 origin-top-left rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none dark:bg-gray-700 dark:ring-gray-600 max-h-80 overflow-y-auto z-[var(--z-dropdown)]"
                >
                  {pdfTools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={TOOL_PATH(tool.id)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors"
                      style={isDark ? { color: '#f1f5f9' } : {}}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Donate link */}
            <NavLink
              to="/donate"
              className={({ isActive }) =>
                `ml-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                  isActive
                    ? 'bg-accent-200 text-accent-800 shadow-sm'
                    : 'text-accent-700 hover:bg-accent-100 hover:text-accent-800 hover:shadow-sm'
                }`
              }
              style={({ isActive }) => ({
                ...donateBaseStyle,
                ...(isActive ? donateActiveStyle : {}),
              })}
            >
              <Heart size={14} />
              Donate
            </NavLink>
          </div>

          {/* Theme toggle + mobile menu button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 transition-colors hover:bg-white/70 dark:hover:bg-gray-600"
              style={toggleStyle}
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              className="md:hidden rounded-xl p-2 transition-colors hover:bg-white/70 dark:hover:bg-gray-600"
              style={toggleStyle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="space-y-1 pb-4 pt-2">
                <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/70 dark:hover:bg-gray-600" style={mobileLinkStyle}>Home</NavLink>
                <NavLink to="/editor" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/70 dark:hover:bg-gray-600" style={mobileLinkStyle}>Editor</NavLink>
                <NavLink to="/tools" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/70 dark:hover:bg-gray-600" style={mobileLinkStyle}>Tools</NavLink>
                <NavLink to="/pdf-tools" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/70 dark:hover:bg-gray-600" style={mobileLinkStyle}>PDF Tools</NavLink>
                <NavLink to="/donate" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-accent-100 dark:hover:bg-accent-900/40" style={donateBaseStyle}><Heart size={14} />Donate</NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}