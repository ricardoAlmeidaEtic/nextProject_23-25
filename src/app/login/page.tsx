'use client';

import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function LoginPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams ? searchParams.get('error') : null;

  // Redirect to homepage if the user is already logged in
  useEffect(() => {
    if (session) {
      router.push('/homepage');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-900/90 via-wine-900/50 to-wine-950 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-4">
          Sign in to access your account
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded text-sm">
            Authentication failed. Please try again.
          </div>
        )}
        <button
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all"
        >
          Sign in with Google
        </button>
        <p className="text-gray-500 text-sm text-center mt-6">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;