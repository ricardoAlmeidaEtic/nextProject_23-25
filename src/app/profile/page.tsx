'use client';

import { Suspense } from 'react';
import TrackItem, { Track } from '../../components/TrackItem'; // Adjust import path as needed

interface Profile {
  name: string;
  followers: number;
  following: number;
  playlists: Playlist[];
}

interface Playlist {
  id: number;
  title: string;
  artist: string;
  tracks: number;
  duration: string;
  image: string;
  year?: number;
}

const ProfilePage = ({ profile }: { profile: Profile }) => {
  const handleTrackClick = (track: Track) => {
    // Handle track click logic here
    console.log('Playing track:', track);
  };

  // Convert Playlist to Track format
  const playlistsAsTracks: Track[] = profile.playlists.map(playlist => ({
    id: String(playlist.id),
    title: playlist.title,
    artist: playlist.artist,
    duration: playlist.duration,
    image: playlist.image,
  }));

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  const profileFallbackImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="#181818"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="80" fill="#b3b3b3">
        ${getInitials(profile.name)}
      </text>
    </svg>
  `)}`;

  return (
    <div className="bg-spotify-black h-screen text-white overflow-y-auto">
      {/* Header Section (unchanged) */}
      <header className="relative h-60 bg-gradient-to-b from-spotify-green to-spotify-black">
        <div className="absolute bottom-6 left-6 flex items-end gap-6">
          <img 
            src={profileFallbackImage} 
            alt="Fallback" 
            className="w-[35%] rounded-full shadow-2xl border-2 border-black"
          />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{profile.name}</h1>
            <div className="flex gap-4 text-gray-400">
              <span>{profile.followers.toLocaleString()} followers</span>
              <span>{profile.following.toLocaleString()} following</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation (unchanged) */}
      <nav className="bg-spotify-black/90 sticky top-0 z-10 px-6 py-4 border-b border-spotify-gray">
        <div className="flex gap-6 overflow-x-auto">
          <button className="text-white font-semibold whitespace-nowrap">Overview</button>
          <button className="text-spotify-light-gray hover:text-white whitespace-nowrap">Playlists</button>
          <button className="text-spotify-light-gray hover:text-white whitespace-nowrap">Albums</button>
          <button className="text-spotify-light-gray hover:text-white whitespace-nowrap">Artists</button>
          <button className="text-spotify-light-gray hover:text-white whitespace-nowrap">Podcasts</button>
        </div>
      </nav>

      {/* Updated Content Section using TrackItem */}
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6">Public Playlists</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlistsAsTracks.map((track) => (
            <TrackItem
              key={track.id}
              track={track}
              onClick={handleTrackClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

// Page component remains unchanged
const Page = () => {
  const profile: Profile = {
    name: 'John Doe',
    followers: 1234,
    following: 567,
    playlists: [
      {
        id: 1,
        title: 'My Playlist',
        artist: 'Various Artists',
        tracks: 20,
        duration: '1h 30m',
        image: '/playlist-pic.jpg',
        year: 2021,
      },
    ],
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white p-8">Loading...</div>}>
      <ProfilePage profile={profile} />
    </Suspense>
  );
};

export default Page;