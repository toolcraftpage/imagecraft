import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Breadcrumbs from '@/shared/components/seo/Breadcrumbs';
import Container from '@/shared/components/ui/Container';
import ScrollToTop from '@/shared/components/ScrollToTop';

export default function MainLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-background">
      <Navbar />
      <ScrollToTop />

      <div className="flex min-h-0 flex-1">
        <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {location.pathname !== '/' && (
                <Container className="pt-4">
                  <Breadcrumbs />
                </Container>
              )}
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}