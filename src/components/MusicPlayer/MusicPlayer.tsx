"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Track, Comment } from '../../app/types';
import ElasticSlider from "./Controls/ElasticSlider";

interface MusicPlayerProps {
  track: Track;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onUpdateTrack: (updatedTrack: Track) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  track,
  onClose, 
  onNext,
  onPrevious,
  onUpdateTrack
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [newCommentText, setNewCommentText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const totalVotes = track.likes + track.dislikes;
  const likePercentage = totalVotes > 0 ? (track.likes / totalVotes) * 100 : 0;
  const dislikePercentage = totalVotes > 0 ? (track.dislikes / totalVotes) * 100 : 0;
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(100); // New volume state
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [track.comments]);

  const updateTrackStats = (update: Partial<Track>) => {
    onUpdateTrack({ ...track, ...update });
  };

  const handleLike = () => {
    updateTrackStats({ likes: track.likes + 1 });
  };

  const handleDislike = () => {
    updateTrackStats({ dislikes: track.dislikes + 1 });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: newCommentText.trim(),
        author: "Anonymous",
        timestamp: new Date()
      };
      updateTrackStats({ comments: [...track.comments, newComment] });
      setNewCommentText("");
    }
  };

  useEffect(() => {
    const playMedia = async () => {
      try {
        if (audioRef.current && videoRef.current) {
          await audioRef.current.play();
          await videoRef.current.play();
          setIsPlaying(true);
          
          // Use functional update to ensure fresh state
          updateTrackStats({ streamCount: track.streamCount + 1 });
        }
      } catch (error) {
        console.error('Autoplay failed:', error);
      }
    };
    
    playMedia();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width);
    const newTime = percentage * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const updateTime = useCallback(() => {
    if (!audioRef.current) return;
    
    setCurrentTime(formatTime(audioRef.current.currentTime));
    setDuration(formatTime(audioRef.current.duration));
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, [updateTime]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => {
      const newState = !prev;
      
      if (audioRef.current) {
        if (newState) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
      if (videoRef.current) {
        if (newState) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
      
      return newState;
    });
  };

  return (
    <div className="fixed inset-0 bg-wine-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-wine-900 rounded-xl p-8 w-full max-w-4xl shadow-xl relative h-[95vh] flex">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Close player"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex gap-8 flex-1 overflow-hidden">
          {/* Left Column - Media and Controls */}
          <div className="flex-1">
            <div className="relative aspect-square mb-6 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted={!isPlaying}
                playsInline
              >
                <source src="https://i.gifer.com/5RT9.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">{track.title}</h2>
              <p className="text-gray-400">{track.artist}</p>
            </div>

            {/* Stream Count and Reactions */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-sm">Streams: {track.streamCount}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleLike}
                    className="flex items-center gap-1 hover:text-green-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>{track.likes}</span>
                  </button>
                  <span className="text-sm text-gray-400">{Math.round(likePercentage)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleDislike}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 13H9M5 14v7a1 1 0 001 1h12"
                      />
                    </svg>
                    <span>{track.dislikes}</span>
                  </button>
                  <span className="text-sm text-gray-400">{Math.round(dislikePercentage)}%</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div 
                ref={progressBarRef}
                className="w-full bg-gray-700 rounded-full h-1.5 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-100 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full absolute -right-1.5 -top-1 shadow-lg" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={onPrevious}
                className="text-gray-400 hover:text-white p-2"
                aria-label="Previous track"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handlePlayPause}
                className="bg-green-500 text-white rounded-full p-4 hover:bg-green-400 transition"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3.868v16.264c0 .869.971 1.407 1.694.928l13.236-8.132a1.08 1.08 0 000-1.856L6.694 3.04C5.971 2.56 5 3 5 3.868z" />
                  </svg>
                )}
              </button>

              <button
                onClick={onNext}
                className="text-gray-400 hover:text-white p-2"
                aria-label="Next track"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <ElasticSlider
              leftIcon={<>...your icon...</>}
              rightIcon={<>...your icon...</>}
              startingValue={volume}
              defaultValue={750}
              maxValue={1000}
              isStepped
              stepSize={10}
            />

            {/* Hidden Audio Element */}
            <audio 
              ref={audioRef} 
              src={track.audioUrl}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setDuration(formatTime(audioRef.current.duration));
                }
              }}
            />
          </div>
            
          {/* Right Column - Comments */}
          <div className="w-50 flex flex-col h-full">
            <h3 className="text-lg font-bold mb-4">Comments ({track.comments?.length || 0})</h3>
            <div ref={commentsContainerRef}className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4">
              {track.comments?.map((comment) => (
                <div key={comment.id} className="bg-wine-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-gray-400 text-xs">
                      {comment.timestamp.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.text}</p>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-auto">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 rounded bg-wine-800 text-white border border-wine-700 focus:outline-none focus:border-green-500"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;