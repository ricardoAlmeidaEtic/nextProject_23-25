// lib/db.ts
export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
  audioUrl: string;
  streamCount: number;
  likes: number;
  dislikes: number;
  comments: Comment[];
  type?: 'song' | 'playlist' | 'album' | 'artist';
};

type Comment = {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
};

export const database = {
  tracks: [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      duration: '5:55',
      image: '/queen.jpg',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      streamCount: 25678941,
      likes: 2456789,
      dislikes: 12456,
      comments: [],
      type: 'song'
    },
    {
      id: '2',
      title: 'Hotel California',
      artist: 'Eagles',
      duration: '6:30',
      image: '/eagles.jpg',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      streamCount: 19876543,
      likes: 1876543,
      dislikes: 9876,
      comments: [],
      type: 'song'
    },
    {
      id: '3',
      title: 'Sweet Child O Mine',
      artist: 'Guns N Roses',
      duration: '5:56',
      image: '/guns.jpg',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      streamCount: 18543210,
      likes: 1654321,
      dislikes: 8765,
      comments: [],
      type: 'song'
    },
    {
      id: '8',
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      duration: '5:01',
      image: '/nirvana.jpg',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      streamCount: 22446688,
      likes: 1987654,
      dislikes: 9876,
      comments: [],
      type: 'song'
    },
    {
      id: '9',
      title: 'Rolling in the Deep',
      artist: 'Adele',
      duration: '3:48',
      image: '/adele.jpg',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      streamCount: 33445566,
      likes: 2876543,
      dislikes: 12345,
      comments: [],
      type: 'song'
    },
    {
      id: '10',
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      duration: '4:30',
      image: '/uptown-funk.jpg',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      streamCount: 44556677,
      likes: 3123456,
      dislikes: 15432,
      comments: [],
      type: 'song'
    },
    // Continue pattern for all song IDs
    {
      id: '17',
      title: 'Levitating',
      artist: 'Dua Lipa',
      duration: '3:23',
      image: '/levitating.jpg',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
      streamCount: 11223344,
      likes: 987654,
      dislikes: 5432,
      comments: [],
      type: 'song'
    },
    // Playlist and artist entries (no audio URLs)
    {
      id: '4',
      title: 'Liked Songs',
      artist: 'Various Artists',
      duration: '2h 34m',
      image: '/liked-songs.jpg',
      audioUrl: '',
      streamCount: 0,
      likes: 1234,
      dislikes: 5,
      comments: [],
      type: 'playlist'
    },
    {
      id: '7',
      title: 'The Weeknd',
      artist: 'The Weeknd',
      duration: '',
      image: '/weeknd.jpg',
      audioUrl: '',
      streamCount: 0,
      likes: 987654,
      dislikes: 2345,
      comments: [],
      type: 'artist'
    }
  ] as Track[],

  // Helper methods remain the same
  getSongs: () => database.tracks.filter(track => track.type === 'song'),
  getLibraryItems: () => database.tracks.filter(track => track.type !== 'song'),
  search: (query: string) => database.tracks.filter(track =>
    track.title.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.toLowerCase().includes(query.toLowerCase())
  ),
  updateTrack: (updatedTrack: Track) => {
    const index = database.tracks.findIndex(t => t.id === updatedTrack.id);
    if (index !== -1) database.tracks[index] = updatedTrack;
  },
  addComment: (trackId: string, comment: Comment) => {
    const track = database.tracks.find(t => t.id === trackId);
    if (track) track.comments.push(comment);
  }
};