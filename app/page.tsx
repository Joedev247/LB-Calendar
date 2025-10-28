'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../lib/context';

export default function Home() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5f4b8b] to-[#4a3a6e]">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Loading LB Calendar...</p>
      </div>
    </div>
  );
}
