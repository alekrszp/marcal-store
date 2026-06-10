import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import HeroBanner from '../components/HeroBanner';
import CourseCard from '../components/CourseCard';
import CategoryChip from '../components/CategoryChip';
import g from '../theme/globalStyles';
import { colors, spacing } from '../theme';
import { useUserContext } from '../context/UserContext';
import useCourses from '../hooks/useCourses';
import useCategories from '../hooks/useCategories';

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const { user }                            = useUserContext();
  const { courses }                         = useCourses(activeCategory);
  const { courses: mentorias }              = useCourses('Mentoria');
  const { categories }                      = useCategories();

  const userInitial = user?.nome?.charAt(0).toUpperCase() ?? 'U';

  function handleCoursePress(course) {
    navigation.navigate('CourseDetail', { course });
  }

  function handleVerTudo(category) {
    navigation.navigate('Courses', { category });
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
            <Text style={styles.profileInitial}>{userInitial}</Text>
          </TouchableOpacity>
        </View>

        <HeroBanner />

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

        <View style={g.sectionHeader}>
          <Text style={g.sectionTitle}>
            {activeCategory === 'Todos' ? 'Em destaque' : activeCategory}
          </Text>
          <TouchableOpacity onPress={() => handleVerTudo(activeCategory)}>
            <Text style={g.sectionLink}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesList}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={() => handleCoursePress(item)} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum curso nesta categoria.</Text>
          }
        />

        <View style={g.sectionHeader}>
          <Text style={g.sectionTitle}>Mentorias</Text>
          <TouchableOpacity onPress={() => handleVerTudo('Mentoria')}>
            <Text style={g.sectionLink}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mentorias}
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