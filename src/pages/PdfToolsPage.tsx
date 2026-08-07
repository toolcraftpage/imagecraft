import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '@/shared/components/ui/Container';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import { TOOLS, TOOL_PATH } from '@/shared/constants/routes';
import { FileText } from 'lucide-react';

const iconMap: Record<string, string> = {
  'pdf-to-image': '📄',
  'image-to-pdf': '📑',
};

export default function PdfToolsPage() {
  const pdfTools = TOOLS.filter((t) => t.id === 'pdf-to-image' || t.id === 'image-to-pdf');

  return (
    <>
      <Helmet>
        <title>PDF Tools – ImageCraft</title>
        <meta name="description" content="Convert between PDF and images right in your browser." />
      </Helmet>

      <Container className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <FileText className="inline-block mr-3 text-primary-500" size={36} />
            PDF Tools
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Convert between PDF and images – entirely in your browser.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto">
          {pdfTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link to={TOOL_PATH(tool.id)} className="block h-full">
                <Card className="h-full transition-all hover:border-primary-300 dark:hover:border-primary-600">
                  <div className="flex flex-col items-start text-left">
                    <span className="mb-3 text-3xl">{iconMap[tool.id] || '🛠️'}</span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {tool.description}
                    </p>
                    <div className="mt-4">
                      <Badge variant="success">Live</Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </>
  );
}