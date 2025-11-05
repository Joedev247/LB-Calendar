'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../../lib/context';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check for error in query params
        const errorParam = searchParams.get('error');
        if (errorParam) {
          setError(errorParam || 'OAuth authorization was denied or failed');
          setLoading(false);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        // Get token and email from query params
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token) {
          setError('No authentication token received. Please try again.');
          setLoading(false);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        if (!email) {
          setError('No email received. Please try again.');
          setLoading(false);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        // Handle the OAuth callback
        await handleOAuthCallback(token, email);

        // Redirect to dashboard after successful login
        router.push('/dashboard');
      } catch (err: any) {
        const message = err.response?.data?.error || err.message || 'Failed to complete OAuth login';
        setError(message);
        setLoading(false);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.08)_0%,transparent_70%)]">
      <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl p-10 max-w-md w-full mx-4 shadow-2xl">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4C8E] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#5D4C8E] mb-2">Completing Login...</h2>
            <p className="text-gray-600">Please wait while we authenticate you.</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Failed</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-[#5D4C8E] mb-2">Login Successful!</h2>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.08)_0%,transparent_70%)]">
        <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-2xl p-10 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D4C8E] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#5D4C8E] mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}



