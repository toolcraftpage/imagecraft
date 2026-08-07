import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '@/shared/components/ui/Button';
import Container from '@/shared/components/ui/Container';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-cta relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Transform Your Images?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-100">
            Start editing now – no account required, no watermarks, completely free.
          </p>
          <div className="mt-8">
            {/* THIS BUTTON NOW LINKS TO /editor */}
            <Link to="/editor">
              <Button
                size="lg"
                className="gap-2 bg-white text-accent-700 hover:bg-gray-100 shadow-lg"
              >
                Launch Editor <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}