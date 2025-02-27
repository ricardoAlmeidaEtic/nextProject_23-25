"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Track, Comment } from '../../app/types';
import { motion } from 'framer-motion';
import AudioSlider from "./Controls/AudioSlider";
import ProgressSlider from './Controls/ProgressSlider'
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";


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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-wine-900 rounded-2xl p-8 w-full max-w-7xl shadow-2xl relative h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-300 hover:text-white transition-transform hover:scale-110 p-2"
          aria-label="Close player"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex gap-8 flex-1 overflow-hidden">
          {/* Left Column - Media and Controls */}
          <div className="flex-1 flex flex-col min-w-[65%]">
            <div className="relative mb-6 rounded-xl overflow-hidden bg-black/25 flex-1">
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

            <div className="text-center mb-6 px-4">
              <h2 className="text-3xl font-bold mb-2 truncate">{track.title}</h2>
              <p className="text-gray-300 text-lg">{track.artist}</p>
            </div>

            {/* Stream Count and Reactions */}
            <div className="flex justify-between items-center mb-6 px-4">
              <span className="text-gray-400 text-sm font-medium">
                <span className="text-green-400">{track.streamCount}</span> streams
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group">
                  <button 
                    onClick={handleLike}
                    className="flex items-center gap-1 hover:text-green-400 transition-colors"
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
                    onClick={handleDislike}
                    className="flex items-center gap-1 hover:text-red-400 transition-colors"
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
            <div className="mb-6 px-4">
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
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={onPrevious}
                className="text-gray-300 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                aria-label="Previous track"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handlePlayPause}
                className="bg-green-400 text-white rounded-full p-5 hover:bg-green-300 transition-all 
                  shadow-lg hover:shadow-green-400/30 active:scale-95 relative"
              >
                <div className={`absolute inset-0 rounded-full bg-current animate-ping opacity-0 ${isPlaying ? 'opacity-20' : ''}`} />
                {isPlaying ? (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3.868v16.264c0 .869.971 1.407 1.694.928l13.236-8.132a1.08 1.08 0 000-1.856L6.694 3.04C5.971 2.56 5 3 5 3.868z" />
                  </svg>
                )}
              </button>

              <button
                onClick={onNext}
                className="text-gray-300 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                aria-label="Next track"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="px-4 mb-6">
              <div className="flex items-center gap-4 text-gray-300">
                <VolumeDownIcon />
                <AudioSlider
                  leftIcon={null}
                  rightIcon={null}
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
          <div className="w-96 flex flex-col h-full border-l border-white/10 pl-8">
            <h3 className="text-xl font-bold mb-4 text-gray-100">Comments ({track.comments?.length || 0})</h3>
            <div ref={commentsContainerRef} className="flex-1 overflow-y-auto pr-3 mb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {track.comments?.map((comment) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-wine-800 p-4 rounded-xl shadow-sm hover:bg-wine-700/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-gray-100">{comment.author}</span>
                    <span className="text-gray-400 text-xs">
                      {new Date(comment.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                </motion.div>
              ))}
              <div ref={commentsEndRef} />
            </div>
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-auto pr-3">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-3 rounded-lg bg-wine-800 text-white border border-wine-700 
                  focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 
                  transition-all placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-green-400 text-white px-5 py-3 rounded-lg hover:bg-green-300 
                  transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Post</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;