// lib/db.ts
export type Track = {
    id: string;
    title: string;
    artist: string;
    duration: string;
    image: string;
    type?: 'song' | 'playlist' | 'album' | 'artist';
  };
  
  export const database = {
    tracks: [
      {
        id: '1',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        duration: '5:55',
        image: '/queen.jpg',
        type: 'song'
      },
      {
        id: '2',
        title: 'Hotel California',
        artist: 'Eagles',
        duration: '6:30',
        image: '/eagles.jpg',
        type: 'song'
      },
      {
        id: '3',
        title: 'Sweet Child O Mine',
        artist: 'Guns N Roses',
        duration: '5:56',
        image: '/guns.jpg',
        type: 'song'
      },
      {
        id: '4',
        title: 'Liked Songs',
        artist: 'Various Artists',
        duration: '2h 34m',
        image: '/liked-songs.jpg',
        type: 'playlist'
      },
      {
        id: '5',
        title: 'Summer Hits',
        artist: 'Spotify',
        duration: '3h 12m',
        image: '/summer-hits.jpg',
        type: 'playlist'
      },
      {
        id: '6',
        title: 'Dark Side of the Moon',
        artist: 'Pink Floyd',
        duration: '42:56',
        image: '/dark-side.jpg',
        type: 'album'
      },
      {
        id: '7',
        title: 'The Weeknd',
        artist: 'The Weeknd',
        duration: '',
        image: '/weeknd.jpg',
        type: 'artist'
      },
    ] as Track[],
  
    getSongs: () => database.tracks.filter(track => track.type === 'song'),
    getLibraryItems: () => database.tracks.filter(track => track.type !== 'song'),
    search: (query: string) => database.tracks.filter(track =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    )
  };