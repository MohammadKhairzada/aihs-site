'use client';

import { useState, use } from 'react';

// ONBOARD YOUR PAID SUBSCRIBERS HERE!
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

  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [lowRating, setLowRating] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sent, setSent] = useState(false);

  if (!store) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-400 font-sans text-sm tracking-wide">
        Configuration missing. Contact support.
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] px-4 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Outer Aesthetic Container */}
      <div className="w-full max-w-[420px] rounded-3xl bg-white border border-gray-100 p-10 text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0,04)] transition-all duration-300">
        
        {/* Minimal Minimalist Header */}
        <div className="mb-8">
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-200" />
          <h2 className="text-[22px] font-semibold tracking-tight text-gray-900 mb-1.5">
            How was your experience?
          </h2>
          <p className="text-sm font-normal text-gray-400 max-w-[280px] mx-auto leading-relaxed">
            Your honest feedback helps <span className="font-medium text-gray-600">{store.name}</span> maintain the highest standards.
          </p>
        </div>

        {/* 1-5 Star Selection Interface */}
        {!lowRating && !sent && (
          <div className="flex justify-center gap-1.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarTap(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className="p-1 transition-all duration-200 hover:scale-115 active:scale-95 outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <svg
                  className={`h-9 w-9 transition-colors duration-150 ${
                    star <= (hoveredStar ?? 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200 fill-gray-200'
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Beautiful Private Feedback Form */}
        {lowRating && !sent && (
          <form onSubmit={handleNegativeFeedback} className="text-left animate-[fadeIn_0.3s_ease-out]">
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                Share your comments privately
              </label>
              <textarea
                required
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all duration-200 leading-relaxed resize-none"
                placeholder="Tell us how we can make things right directly with management..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 active:scale-[0.99] transition-all duration-150"
            >
              Submit Feedback
            </button>
          </form>
        )}

        {/* Minimal Success State */}
        {sent && (
          <div className="py-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">Thank you for your response</p>
            <p className="text-xs text-gray-400 max-w-[240px] mx-auto leading-relaxed">
              Your message has been safely routed straight to ownership for immediate review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
