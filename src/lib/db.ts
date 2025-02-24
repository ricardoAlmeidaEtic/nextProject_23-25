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
    // Existing tracks
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
    // New songs
    {
      id: '8',
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      duration: '5:01',
      image: '/nirvana.jpg',
      type: 'song'
    },
    {
      id: '9',
      title: 'Rolling in the Deep',
      artist: 'Adele',
      duration: '3:48',
      image: '/adele.jpg',
      type: 'song'
    },
    {
      id: '10',
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      duration: '4:30',
      image: '/uptown-funk.jpg',
      type: 'song'
    },
    {
      id: '11',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      duration: '3:53',
      image: '/shape-of-you.jpg',
      type: 'song'
    },
    {
      id: '12',
      title: 'Bad Guy',
      artist: 'Billie Eilish',
      duration: '3:14',
      image: '/bad-guy.jpg',
      type: 'song'
    },
    {
      id: '13',
      title: 'Despacito',
      artist: 'Luis Fonsi',
      duration: '3:47',
      image: '/despacito.jpg',
      type: 'song'
    },
    {
      id: '14',
      title: 'Old Town Road',
      artist: 'Lil Nas X',
      duration: '2:37',
      image: '/old-town-road.jpg',
      type: 'song'
    },
    {
      id: '15',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      duration: '3:20',
      image: '/blinding-lights.jpg',
      type: 'song'
    },
    {
      id: '16',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      duration: '2:54',
      image: '/watermelon-sugar.jpg',
      type: 'song'
    },
    {
      id: '17',
      title: 'Levitating',
      artist: 'Dua Lipa',
      duration: '3:23',
      image: '/levitating.jpg',
      type: 'song'
    },
    // Existing library items
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