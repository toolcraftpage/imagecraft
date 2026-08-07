import { motion } from 'framer-motion';
import { Zap, Shield, Smartphone } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Container from '@/shared/components/ui/Container';

const features = [
  {
    icon: <Zap className="h-8 w-8 text-yellow-500" />,
    title: 'Lightning Fast',
    description: 'All processing happens locally using your device’s hardware. No uploads, no waiting.',
  },
  {
    icon: <Shield className="h-8 w-8 text-green-500" />,
    title: '100% Private',
    description: 'Your images never leave your device. We don’t store, track, or analyse anything.',
  },
  {
    icon: <Smartphone className="h-8 w-8 text-blue-500" />,
    title: 'Works Everywhere',
    description: 'Fully responsive, with dark mode and keyboard shortcuts. Use it on any device.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-features py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Why ImageCraft?
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Built with privacy and speed in mind.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Card className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-gray-50 p-3 dark:bg-gray-700">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}