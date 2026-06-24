import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useVideoPlayer, type VideoPlayer } from 'expo-video';

import type { ApodData } from '../types/nasa';
import { getApodDirectVideoUrl, isApodVideo } from '../utils/nasa';

interface ApodVideoContextValue {
  videoUrl: string;
  player: VideoPlayer;
  isFrameReady: boolean;
  setFrameReady: (ready: boolean) => void;
}

const ApodVideoContext = createContext<ApodVideoContextValue | null>(null);

interface ApodVideoProviderProps {
  apod: ApodData | null;
  children: ReactNode;
}

const ApodVideoPlayerHost = ({
  videoUrl,
  children,
}: {
  videoUrl: string;
  children: ReactNode;
}) => {
  const [isFrameReady, setFrameReady] = useState(false);
  const player = useVideoPlayer(videoUrl, (videoPlayer) => {
    videoPlayer.muted = true;
    videoPlayer.loop = false;
  });

  useEffect(() => {
    setFrameReady(false);
    player.muted = true;
    player.loop = false;
    player.currentTime = 0;
  }, [player, videoUrl]);

  const value = useMemo(
    () => ({
      videoUrl,
      player,
      isFrameReady,
      setFrameReady,
    }),
    [isFrameReady, player, videoUrl],
  );

  return <ApodVideoContext.Provider value={value}>{children}</ApodVideoContext.Provider>;
};

export const ApodVideoPrefetch = ({ apod, children }: ApodVideoProviderProps) => {
  const videoUrl =
    apod && isApodVideo(apod) ? getApodDirectVideoUrl(apod) ?? null : null;

  if (!videoUrl) {
    return <ApodVideoContext.Provider value={null}>{children}</ApodVideoContext.Provider>;
  }

  return <ApodVideoPlayerHost videoUrl={videoUrl}>{children}</ApodVideoPlayerHost>;
};

export const useApodVideoPreview = (): ApodVideoContextValue | null =>
  useContext(ApodVideoContext);
