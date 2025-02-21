'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MusicPlayer from "@/components/MusicPlayer";
import TrackItem from "@/components/TrackItem";
import { database } from '@/lib/db';

const Page = () => {
  const [selectedTrack, setSelectedTrack] = useState<typeof database.tracks[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Good Morning</h1>
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
              onClick={setSelectedTrack}
            />
          ))}
        </div>
      </div>

      {/* Music Player */}
      {selectedTrack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800/95 rounded-xl p-8 w-full max-w-2xl mx-4 shadow-xl">
            <MusicPlayer
              trackName={selectedTrack.title}
              artistName={selectedTrack.artist}
              onClose={() => setSelectedTrack(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;