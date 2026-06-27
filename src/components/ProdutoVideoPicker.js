import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Input from './Input';
import { colors, spacing, radius, typography } from '../theme';

function getVideoLabel(video) {
  if (!video) return null;
  if (typeof video === 'string') return video.split('/').pop();
  return 'Vídeo selecionado';
}

export default function ProdutoVideoPicker({
  video,
  videoLink,
  onPick,
  onRemove,
  onVideoLinkChange,
  error,
}) {
  const videoLabel = getVideoLabel(video);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>VÍDEO DA AULA (OPCIONAL)</Text>
      <Text style={styles.hint}>
        Cole um link público (MP4, M3U8, etc.) ou escolha um vídeo da galeria.
        O arquivo enviado fica no servidor e fica disponível para todos os usuários
        que navegam nos cursos.
      </Text>

      <Input
        label="Link do vídeo"
        value={videoLink}
        onChangeText={onVideoLinkChange}
        placeholder="https://exemplo.com/aula.mp4"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        error={error}
      />

      <Text style={styles.orText}>ou</Text>

      <TouchableOpacity style={styles.preview} onPress={onPick} activeOpacity={0.8}>
        {videoLabel
          ? <Text style={styles.fileText} numberOfLines={1}>🎬 {videoLabel}</Text>
          : <Text style={styles.placeholderText}>+ SELECIONAR VÍDEO DA GALERIA</Text>
        }
      </TouchableOpacity>

      {videoLabel ? (
        <TouchableOpacity onPress={onRemove}>
          <Text style={styles.removeText}>Remover vídeo da galeria</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { marginBottom: spacing.md },
  label:           { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.textSecondary, marginBottom: spacing.sm },
  hint:            { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  orText:          { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginVertical: spacing.sm },
  preview:         { height: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  fileText:        { ...typography.small, color: colors.textPrimary },
  placeholderText: { ...typography.nano, color: colors.textSecondary, letterSpacing: 1.5 },
  removeText:      { ...typography.caption, color: colors.danger, marginTop: spacing.sm, alignSelf: 'flex-start' },
});
