import type { Metadata } from 'next';
import '../global.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lock-in',
  description: 'Deep focus productivity tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <body>
        <nav className="flex gap-6 px-8 py-4 bg-white shadow-sm">
          <Link href="/" className="font-semibold text-gray-700 hover:text-gray-900">
            🔒 Dashboard
          </Link>
          <Link href="/projects" className="font-semibold text-gray-700 hover:text-gray-900">
            📁 Projects
          </Link>
          <Link href="/chronos" className="font-semibold text-gray-700 hover:text-gray-900">
            ⏱ History
          </Link>
        </nav>
        {children}
      </body>
  );
}