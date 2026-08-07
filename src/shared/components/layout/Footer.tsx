import { Link } from 'react-router-dom';
import Container from '@/shared/components/ui/Container';

interface FooterProps {
  children?: React.ReactNode;
}

export default function Footer({ children }: FooterProps) {
  return (
    <footer className="border-t border-gray-200/60 bg-surface py-8 dark:border-gray-700/40 dark:bg-surface">
      <Container>
        {children}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} ImageCraft. All rights reserved.
          </p>
          <nav className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
            <Link to="/editor" className="hover:text-gray-900 dark:hover:text-white">Editor</Link>
            <Link to="/tools" className="hover:text-gray-900 dark:hover:text-white">Tools</Link>
            <a href="#privacy" className="hover:text-gray-900 dark:hover:text-white">Privacy</a>
            <a href="#terms" className="hover:text-gray-900 dark:hover:text-white">Terms</a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}