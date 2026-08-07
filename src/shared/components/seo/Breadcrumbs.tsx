import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTE_LABELS } from '@/shared/constants/routes';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Build breadcrumb items
  const breadcrumbs = pathnames.map((_, index) => {
    const url = `/${pathnames.slice(0, index + 1).join('/')}`;
    const label = ROUTE_LABELS[url] || decodeURIComponent(pathnames[index]);
    return { url, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white flex items-center">
            <Home size={14} className="mr-1" />
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, idx) => (
          <li key={crumb.url} className="flex items-center space-x-2">
            <ChevronRight size={14} />
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-700 dark:text-gray-200">{crumb.label}</span>
            ) : (
              <Link to={crumb.url} className="hover:text-gray-900 dark:hover:text-white">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}