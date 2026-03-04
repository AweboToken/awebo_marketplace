'use client';

import { useRef, useEffect } from 'react';

const HERO_BG_VIDEO =
  'https://ik.imagekit.io/3bfeucft4/grok-video-04525375-d090-47c8-9fc9-6b58ab16d924%20(2).mp4';

export default function HeroBgVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => video.play().catch(() => {});
    if (video.readyState >= 2) play();
    else video.addEventListener('loadeddata', play);
    return () => video.removeEventListener('loadeddata', play);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover"
      src={HERO_BG_VIDEO}
      title=""
      aria-hidden
    />
  );
}
