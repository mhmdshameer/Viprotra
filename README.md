# Video Progress Tracking System

A Next.js application that tracks video watching progress with unique interval tracking and progress calculation.

## Features

- User authentication (sign-up/sign-in)
- Video playback with progress tracking
- Unique interval tracking to prevent progress manipulation
- Real-time progress updates
- Total progress calculation across all videos
- Responsive design with modern UI

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd video-progress
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design Decisions

### Authentication
- Used NextAuth.js for secure authentication
- Implemented JWT-based sessions for better performance
- Custom credentials provider for username/password authentication

### Video Progress Tracking
- Implemented interval-based tracking instead of simple percentage
- Used MongoDB for persistent storage
- Real-time progress updates using custom events

### UI/UX
- Clean and modern interface using Tailwind CSS
- Responsive design for all screen sizes
- Visual progress indicators with color coding

## Technical Implementation

### Interval Tracking
The system tracks video progress using watched intervals instead of simple timestamps:

```typescript
interface WatchedInterval {
  start: number;  // Start time in seconds
  end: number;    // End time in seconds
}
```

Key features:
- Tracks multiple intervals for each video
- Merges overlapping intervals
- Prevents progress manipulation through skipping
- Persists intervals in MongoDB

### Unique Progress Calculation
Progress is calculated based on unique watched time:

1. Merge overlapping intervals:
```typescript
const mergeIntervals = (intervals: WatchedInterval[]) => {
  const sorted = intervals.sort((a, b) => a.start - b.start);
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
```

2. Calculate total watched time:
```typescript
const totalWatched = mergedIntervals.reduce(
  (acc, interval) => acc + (interval.end - interval.start),
  0
);
```

3. Calculate progress percentage:
```typescript
const progress = (totalWatched / totalDuration) * 100;
```

### Real-time Updates
- Custom event system for progress updates
- Periodic saving of progress (every 5 seconds)
- Immediate updates on pause/close

## Challenges and Solutions

### Challenge 1: Progress Manipulation
**Problem**: Users could skip through videos to artificially increase progress.

**Solution**: 
- Implemented interval tracking
- Only count unique watched segments
- Merge overlapping intervals to prevent double-counting

### Challenge 2: Real-time Updates
**Problem**: Progress updates needed to be reflected immediately across components.

**Solution**:
- Created a custom event system
- Implemented broadcast mechanism for progress updates
- Used React state management for immediate UI updates

### Challenge 3: Data Persistence
**Problem**: Progress needed to be saved efficiently without overwhelming the database.

**Solution**:
- Implemented periodic saving (every 5 seconds)
- Used MongoDB's upsert for efficient updates
- Optimized interval merging to reduce database size

### Challenge 4: Type Safety
**Problem**: TypeScript errors in NextAuth configuration and API routes.

**Solution**:
- Created proper type declarations
- Separated auth configuration
- Added proper error handling

## Future Improvements

1. Add video categories and search functionality
2. Implement user profiles and settings
3. Add video recommendations based on watch history
4. Implement video quality selection
5. Add support for video playlists

## Technologies Used

- Next.js 13+ (App Router)
- TypeScript
- MongoDB with Mongoose
- NextAuth.js
- Tailwind CSS
- React Hooks
- Custom Events API
# Rootales
