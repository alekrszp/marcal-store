import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

// "video" pode ser:
// - string: URI local (escolhida da galeria, modo mock) ou URL remota (já integrado)
// - number: asset bundlado via require() (apenas para os 2 cursos de exemplo do seed)
// Em ambos os casos só exibimos o nome do arquivo/indicação de que há um vídeo selecionado.
function getVideoLabel(video) {
  if (!video) return null;
  if (typeof video === 'string') return video.split('/').pop();
  return 'Vídeo de exemplo (arquivo do app)';
}

export default function ProdutoVideoPicker({ video, onPick, onRemove }) {
  const videoLabel = getVideoLabel(video);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>VÍDEO DA AULA (OPCIONAL)</Text>
      <Text style={styles.hint}>
        Escolha um vídeo da galeria do celular (.mp4, H.264). Recomendado:
        até 1080p e ~50MB para não pesar o app. Só aparece em "Meus Cursos"
        para quem já comprou este produto.
      </Text>

      <TouchableOpacity style={styles.preview} onPress={onPick} activeOpacity={0.8}>
        {videoLabel
          ? <Text style={styles.fileText} numberOfLines={1}>🎬 {videoLabel}</Text>
          : <Text style={styles.placeholderText}>+ SELECIONAR VÍDEO DA GALERIA</Text>
        }
      </TouchableOpacity>

      {videoLabel ? (
        <TouchableOpacity onPress={onRemove}>
          <Text style={styles.removeText}>Remover vídeo</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { marginBottom: spacing.md },
  label:          { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.textSecondary, marginBottom: spacing.sm },
  hint:           { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  preview:        { height: 56, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  fileText:       { ...typography.small, color: colors.textPrimary },
  placeholderText:{ ...typography.nano, color: colors.textSecondary, letterSpacing: 1.5 },
  removeText:     { ...typography.caption, color: colors.danger, marginTop: spacing.sm, alignSelf: 'flex-start' },
});
