'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Send } from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const inputClassName =
  'w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-violet-300/60 focus:bg-white/15';

export default function MeetingRoomContactCard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error ?? 'Unable to send your message.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to send your message.'
      );
    }
  };

  return (
    <aside
      className="pointer-events-none absolute inset-x-0 bottom-0 left-0 top-20 z-20 flex w-full max-w-md items-start p-4 sm:top-24 sm:p-6 md:p-8"
      aria-label="Contact the AWEBO team"
    >
      <div className="pointer-events-auto max-h-full w-full overflow-y-auto rounded-2xl border border-white/15 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-200/90">
          Meeting Room
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Contact AWEBO
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Questions about partnerships, the platform, or your brand? Send us a
          note and the team will get back to you.
        </p>

        {status === 'success' ? (
          <div
            className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-5"
            role="status"
          >
            <p className="text-sm font-medium text-emerald-100">
              Message sent — thank you.
            </p>
            <p className="mt-1 text-sm text-emerald-100/80">
              We&apos;ll reply to your email as soon as we can.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-4 text-sm font-medium text-white underline-offset-4 hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="contact-name" className="sr-only">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
                disabled={status === 'submitting'}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="sr-only">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                disabled={status === 'submitting'}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className="sr-only">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject (optional)"
                disabled={status === 'submitting'}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="sr-only">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="How can we help?"
                rows={5}
                required
                disabled={status === 'submitting'}
                className={`${inputClassName} resize-none`}
              />
            </div>

            {status === 'error' && errorMessage ? (
              <p className="text-sm text-red-300" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#6e5dcb] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5e4db8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
