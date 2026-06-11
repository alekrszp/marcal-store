import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import ProdutoCard from './ProdutoCard';
import { colors, spacing, typography } from '../theme';

export default function ProdutoRow({ produtos, onProdutoPress }) {
  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <ProdutoCard
          produto={item}
          onPress={() => onProdutoPress(item)}
          style={styles.card}
        />
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>Nenhum produto nesta categoria.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  list:  { paddingHorizontal: spacing.lg },
  card:  { width: 200, marginRight: spacing.md },
  empty: { ...typography.small, color: colors.textSecondary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});
