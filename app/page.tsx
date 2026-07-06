export default function AgencyHomepage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-3xl">
        <span className="px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-950/50 border border-blue-900 rounded-full">
          AIHS Technologies
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          We Build Digital Tools That <span className="text-blue-500">Grow Local Shops</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-400 max-w-xl mx-auto">
          Get premium custom software, business automations, and our high-converting 5-Star NFC Review Tags to dominate your local market.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="mailto:contact@aihstechnologies.com"
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition duration-150"
          >
            Get Custom NFC Tags ($50/mo)
          </a>
        </div>
      </div>
    </main>
  );
}
