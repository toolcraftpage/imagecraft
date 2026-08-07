import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Container from '@/shared/components/ui/Container';

const stats = [
  { label: 'Images Processed', value: 1240000, suffix: '+' },
  { label: 'Supported Formats', value: 12, suffix: '+' },
  { label: 'Happy Users', value: 98000, suffix: '+' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count.toLocaleString()}{suffix}</>;
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <span ref={ref} className="text-4xl font-extrabold text-white md:text-5xl">
      {isInView ? (
        <CountUp target={value} suffix={suffix} />
      ) : (
        '0' + suffix
      )}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-stats relative overflow-hidden py-16">
      {/* Decorative circles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-white" />
      </div>

      <Container className="relative">
        <div className="grid gap-8 text-center md:grid-cols-3">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <div className="mt-2 text-sm font-medium uppercase tracking-wider text-primary-200">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}