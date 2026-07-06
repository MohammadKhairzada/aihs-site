import './globals.css';

export const metadata = {
  title: 'AIHS Technologies | Premium Tech & Automation',
  description: 'Custom digital tools, automations, and NFC marketing solutions for local businesses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
