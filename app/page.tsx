"use client";

import { useState } from "react";
import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";

const videos = [
  {
    id: 1,
    title: "My resume",
    thumbnail: "/thumbnail.jpg", 
    duration: "02:45",
    videoPath: "/videos/resume.mp4"
  },
  {
    id: 2,
    title: "Viprotra",
    thumbnail: "/thumbnail.jpg", 
    duration: "02:17",
    videoPath: "/videos/Viprotra.mp4"
  }
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handlePlayVideo = (videoPath: string) => {
    setSelectedVideo(videoPath);
  };

  return (
    <main className="min-h-screen bg-[#f4f6fa] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1e1e2f] mb-8">Videos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              duration={video.duration}
              videoPath={video.videoPath}
              onPlay={handlePlayVideo}
            />
          ))}
        </div>
      </div>
      {selectedVideo && (
        <VideoPlayer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </main>
  );
}
