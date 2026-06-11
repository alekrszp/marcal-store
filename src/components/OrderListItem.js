import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function OrderListItem({ order, onPress }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.info}>
        <Text style={styles.date}>{formatDate(order.date)}</Text>
        <Text style={styles.details}>
          {itemCount} {itemCount === 1 ? 'item' : 'itens'} · {order.paymentMethod}
        </Text>
      </View>
      <Text style={styles.total} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
        {formatCurrency(order.total)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm },
  info:    { flexShrink: 1 },
  date:    { ...typography.bodyBold, color: colors.textPrimary },
  details: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  total:   { ...typography.bodyBold, color: colors.primary, flexShrink: 0 },
});
