import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { formatCurrency } from '../utils/formatters';

export default function AdminProdutoListItem({ produto, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: produto.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{produto.title}</Text>
        <Text style={styles.category} numberOfLines={1}>{produto.category}</Text>
        <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {formatCurrency(produto.price)}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editText}>EDITAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>EXCLUIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:        { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.sm, marginBottom: spacing.md },
  image:       { width: 56, height: 56, borderRadius: radius.md },
  info:        { flex: 1, marginLeft: spacing.md, marginRight: spacing.sm },
  title:       { ...typography.bodyBold, color: colors.textPrimary },
  category:    { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  price:       { ...typography.bodyBold, color: colors.primary, marginTop: spacing.xs },
  actions:     { gap: spacing.xs },
  editButton:  { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, alignItems: 'center' },
  editText:    { ...typography.tiny, color: colors.textSecondary },
  deleteButton:{ borderWidth: 1, borderColor: colors.danger, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, alignItems: 'center' },
  deleteText:  { ...typography.tiny, color: colors.danger },
});
