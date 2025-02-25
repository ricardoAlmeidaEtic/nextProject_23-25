'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Added Image import

type LibraryItem = {
  id: string;
  title: string;
  artist: string;
  type: 'playlist' | 'album' | 'artist';
  image: string;
  duration?: string;
};

const Library = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'playlists' | 'albums' | 'artists'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const libraryItems: LibraryItem[] = [
    // Sample data - replace with your actual data
    { id: '1', title: 'Liked Songs', artist: 'Various Artists', type: 'playlist', image: '/liked-songs.jpg' },
    { id: '2', title: 'Summer Hits', artist: 'Spotify', type: 'playlist', image: '/summer-hits.jpg' },
    { id: '3', title: 'Dark Side of the Moon', artist: 'Pink Floyd', type: 'album', image: '/dark-side.jpg' },
    { id: '4', title: 'The Weeknd', artist: 'The Weeknd', type: 'artist', image: '/weeknd.jpg' },
    // Add more items as needed
  ];

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter.slice(0, -1);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Your Library</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search in library..."
            className="px-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="flex gap-2">
            {(['all', 'playlists', 'albums', 'artists'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full transition ${
                  activeFilter === filter
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
            className="group relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
          >
            <div className="relative aspect-square mb-4">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover rounded-lg shadow-xl group-hover:shadow-2xl transition-all"
              />
            </div>

            <h3 className="font-semibold truncate">{item.title}</h3>
            <p className="text-sm text-gray-400 truncate">
              {item.type === 'artist' ? 'Artist' : `${item.artist} • ${item.type}`}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <svg
            className="w-24 h-24 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl">Nothing found</p>
        </div>
      )}
    </div>
  );
};

export default Library;