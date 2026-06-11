import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PlayIcon from './PlayIcon';
import { colors, spacing, radius, typography } from '../theme';

export default function CursoVideoCard({ produto, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.thumbContainer}>
        <Image source={{ uri: produto.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.overlay} />
        <View style={styles.playCircle}>
          <PlayIcon size={28} color={colors.primaryText} />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{produto.title}</Text>
        <Text style={styles.mentor} numberOfLines={1}>por {produto.mentor}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:           { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing.md },
  thumbContainer: { height: 160, position: 'relative' },
  image:          { width: '100%', height: '100%' },
  overlay:        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  playCircle:     { position: 'absolute', top: '50%', left: '50%', marginTop: -28, marginLeft: -28, width: 56, height: 56, borderRadius: radius.full, backgroundColor: 'rgba(10,107,62,0.9)', alignItems: 'center', justifyContent: 'center' },
  body:           { padding: spacing.md },
  title:          { ...typography.bodyBold, color: colors.textPrimary },
  mentor:         { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
});
