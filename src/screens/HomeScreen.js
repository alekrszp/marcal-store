import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import HeroBanner from '../components/HeroBanner';
import CourseCard from '../components/CourseCard';
import CategoryChip from '../components/CategoryChip';
import g from '../theme/globalStyles';
import { colors, spacing } from '../theme';
import { COURSES, CATEGORIES, MENTORIAS } from '../data/courses';

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredCourses = activeCategory === 'Todos'
    ? COURSES
    : COURSES.filter(c => c.category === activeCategory);

  // INTEGRAÇÃO: substituir COURSES e MENTORIAS por estado local
  // carregado via useEffect → GET /api/courses e GET /api/courses?category=Mentoria
  // Adicionar isLoading e hasError para feedback visual durante o carregamento

  function handleCoursePress(course) {
    navigation.navigate('CourseDetail', { course });
  }

  function handleProfilePress() {
    navigation.navigate('Profile');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Logo size="sm" />
          <TouchableOpacity style={styles.profileBtn} onPress={handleProfilePress}>
            <Text style={styles.profileInitial}>A</Text>
          </TouchableOpacity>
        </View>

        <HeroBanner />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              isActive={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>

        <View style={g.sectionHeader}>
          <Text style={g.sectionTitle}>
            {activeCategory === 'Todos' ? 'Em destaque' : activeCategory}
          </Text>
          <TouchableOpacity>
            <Text style={g.sectionLink}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesList}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={() => handleCoursePress(item)} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum curso nesta categoria ainda.</Text>
          }
        />

        <View style={g.sectionHeader}>
          <Text style={g.sectionTitle}>Mentorias</Text>
          <TouchableOpacity>
            <Text style={g.sectionLink}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={MENTORIAS}
          keyExtractor={(item) => `mentoria_${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesList}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={() => handleCoursePress(item)} />
          )}
        />

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.background },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  profileBtn:     { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  profileInitial: { fontSize: 16, fontWeight: '900', color: colors.primaryText },
  categoriesRow:  { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  coursesList:    { paddingHorizontal: spacing.lg },
  emptyText:      { color: colors.textSecondary, fontSize: 13, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});