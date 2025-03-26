'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Drawer = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession(); // Get session data

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    const encodedQuery = encodeURIComponent(query);
    router.push(`/homepage?q=${encodedQuery}`);
    setShowSearch(false);
    setSearchQuery("");
  };

  return (
    <div className="drawer-side z-50">
      <label htmlFor="main-drawer" className="drawer-overlay"></label>
      <div className="w-64 h-full p-6 flex flex-col gap-6 border-r border-wine-600 bg-wine-900 text-ivory-100">
        {/* Close button for mobile */}
        <label htmlFor="main-drawer" className="lg:hidden btn btn-ghost btn-circle absolute right-2 top-2 text-ivory-100 hover:bg-wine-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </label>

        {/* Logo */}
        <div className="text-2xl font-bold text-ivory-100">
          <Link href={'/homepage'}>Groupie</Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-4 flex-1">
          <Link href="/homepage" className="flex items-center gap-3 text-wine-200 hover:text-ivory-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          <div className="relative">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-3 text-wine-200 hover:text-ivory-100 transition w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>

            {showSearch && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Search songs, artists..."
                  className="w-full px-4 py-2 rounded-lg bg-wine-800 text-ivory-100 placeholder-wine-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            )}
          </div>

          <Link href="/library" className="flex items-center gap-3 text-wine-200 hover:text-ivory-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            Your Library
          </Link>

          <Link href="/profile" className="flex items-center gap-3 text-wine-200 hover:text-ivory-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>

          {/* Logout Button */}
          {session && (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 text-wine-200 hover:text-ivory-100 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              Logout
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Drawer;