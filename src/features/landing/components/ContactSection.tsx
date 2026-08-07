import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Container from '@/shared/components/ui/Container';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [state, handleSubmit] = useForm('xqpzkgnl');

  return (
    <section className="bg-contact py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Have a suggestion, found a bug, or just want to say hello? We'd love to hear from you!
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mt-12 max-w-xl space-y-6 rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="space-y-5">
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 outline-none transition-all"
                />
              </div>
              <ValidationError field="name" prefix="Name" errors={state.errors} className="text-red-500 text-xs mt-1" />
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 outline-none transition-all"
                />
              </div>
              <ValidationError field="email" prefix="Email" errors={state.errors} className="text-red-500 text-xs mt-1" />
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Your message..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 outline-none transition-all resize-none"
                />
              </div>
              <ValidationError field="message" prefix="Message" errors={state.errors} className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <Button type="submit" disabled={state.submitting} className="w-full gap-2">
            <Send size={16} />
            {state.submitting ? 'Sending...' : 'Send Message'}
          </Button>

          {state.succeeded && (
            <p className="text-center text-sm text-green-600 dark:text-green-400">
              ✅ Message sent successfully! We'll get back to you soon.
            </p>
          )}
        </motion.form>
      </Container>
    </section>
  );
}