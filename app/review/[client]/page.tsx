'use client';

import { useState, use } from 'react';

// ONBOARD YOUR PAID SUBSCRIBERS HERE!
// Just copy and paste a row to add infinite local shops for free.
const CLIENT_DATABASE: Record<string, { name: string; googleUrl: string; ownerEmail: string }> = {
  'demo-shop': {
    name: 'Example Local Boutique',
    googleUrl: 'https://google.com',
    ownerEmail: 'owner@example.com',
  },
  'woodbridge-barber': {
    name: 'Elite Barber Shop',
    googleUrl: 'https://google.com',
    ownerEmail: 'barberowner@gmail.com',
  },
};

export default function NFCReviewGate({ params }: { params: Promise<{ client: string }> }) {
  const resolvedParams = use(params);
  const clientSlug = resolvedParams.client;
  const store = CLIENT_DATABASE[clientSlug];

  const [lowRating, setLowRating] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);

  if (!store) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Store configuration missing. Contact AIHS Technologies support.
      </div>
    );
  }

  const handleStarTap = (rating: number) => {
    if (rating >= 4) {
      window.location.href = store.googleUrl;
    } else {
      setLowRating(true);
    }
  };

  const handleNegativeFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Urgent Customer Feedback: ${store.name}`);
    const body = encodeURIComponent(`Message from customer: ${feedback}`);
    window.location.href = `mailto:${store.ownerEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 font-sans text-white">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl">
        <h2 className="text-2xl font-bold tracking-tight mb-2">How was your visit?</h2>
        <p className="text-slate-400 text-sm mb-8">Your review helps {store.name} serve you better.</p>

        {!lowRating && !sent && (
          <div className="flex justify-center gap-3 text-4xl mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarTap(star)}
                className="text-amber-400 hover:scale-125 transition active:scale-95 duration-100"
              >
                ★
              </button>
            ))}
          </div>
        )}

        {lowRating && !sent && (
          <form onSubmit={handleNegativeFeedback} className="text-left">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              How can we make this right?
            </label>
            <textarea
              required
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none text-sm mb-4"
              placeholder="Please share your experience directly with management..."
            />
            <button 
              type="submit" 
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 transition text-sm"
            >
              Submit Private Feedback
            </button>
          </form>
        )}

        {sent && (
          <p className="text-emerald-400 font-medium text-sm">
            Thank you. Your message has been routed directly to management.
          </p>
        )}
      </div>
    </div>
  );
}
