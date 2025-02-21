'use client';

export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

interface TrackItemProps {
  track: Track;
  onClick: (track: Track) => void;
}

const TrackItem = ({ track, onClick }: TrackItemProps) => {
  // SVG data URL as fallback
  const defaultImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="#334155"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="#94a3b8">
        ${track.artist ? `${track.title} by ${track.artist}` : 'No Image Available'}
      </text>
    </svg>
  `)}`;

  return (
    <div
      onClick={() => onClick(track)}
      className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition cursor-pointer group"
    >
      <div className="relative mb-4">
        <img
          src={track.image || defaultImage}
          alt={`${track.title} by ${track.artist}`}
          className="w-full aspect-square object-cover rounded-lg bg-slate-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 ml-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </button>
      </div>
      <h3 className="font-semibold truncate">{track.title}</h3>
      <p className="text-gray-400 text-sm">{track.artist}</p>
    </div>
  );
};

export default TrackItem;