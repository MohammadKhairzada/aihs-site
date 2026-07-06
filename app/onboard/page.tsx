'use client';

import { useState } from 'react';

export default function MobileOnboardingPortal() {
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [googleUrl, setGoogleUrl] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up slug text inputs (e.g., "Tony's Pizza" becomes "tonys-pizza")
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    const existingData = localStorage.getItem('aihs_client_db');
    let currentDb: Record<string, any> = {};
    if (existingData) {
      try { currentDb = JSON.parse(existingData); } catch (err) {}
    }

    // Insert new business into memory database records
    currentDb[cleanSlug] = { name, googleUrl, ownerEmail };
    localStorage.setItem('aihs_client_db', JSON.stringify(currentDb));

    setStatus(`Success! Live path created at: ://aihstechnologies.com{cleanSlug}`);
    
    // Clear the form fields
    setSlug(''); setName(''); setGoogleUrl(''); setOwnerEmail('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6 font-sans text-white">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-xl">
        <h1 className="text-2xl font-bold text-blue-400 mb-1">NFC Onboarding Portal</h1>
        <p className="text-xs text-slate-400 mb-6">Create paid customer paths on the fly directly from your smartphone browser.</p>
        
        <form onSubmit={handleSaveClient} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">URL Tag Slug (No spaces)</label>
            <input required type="text" placeholder="e.g. woodbridge-barber" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Store Brand Name</label>
            <input required type="text" placeholder="e.g. Elite Barber Shop" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Google Maps Review Link</label>
            <input required type="url" placeholder="https://search.google.com/..." value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Manager Feedback Email Address</label>
            <input required type="email" placeholder="manager@email.com" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-xl text-sm transition active:scale-95 shadow-md">Deploy Client Page Instantly</button>
        </form>

        {status && <div className="mt-6 p-4 rounded-xl bg-slate-900 text-xs font-medium text-emerald-400 border border-emerald-950/30 leading-relaxed text-center break-all">{status}</div>}
      </div>
    </div>
  );
}
