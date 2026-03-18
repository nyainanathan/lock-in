import type { Metadata } from 'next';
import '../global.css';
import Link from 'next/link';
import { getAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Lock-in',
  description: 'Deep focus productivity tracker',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  try{
    await getAuth()
  } catch {
    redirect('/login')
  }

  return (
      <div>
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
      </div>
  );
}