import { motion } from 'framer-motion';
import Card from '@/shared/components/ui/Card';
import Container from '@/shared/components/ui/Container';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "ImageCraft replaced three different tools I used before. It's incredibly fast and respects my privacy.",
    author: 'Alex R.',
    role: 'UI Designer',
    avatar: 'AR',
  },
  {
    quote: "The background remover works like magic. I'm still amazed it all runs in the browser.",
    author: 'Jamie L.',
    role: 'Photographer',
    avatar: 'JL',
  },
  {
    quote: 'As a developer, I appreciate the clean code and performance. My go‑to for quick image edits.',
    author: 'Morgan T.',
    role: 'Frontend Developer',
    avatar: 'MT',
  },
];

export default function TestimonialsSection() {
  return (
    <Container className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
          What Our Users Say
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Join thousands of creators who trust ImageCraft.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="flex flex-col h-full">
              <div className="mb-4 flex space-x-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="flex-1 text-gray-600 dark:text-gray-400">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}