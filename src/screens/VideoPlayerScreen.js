import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors, spacing, typography } from '../theme';

export default function VideoPlayerScreen({ navigation, route }) {
  const { video, title } = route.params;

  const player = useVideoPlayer(video, (p) => {
    p.loop = false;
    p.play();
  });

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backText}>← VOLTAR</Text>
      </TouchableOpacity>

      {title ? <Text style={styles.title} numberOfLines={2}>{title}</Text> : null}

      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          nativeControls
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colors.background },
  backButton:    { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  backText:      { ...typography.caption, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.5 },
  title:         { ...typography.h3, color: colors.textPrimary, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  videoContainer:{ flex: 1, justifyContent: 'center' },
  video:         { width: '100%', aspectRatio: 16 / 9 },
});
