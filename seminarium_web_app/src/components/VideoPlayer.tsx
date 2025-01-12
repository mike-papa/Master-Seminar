import React, { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  onVideoEnd?: () => void;
  onLoadedMetadata?: (duration: number) => void;
  autoPlay?: boolean;
  width?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  onVideoEnd,
  onLoadedMetadata,
  autoPlay = false,
  width = 640,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    if (videoDuration > 0) {
      interval = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoDuration]);

  // Add keydown listener for End button
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "End") {
        // Skip to 0.1s before the end
        if (videoRef.current && videoDuration > 0) {
          videoRef.current.currentTime = Math.max(videoDuration - 0.1, 0);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoDuration]);

  return (
    <div>
      <video
        ref={videoRef}
        controls={false}
        width={width}
        autoPlay={autoPlay}
        onEnded={onVideoEnd}
        onLoadedMetadata={(e) => {
          const duration = e.currentTarget.duration;
          setVideoDuration(duration);
          if (onLoadedMetadata) {
            onLoadedMetadata(duration);
          }
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>
        Remaining: {Math.max(videoDuration - elapsedTime, 0).toFixed(0)} seconds
      </p>
    </div>
  );
};

export default VideoPlayer;
