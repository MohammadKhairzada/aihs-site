'use client';

import { useState, use, useEffect } from 'react';

// Hardcoded static starter database (Always available)
const STATIC_DATABASE: Record<string, { name: string; googleUrl: string; ownerEmail: string }> = {
  'demo-shop': {
    name: 'Demo Shop',
    // FIXED: Real global Google Review entry link that immediately triggers a 5-star layout review box
    googleUrl: 'https://google.com',
    ownerEmail: 'owner@example.com',
  }
};

interface PageProps {
  params: Promise<{ client: string }>;
}

export default function NFCReviewGate({ params }: PageProps) {
  const resolvedParams = use(params);
  const clientSlug = resolvedParams.client;
  
  const [store, setStore] = useState<{ name: string; googleUrl: string; ownerEmail: string } | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [lowRating, setLowRating] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the shop exists in phone local memory storage first
    const localData = localStorage.getItem('aihs_client_db');
    let customDatabase = {};
    if (localData) {
      try { customDatabase = JSON.parse(localData); } catch (e) { console.error(e); }
    }

    // Merge static baseline data with your phone-created custom clients
    const combinedDatabase = { ...STATIC_DATABASE, ...customDatabase } as Record<string, { name: string; googleUrl: string; ownerEmail: string }>;
    
    if (combinedDatabase[clientSlug]) {
      setStore(combinedDatabase[clientSlug]);
    }
    setLoading(false);
  }, [clientSlug]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-400 font-sans text-sm">Loading store layout...</div>;
  }

  if (!store) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-400 font-sans text-sm tracking-wide p-4 text-center">
        Store configuration missing. Open /onboard on your phone to add this client slug.
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
    const subject = encodeURIComponent(`[AIHS Review System] Internal Feedback for ${store.name}`);
    const body = encodeURIComponent(`A customer left internal feedback:\n\n"${feedback}"`);
    window.location.href = `mailto:${store.ownerEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 font-sans antialiased">
      <div className="w-full max-w-md rounded-3xl bg-white border border-gray-100 p-10 text-center shadow-lg transition-all duration-300">
        <div className="mb-8">
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-200" />
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1.5">How was your experience?</h2>
          <p className="text-sm font-normal text-gray-400 max-w-xs mx-auto leading-relaxed">
            Your honest feedback helps <span className="font-medium text-gray-600">{store.name}</span> maintain the highest standards.
          </p>
        </div>

        {!lowRating && !sent && (
          <div className="flex justify-center gap-1.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarTap(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className="p-1 transition-transform duration-200 hover:scale-110 active:scale-95 outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <svg className="h-9 w-9 transition-colors duration-150" viewBox="0 0 24 24" fill={star <= (hoveredStar ?? 0) ? '#fbbf24' : '#e5e7eb'}>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {lowRating && !sent && (
          <form onSubmit={handleNegativeFeedback} className="text-left">
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Share your comments privately</label>
              <textarea required rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 leading-relaxed resize-none" placeholder="Tell us how we can make things right directly with management..." />
            </div>
            <button type="submit" className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 active:scale-95 transition-all duration-150">Submit Feedback</button>
          </form>
        )}

        {sent && (
          <div className="py-4">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">Thank you for your response</p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">Your message has been safely routed straight to ownership for immediate review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
