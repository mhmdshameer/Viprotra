export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  videoId: string; // YouTube video ID
}

export const videos: Video[] = [
  {
    id: "1",
    title: "Introduction to React",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "10:30",
    videoId: "dQw4w9WgXcQ"
  },
  {
    id: "2",
    title: "Advanced TypeScript",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "15:45",
    videoId: "dQw4w9WgXcQ"
  },
  // Add more videos as needed
]; 