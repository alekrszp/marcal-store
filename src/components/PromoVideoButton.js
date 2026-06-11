import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PlayIcon from './PlayIcon';
import { colors, spacing, radius, typography } from '../theme';

export default function PromoVideoButton({ onPress, title = 'VÍDEO', subtitle = 'Veja a publi com Pablo Marçal' }) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.iconCircle}>
        <PlayIcon size={20} color={colors.primaryText} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  iconCircle:{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  texts:     { flex: 1 },
  title:     { ...typography.label, color: colors.textPrimary },
  subtitle:  { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
