import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { Send, Mail, User, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Container from '@/shared/components/ui/Container';

const suggestionTypes = ['New Tool', 'Existing Tool Improvement', 'Bug Report', 'Design Feedback', 'Other'];

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [state, handleSubmit] = useForm('xqpzkgnl');

  const resetForm = () => {
    setName('');
    setEmail('');
    setType('');
    setMessage('');
  };

  return (
    <section id="suggest" className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(91,95,239,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.10),_transparent_24%)]" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Suggestion box
          </div>
          <h2 className="text-3xl font-black tracking-[-0.05em] text-foreground md:text-4xl">
            Have an idea for ImageCraft?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Tell us what you would like to see next, improve, or fix in the product.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mt-12 max-w-2xl rounded-[30px] border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(236,239,255,0.92))] p-6 shadow-[0_28px_60px_rgba(91,95,239,0.12)] dark:border-border dark:bg-[linear-gradient(135deg,rgba(17,23,35,0.96),rgba(21,27,38,0.96))] md:p-8"
        >
          {state.succeeded ? (
            <div className="rounded-[24px] border border-success/20 bg-success/5 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Thank you for helping improve ImageCraft.</h3>
              <p className="mt-3 text-base text-muted">Your suggestion has been received.</p>
              <Button type="button" variant="secondary" className="mt-6" onClick={resetForm}>
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="relative">
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      minLength={2}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border bg-surface-elevated py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <ValidationError field="name" prefix="Name" errors={state.errors} className="mt-1 text-xs text-error" />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-border bg-surface-elevated py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                  <ValidationError field="email" prefix="Email" errors={state.errors} className="mt-1 text-xs text-error" />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="type" className="mb-2 block text-sm font-medium text-foreground">
                  Suggestion Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="">Select a type</option>
                  {suggestionTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ValidationError field="type" prefix="Type" errors={state.errors} className="mt-1 text-xs text-error" />
              </div>

              <div className="relative">
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted" />
                  <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    minLength={20}
                    rows={6}
                    placeholder="What would you like ImageCraft to improve or add?"
                    className="w-full resize-none rounded-xl border border-border bg-surface-elevated py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                </div>
                <ValidationError field="message" prefix="Message" errors={state.errors} className="mt-1 text-xs text-error" />
              </div>

              <Button type="submit" disabled={state.submitting} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {state.submitting ? 'Sending...' : 'Send Suggestion'}
              </Button>

              {state.errors && Object.keys(state.errors).length > 0 && (
                <p className="text-sm text-error" role="alert">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          )}
        </motion.form>
      </Container>
    </section>
  );
}