'use client';

import { Suspense, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TrackItem from '../../components/TrackItem/TrackItem';
import { Track } from '../types'; // Adjust import path as needed

interface Playlist {
  id: number;
  title: string;
  artist: string;
  tracks: number;
  duration: string;
  image: string;
  year?: number;
}

interface Profile {
  name: string;
  followers: number;
  following: number;
  playlists: Playlist[];
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview'); // State to track the active tab

  if (status === "loading") {
    return <div className="min-h-screen bg-slate-900 text-white p-8">Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  // Extract profile data from the session
  const profile: Profile = {
    name: session.user?.name || "Unknown User",
    followers: 1234, // Replace with actual data if available
    following: 567, // Replace with actual data if available
    playlists: [
      {
        id: 1,
        title: "My Playlist",
        artist: "Various Artists",
        tracks: 20,
        duration: "1h 30m",
        image: "/playlist-pic.jpg",
        year: 2021,
      },
    ],
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Your account has been deleted.");
        router.push("/"); // Redirect to home page
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleTrackClick = (track: Track) => {
    console.log("Playing track:", track);
  };

  const playlistsAsTracks: Track[] = profile.playlists.map((playlist) => ({
    id: String(playlist.id),
    title: playlist.title,
    artist: playlist.artist,
    duration: playlist.duration,
    image: playlist.image,
    audioUrl: "",
    streamCount: 0,
    likes: 0,
    dislikes: 0,
    comments: [],
  }));

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Public Playlists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlistsAsTracks.map((track) => (
                <TrackItem key={track.id} track={track} onClick={handleTrackClick} />
              ))}
            </div>
          </div>
        );
      case 'Playlists':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
            <p className="text-gray-400">This is the Playlists tab content.</p>
          </div>
        );
      case 'Albums':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Albums</h2>
            <p className="text-gray-400">This is the Albums tab content.</p>
          </div>
        );
      case 'Artists':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Artists</h2>
            <p className="text-gray-400">This is the Artists tab content.</p>
          </div>
        );
      case 'Podcasts':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Podcasts</h2>
            <p className="text-gray-400">This is the Podcasts tab content.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-spotify-black h-screen text-white overflow-y-auto">
      {/* Header Section */}
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
              <button onClick={handleDeleteAccount} style={{ color: "red" }}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-spotify-black/90 sticky top-0 z-10 px-6 py-4 border-b border-spotify-gray">
        <div className="flex gap-6 overflow-x-auto">
          {['Overview', 'Playlists', 'Albums', 'Artists', 'Podcasts'].map((tab) => (
            <button
              key={tab}
              className={`${
                activeTab === tab ? 'text-white font-semibold' : 'text-spotify-light-gray hover:text-white'
              } whitespace-nowrap`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Content Section */}
      <main className="p-6">{renderTabContent()}</main>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white p-8">Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
};

export default Page;