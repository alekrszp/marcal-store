import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import CourseCard from './CourseCard';
import { colors, spacing, typography } from '../theme';

export default function CourseRow({ courses, onCoursePress }) {
  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <CourseCard
          course={item}
          onPress={() => onCoursePress(item)}
          style={styles.card}
        />
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>Nenhum curso nesta categoria.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  list:  { paddingHorizontal: spacing.lg },
  card:  { width: 200, marginRight: spacing.md },
  empty: { ...typography.small, color: colors.textSecondary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});