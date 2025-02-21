'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TrackItem from "@/components/TrackItem";
import { database } from '@/lib/db';

const Page = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'playlists' | 'albums' | 'artists'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = database.getLibraryItems().filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = activeFilter === 'all' 
      ? true 
      : item.type === activeFilter.slice(0, -1);
    
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
          >
            <TrackItem
              track={{
                ...item,
                artist: item.type === 'artist' ? 'Artist' : `${item.artist} • ${item.type}`,
                duration: item.duration || item.type?.toUpperCase() || ''
              }}
              onClick={() => {/* Add click handler if needed */}}
            />
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

export default Page;