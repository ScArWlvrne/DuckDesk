'use client';

import { useState } from 'react';
import { createResponse } from '../../../lib/api';

export default function NewResponse({ ticketId, onSubmitted }: { ticketId: number; onSubmitted: () => Promise<void> | void; }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = message.trim();
    if (!trimmed) {
      setError('Response message cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      await createResponse({ ticket_id: ticketId, message: trimmed });
      setSuccess('Response submitted.');
      setMessage('');
      await onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-6 py-6">
      <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Add a response</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#007030] focus:outline-none focus:ring-2 focus:ring-[#007030]/20"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Write your response here..."
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#007030] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104735] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit response'}
            </button>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
        </form>
      </div>
    </section>
  );
}
