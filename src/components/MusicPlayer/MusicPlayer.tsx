"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Track } from '../../app/types';
import AudioSlider from "./Controls/AudioSlider";
import ProgressSlider from './Controls/ProgressSlider'
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import CommentsSection from "./Comments";
import { useSession } from "next-auth/react";


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
  const [hasLiked, setHasLiked] = useState(false); // Track if the user has liked
  const [hasDisliked, setHasDisliked] = useState(false); // Track if the user has disliked
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const totalVotes = track.likes + track.dislikes;
  const likePercentage = totalVotes > 0 ? (track.likes / totalVotes) * 100 : 0;
  const dislikePercentage = totalVotes > 0 ? (track.dislikes / totalVotes) * 100 : 0;
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(100); // New volume state
  const { data: session } = useSession(); // Access session data
  
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

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }
  
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const updateTrackStats = (update: Partial<Track>) => {
    onUpdateTrack({ ...track, ...update });
  };

  const toggleReaction = async (type: "like" | "dislike") => {
    try {
      const isRemoving = type === "like" ? hasLiked : hasDisliked;
      const action = isRemoving ? `remove${type.charAt(0).toUpperCase() + type.slice(1)}` : type;
  
      const response = await fetch(`/api/music/${track.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to ${action} the track`);
      }
  
      const updatedTrack = await response.json();
  
      // Preserve the existing streamCount and other fields
      onUpdateTrack({
        ...track,
        ...updatedTrack, // Merge updated fields from the API
        streamCount: track.streamCount, // Explicitly preserve streamCount
      });
  
      // Update the local state for likes/dislikes
      if (type === "like") {
        setHasLiked(!hasLiked);
        if (hasDisliked) setHasDisliked(false); // Remove dislike if it exists
      } else {
        setHasDisliked(!hasDisliked);
        if (hasLiked) setHasLiked(false); // Remove like if it exists
      }
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!newCommentText.trim()) return;
  
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: track.id, // Pass the track ID
          author: session?.user?.name || "Anonymous", // Use session name or fallback to "Anonymous"
          text: newCommentText.trim(),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
  
      const newComment = await response.json();
  
      // Update the comments list
      onUpdateTrack({
        ...track,
        comments: [...track.comments, newComment],
      });
  
      // Clear the input field
      setNewCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    const playMedia = async () => {
      try {
        if (audioRef.current && videoRef.current) {
          await audioRef.current.play();
          await videoRef.current.play();
          setIsPlaying(true);
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

  const VolumeDownIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m3.5-15.747l4.5 4.5m0-4.5l-4.5 4.5" />
    </svg>
  );
  
  const VolumeUpIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m3.5-15.747l4.5 4.5m0-4.5l-4.5 4.5" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4">
      {/* Close Button - Now outside the main modal container */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-8 sm:right-8 text-gray-300 hover:text-white transition-transform hover:scale-110 p-2 z-50"
        aria-label="Close player"
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
  
      <div className="bg-wine-900 rounded-2xl p-4 sm:p-8 w-full max-w-7xl shadow-2xl relative h-[90vh] max-h-[800px] flex flex-col">
        {/* Rest of the modal content remains the same */}
        <div className="flex gap-4 sm:gap-8 flex-1 overflow-auto flex-col md:flex-row">
          {/* Left Column - Media and Controls */}
          <div className="flex-1 flex flex-col min-w-0 md:min-w-[65%]">
            <div className="relative mb-4 sm:mb-6 rounded-xl overflow-hidden bg-black/25 flex-1 max-h-[50vh] md:max-h-none">
              <video
                ref={videoRef}
                className="w-full h-full object-contain transform transition-transform hover:scale-105"
                loop
                muted={!isPlaying}
                playsInline
              >
                <source src="https://i.gifer.com/5RT9.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
  
            <div className="text-center mb-4 sm:mb-6 px-2 sm:px-4">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 truncate">{track.title}</h2>
              <p className="text-gray-300 text-sm sm:text-lg">{track.artist}</p>
            </div>
  
            {/* Stream Count and Reactions */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 px-2 sm:px-4">
              <span className="text-gray-400 text-xs sm:text-sm font-medium">
                <span className="text-green-400">{track.streamCount}</span> streams
              </span>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 group">
                  <button
                    className={`flex items-center gap-1 ${
                      hasLiked ? "text-green-400" : "hover:text-green-400"
                    } transition-colors`}
                    onClick={() => toggleReaction("like")}
                  >
                    <AiOutlineLike />
                    <span className="font-medium">{track.likes}</span>
                  </button>
                  <div className="h-1 w-12 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-400 transition-all duration-500"
                      style={{ width: `${likePercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 group">
                  <button
                      className={`flex items-center gap-1 ${
                        hasDisliked ? "text-red-400" : "hover:text-red-400"
                      } transition-colors`}
                      onClick={() => toggleReaction("dislike")}
                  >
                    <AiOutlineDislike />
                    <span className="font-medium">{track.dislikes}</span>
                  </button>
                  <div className="h-1 w-12 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-400 transition-all duration-500"
                      style={{ width: `${dislikePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6 px-2 sm:px-4">
              <ProgressSlider
                value={progress}
                onChange={(newProgress) => {
                  if (!audioRef.current) return;
                  const newTime = (newProgress / 100) * audioRef.current.duration;
                  audioRef.current.currentTime = newTime;
                  if (videoRef.current) {
                    videoRef.current.currentTime = newTime;
                  }
                }}
                className="h-2"
              />
              <div className="flex justify-between text-sm text-gray-300 mt-2 font-medium">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-6">
              <button
                onClick={onPrevious}
                className="text-gray-300 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                aria-label="Previous track"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handlePlayPause}
                className="bg-green-400 text-white rounded-full p-5 hover:bg-green-300 transition-all 
                  shadow-lg hover:shadow-green-400/30 active:scale-95 relative mx-4 sm:mx-8"
              >
                <div className={`absolute inset-0 rounded-full bg-current animate-ping opacity-0 ${isPlaying ? 'opacity-20' : ''}`} />
                {isPlaying ? (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3.868v16.264c0 .869.971 1.407 1.694.928l13.236-8.132a1.08 1.08 0 000-1.856L6.694 3.04C5.971 2.56 5 3 5 3.868z" />
                  </svg>
                )}
              </button>

              <button
                onClick={onNext}
                className="text-gray-300 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                aria-label="Next track"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="px-2 sm:px-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-4 text-gray-300">
                <VolumeDownIcon />
                <AudioSlider
                  value={volume}
                  onChange={(newVolume) => setVolume(newVolume)}
                  startingValue={0}
                  maxValue={100}
                  isStepped
                  stepSize={1}
                  className="flex-1 py-2"
                />
                <VolumeUpIcon />
              </div>
            </div>

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
          <CommentsSection
            comments={track.comments || []}
            newCommentText={newCommentText}
            onCommentSubmit={handleCommentSubmit}
            onCommentTextChange={setNewCommentText}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;