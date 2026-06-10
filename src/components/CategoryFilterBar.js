import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CategoryChip from './CategoryChip';
import { spacing } from '../theme';

export default function CategoryFilterBar({ categories, activeCategory, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {categories.map((cat) => (
        <CategoryChip
          key={cat}
          label={cat}
          isActive={activeCategory === cat}
          onPress={() => onSelect(cat)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  row:    { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, alignItems: 'center' },
});