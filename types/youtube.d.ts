declare namespace YT {
  interface PlayerEvent {
    target: Player;
  }

  interface OnReadyEvent extends PlayerEvent {}

  interface OnStateChangeEvent extends PlayerEvent {
    data: number;
  }

  class Player {
    constructor(elementId: string, options: PlayerOptions);
    destroy(): void;
    getCurrentTime(): number;
    getDuration(): number;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      rel?: 0 | 1;
      [key: string]: any;
    };
    events?: {
      onReady?: (event: OnReadyEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      [key: string]: any;
    };
  }

  const PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
} 