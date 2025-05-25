"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  videoPath: string;
  onPlay: (videoPath: string) => void;
}

interface WatchedInterval {
  start: number;
  end: number;
}

const VideoCard = ({ title, thumbnail, duration, videoPath, onPlay }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watchedIntervals, setWatchedIntervals] = useState<WatchedInterval[]>([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch(`/api/video-progress?videoPath=${encodeURIComponent(videoPath)}`);
        const data = await response.json();
        setProgress(data.progress || 0);
        setWatchedIntervals(data.watchedIntervals || []);
        setTotalDuration(data.totalDuration || 0);
      } catch (error) {
        console.error("Error fetching video progress:", error);
      }
    };

    fetchProgress();

    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail.videoPath === videoPath) {
        setProgress(event.detail.progress);
        setWatchedIntervals(event.detail.watchedIntervals || []);
        setTotalDuration(event.detail.totalDuration || 0);
      }
    };

    window.addEventListener('videoProgressUpdate', handleProgressUpdate as EventListener);
    return () => {
      window.removeEventListener('videoProgressUpdate', handleProgressUpdate as EventListener);
    };
  }, [videoPath, session]);

  // Convert duration string (MM:SS) to seconds
  const durationInSeconds = duration.split(':').reduce((acc, time) => (60 * acc) + parseInt(time), 0);
  const remainingSeconds = Math.round(durationInSeconds * (1 - progress / 100));
  const remainingTime = `${Math.floor(remainingSeconds / 60)}:${(remainingSeconds % 60).toString().padStart(2, '0')}`;

  // Function to render progress segments
  const renderProgressSegments = () => {
    if (!totalDuration || !watchedIntervals.length) return null;

    // Sort intervals by start time
    const sortedIntervals = [...watchedIntervals].sort((a, b) => a.start - b.start);
    
    // Create segments for the progress bar
    const segments = [];
    let lastEnd = 0;

    // Process each watched interval
    for (const interval of sortedIntervals) {
      // Add unwatched segment before this interval if there's a gap
      if (interval.start > lastEnd) {
        segments.push({
          start: lastEnd,
          end: interval.start,
          type: 'unwatched'
        });
      }
      
      // Add the watched segment
      segments.push({
        start: interval.start,
        end: interval.end,
        type: 'watched'
      });
      
      lastEnd = interval.end;
    }

    // Add final unwatched segment if needed
    if (lastEnd < totalDuration) {
      segments.push({
        start: lastEnd,
        end: totalDuration,
        type: 'unwatched'
      });
    }

    return segments.map((segment, index) => (
      <div
        key={index}
        className={`h-full ${segment.type === 'watched' ? 'bg-blue-500' : 'bg-yellow-400'}`}
        style={{
          width: `${((segment.end - segment.start) / totalDuration) * 100}%`,
          position: 'absolute',
          left: `${(segment.start / totalDuration) * 100}%`
        }}
      />
    ));
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(videoPath)}
    >
      <div className="relative aspect-video">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {duration}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          {renderProgressSegments()}
        </div>
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white p-4">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">{title}</div>
              <div className="text-sm">
                <div>Progress: {Math.round(progress)}%</div>
                <div>Remaining: {remainingTime}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
      </div>
    </div>
  );
};

export default VideoCard; 