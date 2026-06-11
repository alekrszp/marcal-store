import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { formatCurrency } from '../utils/formatters';

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.mentor} numberOfLines={1}>{item.mentor}</Text>
        <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {formatCurrency(item.price * item.quantity)}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Text style={styles.removeText}>REMOVER</Text>
        </TouchableOpacity>

        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.qtyButton} onPress={onDecrease}>
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={onIncrease}>
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:           { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.sm, marginBottom: spacing.md },
  image:          { width: 56, height: 56, borderRadius: radius.md },
  info:           { flex: 1, marginLeft: spacing.md, marginRight: spacing.sm },
  title:          { ...typography.bodyBold, color: colors.textPrimary },
  mentor:         { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  price:          { ...typography.bodyBold, color: colors.primary, marginTop: spacing.xs },
  actions:        { alignItems: 'flex-end', gap: spacing.xs },
  removeButton:   { borderWidth: 1, borderColor: colors.danger, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  removeText:     { ...typography.tiny, color: colors.danger },
  quantityRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyButton:      { width: 28, height: 28, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  qtyButtonText:  { ...typography.bodyBold, color: colors.textPrimary },
  qtyValue:       { ...typography.bodyBold, color: colors.textPrimary, minWidth: 18, textAlign: 'center' },
});
