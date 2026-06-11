import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function ProdutoImagePicker({ image, onPress, error }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>IMAGEM DO PRODUTO</Text>
      <TouchableOpacity
        style={[styles.preview, error && styles.errorBorder]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {image
          ? <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          : <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>+ ESCOLHER IMAGEM</Text>
            </View>
        }
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { marginBottom: spacing.md },
  label:          { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.textSecondary, marginBottom: spacing.sm },
  preview:        { height: 160, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  errorBorder:    { borderColor: colors.danger },
  image:          { width: '100%', height: '100%' },
  placeholder:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText:{ ...typography.nano, color: colors.textSecondary, letterSpacing: 1.5 },
  errorText:      { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
});
