import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '@/shared/components/ui/Button';
import { ArrowRight, Sparkles, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero pt-28 pb-20">
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <div className="floating-circle absolute top-16 left-10 h-72 w-72 rounded-full bg-primary-300 blur-3xl" />
        <div className="floating-circle-reverse absolute bottom-10 right-20 h-80 w-80 rounded-full bg-accent-300 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-300"
        >
          The all‑in‑one image toolkit
        </motion.p>

        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          <span className="text-gradient animate-gradient">Your Browser Is</span>
          <br />
          <span className="text-gray-900 dark:text-white">the Ultimate Image Tool</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl leading-relaxed">
          Compress, resize, crop, remove backgrounds, convert formats, and more – all inside your
          browser. Private, fast, and free forever.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/editor">
            <Button size="lg" className="gap-2 bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25 animate-glow">
              Launch Editor <ArrowRight size={20} />
            </Button>
          </Link>
          <Link to="/tools">
            <Button variant="secondary" size="lg" className="shadow-lg">
              Explore All Tools
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
        >
          <Users size={16} className="text-accent-500" />
          <span>
            Join <strong className="text-gray-700 dark:text-gray-200">98,000+</strong> happy users
            who process over <strong className="text-gray-700 dark:text-gray-200">1.2 million</strong> images every month
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}