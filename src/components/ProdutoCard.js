import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SafeImage from './SafeImage';
import { colors, spacing, radius, typography } from '../theme';
import { formatCurrency } from '../utils/formatters';

export default function ProdutoCard({ produto, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.card, style]} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.thumbContainer}>
        <SafeImage uri={produto.image} style={styles.image} />
        {produto.tag ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{produto.tag}</Text>
          </View>
        ) : null}
        <View style={styles.overlay} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{produto.title}</Text>
        <Text style={styles.mentor} numberOfLines={1}>{produto.mentor}</Text>
        <View style={styles.footer}>
          <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {formatCurrency(produto.price)}
          </Text>
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>VER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:           { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  thumbContainer: { height: 120, position: 'relative' },
  image:          { width: '100%', height: '100%' },
  overlay:        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  tag:            { position: 'absolute', top: spacing.sm, left: spacing.sm, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs - 1, borderRadius: radius.full },
  tagText:        { ...typography.tiny, color: colors.primaryText },
  body:           { padding: spacing.md },
  title:          { ...typography.bodyBold, color: colors.textPrimary },
  mentor:         { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  footer:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, gap: spacing.xs },
  price:          { ...typography.bodyBold, color: colors.primary, flexShrink: 1 },
  btn:            { flexShrink: 0, backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm - 2, borderRadius: radius.sm },
  btnText:        { ...typography.nano, color: colors.primaryText },
});
