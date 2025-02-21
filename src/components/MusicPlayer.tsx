"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface MusicPlayerProps {
  trackName: string;
  artistName: string;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  trackName, 
  artistName, 
  onClose, 
  onNext,
  onPrevious
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800/95 rounded-xl p-8 w-full max-w-2xl shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Close player"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Artwork */}
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

        {/* Track Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{trackName}</h2>
          <p className="text-gray-400">{artistName}</p>
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
        <div className="flex items-center justify-center gap-4">
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

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(formatTime(audioRef.current.duration));
            }
          }}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;