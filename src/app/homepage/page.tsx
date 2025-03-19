'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MusicPlayer from "@/components/MusicPlayer/MusicPlayer";
import TrackItem from "@/components/TrackItem/TrackItem";
import { Track } from '../types'; // Adjust import path as needed
import { database } from '@/lib/db';

const HomepageContent = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeGreeting, setTimeGreeting] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setTracks(database.getSongs());
  }, []);

  useEffect(() => {
    const savedTracks = localStorage.getItem('tracks');
    if (savedTracks) {
      setTracks(JSON.parse(savedTracks));
    } else {
      setTracks(database.getSongs());
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('tracks', JSON.stringify(tracks));
  }, [tracks]);
  
  // Get time-based greeting
  useEffect(() => {
    const getTimeGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 5) return 'Good Night 🌤️';
      if (hour < 12) return 'Good Morning ☀️';
      if (hour < 18) return 'Good Afternoon 🌙';
      return 'Good Evening 🌌';
    };

    setTimeGreeting(getTimeGreeting());
  }, []);
  
  const urlQuery = searchParams.get('q') || '';
  const filteredTracks = urlQuery ? database.search(urlQuery).filter(t => t.type === 'song') : database.getSongs();

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const query = searchQuery.trim();
      const encodedQuery = encodeURIComponent(query);
      router.push(`/homepage?q=${encodedQuery}`);
    }
  };

  useEffect(() => {
    setSearchQuery(decodeURIComponent(urlQuery));
  }, [urlQuery]);

  const handleUpdateTrack = (updatedTrack: Track) => {
    // Update both database and local state
    database.updateTrack(updatedTrack);
    setTracks(prev => prev.map(t => t.id === updatedTrack.id ? updatedTrack : t));
    setSelectedTrack(prev => prev?.id === updatedTrack.id ? updatedTrack : prev);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {timeGreeting}{' '}
              <span className="inline-block animate-wiggle">
                {timeGreeting === 'Good Morning' && '🌤️'}
                {timeGreeting === 'Good Afternoon' && '☀️'}
                {timeGreeting === 'Good Evening' && '🌙'}
                {timeGreeting === 'Good Night' && '🌌'}
              </span>
            </h1>
            <p className="text-gray-400">Recent plays</p>
          </div>
          <input
            type="text"
            placeholder="Search songs, artists..."
            className="px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </header>

        {/* Tracks Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTracks.map((track) => (
            <TrackItem
              key={track.id}
              track={track}
              onClick={(t) => setSelectedTrack(t)}
            />
          ))}
        </div>
      </div>

      {/* Music Player */}
      {selectedTrack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800/95 rounded-xl p-8 w-full max-w-2xl mx-4 shadow-xl">
          <MusicPlayer
            track={selectedTrack}
            onClose={() => setSelectedTrack(null)}
            onUpdateTrack={handleUpdateTrack}
            // Add onNext/onPrevious if needed
          />
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white p-8">Loading...</div>}>
    <HomepageContent />
  </Suspense>
);

export default Page;


