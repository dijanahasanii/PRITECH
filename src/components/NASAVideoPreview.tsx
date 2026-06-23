import { useEffect, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

interface NASAVideoPreviewProps {
  uri: string;
  style: ViewStyle;
  placeholderColor: string;
}

const NASAVideoPreview = ({ uri, style, placeholderColor }: NASAVideoPreviewProps) => {
  const [isReady, setIsReady] = useState(false);

  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.muted = true;
    videoPlayer.loop = false;
  });

  useEffect(() => {
    setIsReady(false);
    player.muted = true;
    player.loop = false;
    player.currentTime = 0;
    player.play();

    const pauseTimer = setTimeout(() => {
      player.pause();
      player.currentTime = 0;
    }, 200);

    return () => clearTimeout(pauseTimer);
  }, [player, uri]);

  return (
    <View style={[style, styles.container]}>
      {!isReady ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: placeholderColor }]} />
      ) : null}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        useExoShutter={false}
        onFirstFrameRender={() => setIsReady(true)}
      />
    </View>
  );
};

export default NASAVideoPreview;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
