import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CourseCard from '../components/CourseCard';
import CategoryChip from '../components/CategoryChip';
import g from '../theme/globalStyles';
import { colors, spacing } from '../theme';
import useCourses from '../hooks/useCourses';
import useCategories from '../hooks/useCategories';

export default function CoursesScreen({ navigation, route }) {
  const initialCategory              = route.params?.category ?? 'Todos';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { courses }                         = useCourses(activeCategory);
  const { categories }                      = useCategories();

  function handleCoursePress(course) {
    navigation.navigate('CourseDetail', { course });
  }

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={g.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={g.backButton} onPress={handleGoBack}>
          <Text style={g.backText}>← VOLTAR</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CURSOS</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {categories.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            isActive={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <CourseCard course={item} onPress={() => handleCoursePress(item)} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum curso encontrado.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:        { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  title:         { fontSize: 28, fontWeight: '900', color: colors.textPrimary, letterSpacing: -1, marginBottom: spacing.md },
  categoriesRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  grid:          { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  row:           { justifyContent: 'space-between', marginBottom: spacing.md },
  cardWrap:      { width: '48%' },
  emptyText:     { color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: spacing.xl },
});