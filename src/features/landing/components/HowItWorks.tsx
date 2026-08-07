import { motion } from 'framer-motion';
import { Upload, Sliders, Download } from 'lucide-react';
import Container from '@/shared/components/ui/Container';

const steps = [
  {
    icon: <Upload size={32} />,
    title: '1. Upload',
    description: 'Drag & drop your image or select it from your device. No upload to server.',
  },
  {
    icon: <Sliders size={32} />,
    title: '2. Edit',
    description: 'Use our powerful tools to adjust, crop, compress, or enhance your image.',
  },
  {
    icon: <Download size={32} />,
    title: '3. Download',
    description: 'Get your processed image instantly in the format you need.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-how py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Three simple steps – everything happens locally.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-full hidden h-0.5 w-full -translate-x-1/2 bg-primary-200 dark:bg-primary-800 md:block" />
              )}
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}