import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import Container from '@/shared/components/ui/Container';
import AdSlot from '@/shared/components/ads/AdSlot';
import { TOOLS, TOOL_CATEGORIES, TOOL_PATH } from '@/shared/constants/routes';

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

export default function ToolsShowcase() {
  return (
    <section className="bg-tools-section py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Explore Our Tools
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            A growing collection of client‑side image utilities.
          </p>
        </motion.div>

        {/* Render categories */}
        {TOOL_CATEGORIES.map((category) => {
          const categoryTools = TOOLS.filter((t) => t.category === category.key);
          if (categoryTools.length === 0) return null;
          return (
            <div key={category.key} className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {category.label}
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {categoryTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    {tool.live ? (
                      <Link to={TOOL_PATH(tool.id)} className="block h-full">
                        <Card className="flex flex-col items-start text-left h-full">
                          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                            <span className="text-xl">{iconMap[tool.id] || '🛠️'}</span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {tool.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {tool.description}
                          </p>
                          <div className="mt-4">
                            <Badge variant="success">Live</Badge>
                          </div>
                        </Card>
                      </Link>
                    ) : (
                      <Card className="flex flex-col items-start text-left h-full opacity-70">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                          <span className="text-xl">{iconMap[tool.id] || '🛠️'}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {tool.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {tool.description}
                        </p>
                        <div className="mt-4">
                          <Badge variant="warning">Coming soon</Badge>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Inline advertisement after the tools grid */}
        <div className="mt-12 flex justify-center">
          <AdSlot size="inline" />
        </div>
      </Container>
    </section>
  );
}