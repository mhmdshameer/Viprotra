import mongoose from "mongoose";

interface WatchedInterval {
  start: number;
  end: number;
}

const videoProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoPath: {
    type: String,
    required: true,
  },
  watchedIntervals: [{
    start: Number,
    end: Number
  }],
  lastPosition: {
    type: Number,
    default: 0,
  },
  totalDuration: {
    type: Number,
    default: 0,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure one progress entry per user per video
videoProgressSchema.index({ userId: 1, videoPath: 1 }, { unique: true });

// Method to calculate progress based on watched intervals
videoProgressSchema.methods.calculateProgress = function(): number {
  if (!this.watchedIntervals.length || !this.totalDuration) return 0;
  
  // Sort intervals by start time
  const sortedIntervals = [...this.watchedIntervals].sort((a, b) => a.start - b.start);
  
  // Merge overlapping intervals
  const mergedIntervals: WatchedInterval[] = [];
  let currentInterval = sortedIntervals[0];
  
  for (let i = 1; i < sortedIntervals.length; i++) {
    if (sortedIntervals[i].start <= currentInterval.end) {
      currentInterval.end = Math.max(currentInterval.end, sortedIntervals[i].end);
    } else {
      mergedIntervals.push(currentInterval);
      currentInterval = sortedIntervals[i];
    }
  }
  mergedIntervals.push(currentInterval);
  
  // Calculate total watched time
  const totalWatched = mergedIntervals.reduce((sum, interval) => 
    sum + (interval.end - interval.start), 0);
  
  // Calculate progress percentage
  return Math.min(100, (totalWatched / this.totalDuration) * 100);
};

const VideoProgress = mongoose.models.VideoProgress || mongoose.model("VideoProgress", videoProgressSchema);

export default VideoProgress; 