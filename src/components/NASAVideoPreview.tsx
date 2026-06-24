import { useEffect, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import { useApodVideoPreview } from '../context/ApodVideoContext';

interface NASAVideoPreviewProps {
  uri: string;
  style: ViewStyle;
  placeholderColor: string;
  isActive?: boolean;
}

interface VideoPreviewFrameProps {
  style: ViewStyle;
  placeholderColor: string;
  isActive: boolean;
  player: ReturnType<typeof useVideoPlayer>;
  isFrameReady: boolean;
  onFrameReady: () => void;
}

const VideoPreviewFrame = ({
  style,
  placeholderColor,
  isActive,
  player,
  isFrameReady,
  onFrameReady,
}: VideoPreviewFrameProps) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    player.muted = true;
    player.loop = false;
    player.currentTime = 0;
    player.play();

    const pauseTimer = setTimeout(() => {
      player.pause();
      player.currentTime = 0;
    }, 200);

    return () => clearTimeout(pauseTimer);
  }, [isActive, player]);

  return (
    <View style={[style, styles.container]}>
      {!isFrameReady ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: placeholderColor }]} />
      ) : null}
      {isActive ? (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          useExoShutter={false}
          onFirstFrameRender={onFrameReady}
        />
      ) : null}
    </View>
  );
};

const LocalNASAVideoPreview = ({
  uri,
  style,
  placeholderColor,
  isActive,
}: NASAVideoPreviewProps & { isActive: boolean }) => {
  const [isReady, setIsReady] = useState(false);
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.muted = true;
    videoPlayer.loop = false;
  });

  useEffect(() => {
    setIsReady(false);
  }, [uri]);

  return (
    <VideoPreviewFrame
      style={style}
      placeholderColor={placeholderColor}
      isActive={isActive}
      player={player}
      isFrameReady={isReady}
      onFrameReady={() => setIsReady(true)}
    />
  );
};

const SharedNASAVideoPreview = ({
  uri,
  style,
  placeholderColor,
  isActive,
}: NASAVideoPreviewProps & { isActive: boolean }) => {
  const shared = useApodVideoPreview();

  if (!shared || shared.videoUrl !== uri) {
    return (
      <LocalNASAVideoPreview
        uri={uri}
        style={style}
        placeholderColor={placeholderColor}
        isActive={isActive}
      />
    );
  }

  return (
    <VideoPreviewFrame
      style={style}
      placeholderColor={placeholderColor}
      isActive={isActive}
      player={shared.player}
      isFrameReady={shared.isFrameReady}
      onFrameReady={() => shared.setFrameReady(true)}
    />
  );
};

const NASAVideoPreview = ({
  uri,
  style,
  placeholderColor,
  isActive = true,
}: NASAVideoPreviewProps) => {
  const shared = useApodVideoPreview();

  if (shared?.videoUrl === uri) {
    return (
      <SharedNASAVideoPreview
        uri={uri}
        style={style}
        placeholderColor={placeholderColor}
        isActive={isActive}
      />
    );
  }

  return (
    <LocalNASAVideoPreview
      uri={uri}
      style={style}
      placeholderColor={placeholderColor}
      isActive={isActive}
    />
  );
};

export default NASAVideoPreview;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
