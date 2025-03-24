'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl mb-4">Login</h1>
      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded">
          Authentication failed. Please try again.
        </div>
      )}
      <button
        onClick={() => signIn('google')}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default LoginPage;