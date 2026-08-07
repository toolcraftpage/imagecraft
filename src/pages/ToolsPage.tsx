import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '@/shared/components/ui/Container';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import { TOOLS, TOOL_CATEGORIES, TOOL_PATH } from '@/shared/constants/routes';
import { Wrench } from 'lucide-react';

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
  'favicon-generator': '⭐',
  'metadata-viewer': '📋',
  'palette-extractor': '🎨',
  converter: '🔄',
};

export default function ToolsPage() {
  return (
    <>
      <Helmet>
        <title>All Image Tools – ImageCraft</title>
        <meta name="description" content="Explore all free client‑side image editing tools." />
      </Helmet>

      <Container className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <Wrench className="inline-block mr-3 text-primary-500" size={36} />
            All Tools
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Every utility runs entirely in your browser – private and fast.
          </p>
        </motion.div>

        {TOOL_CATEGORIES.map((category) => {
          const categoryTools = TOOLS.filter((t) => t.category === category.key && t.live);
          if (categoryTools.length === 0) return null;
          return (
            <section key={category.key} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {category.label}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
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
            </section>
          );
        })}
      </Container>
    </>
  );
}