"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface VideoPlayerProps {
  videoPath: string;
  onClose: () => void;
}

interface WatchedInterval {
  start: number;
  end: number;
}

const VideoPlayer = ({ videoPath, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [currentInterval, setCurrentInterval] = useState<WatchedInterval | null>(null);
  const [watchedIntervals, setWatchedIntervals] = useState<WatchedInterval[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to broadcast progress updates
  const broadcastProgress = (progress: number) => {
    const event = new CustomEvent('videoProgressUpdate', {
      detail: { 
        videoPath, 
        progress,
        watchedIntervals,
        totalDuration: videoRef.current?.duration || 0
      }
    });
    window.dispatchEvent(event);
  };

  // Function to merge overlapping intervals
  const mergeIntervals = (intervals: WatchedInterval[]) => {
    if (intervals.length === 0) return [];
    
    const sorted = [...intervals].sort((a, b) => a.start - b.start);
    const merged: WatchedInterval[] = [];
    let current = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].start <= current.end) {
        current.end = Math.max(current.end, sorted[i].end);
      } else {
        merged.push(current);
        current = sorted[i];
      }
    }
    merged.push(current);
    return merged;
  };

  const saveProgress = async () => {
    if (!videoRef.current || !session?.user || isSaving) return;

    const video = videoRef.current;
    setIsSaving(true);
    try {
      // Merge current interval with existing intervals
      const allIntervals = [...watchedIntervals];
      if (currentInterval) {
        allIntervals.push(currentInterval);
      }
      const mergedIntervals = mergeIntervals(allIntervals);

      const response = await fetch("/api/video-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoPath,
          lastPosition: video.currentTime,
          totalDuration: video.duration,
          watchedIntervals: mergedIntervals,
        }),
      });
      const data = await response.json();
      setWatchedIntervals(mergedIntervals);
      broadcastProgress(data.progress);
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Save progress when closing
  const handleClose = useCallback(async () => {
    if (videoRef.current && currentInterval) {
      currentInterval.end = videoRef.current.currentTime;
      setWatchedIntervals(prev => [...prev, currentInterval]);
      await saveProgress();
    }
    onClose();
  }, [currentInterval, onClose, saveProgress]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  // Track playing state and broadcast progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setCurrentInterval({ start: video.currentTime, end: video.currentTime });
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (currentInterval) {
        currentInterval.end = video.currentTime;
        const allIntervals = [...watchedIntervals, currentInterval];
        const mergedIntervals = mergeIntervals(allIntervals);
        setWatchedIntervals(mergedIntervals);
        setCurrentInterval(null);
        saveProgress();
      }
    };

    const handleTimeUpdate = () => {
      if (isPlaying && currentInterval) {
        currentInterval.end = video.currentTime;
        // Calculate progress based on all intervals including current
        const allIntervals = [...watchedIntervals, currentInterval];
        const mergedIntervals = mergeIntervals(allIntervals);
        const totalWatched = mergedIntervals.reduce((acc, interval) => acc + (interval.end - interval.start), 0);
        const progress = (totalWatched / video.duration) * 100;
        broadcastProgress(progress);
      }
    };

    const handleEnded = () => {
      if (currentInterval) {
        currentInterval.end = video.duration;
        const allIntervals = [...watchedIntervals, currentInterval];
        const mergedIntervals = mergeIntervals(allIntervals);
        setWatchedIntervals(mergedIntervals);
        setCurrentInterval(null);
        saveProgress();
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoRef.current, isPlaying, currentInterval, watchedIntervals, saveProgress, broadcastProgress]);

  // Save progress periodically
  useEffect(() => {
    if (!videoRef.current) return;
    const interval = setInterval(() => {
      if (isPlaying) {
        saveProgress();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [videoRef.current, isPlaying, saveProgress]);

  // Load last position and watched intervals
  useEffect(() => {
    const loadProgress = async () => {
      if (!session?.user) return;
      try {
        const response = await fetch(`/api/video-progress?videoPath=${encodeURIComponent(videoPath)}`);
        const data = await response.json();
        if (data.lastPosition && videoRef.current) {
          videoRef.current.currentTime = data.lastPosition;
        }
        if (data.watchedIntervals) {
          setWatchedIntervals(data.watchedIntervals);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    };

    loadProgress();
  }, [videoPath, session]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-6xl mx-4">
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <video
          ref={videoRef}
          src={videoPath}
          className="w-full aspect-video"
          controls
          autoPlay
        />
      </div>
    </div>
  );
};

export default VideoPlayer; 