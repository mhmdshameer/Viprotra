"use client";

import { useState } from "react";
import Image from "next/image";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  videoPath: string;
  onPlay: (videoPath: string) => void;
}

const VideoCard = ({ title, thumbnail, duration, videoPath, onPlay }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
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