import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import HeroBanner from '../components/HeroBanner';
import CategoryFilterBar from '../components/CategoryFilterBar';
import SectionHeader from '../components/SectionHeader';
import CourseRow from '../components/CourseRow';
import ProfileButton from '../components/ProfileButton';
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
          <ProfileButton initial={userInitial} onPress={handleProfilePress} />
        </View>

        <HeroBanner />

        <CategoryFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <SectionHeader
          title={activeCategory === 'Todos' ? 'Em destaque' : activeCategory}
          onVerTudo={() => handleVerTudo(activeCategory)}
        />
        <CourseRow courses={courses} onCoursePress={handleCoursePress} />

        <SectionHeader
          title="Mentorias"
          onVerTudo={() => handleVerTudo('Mentoria')}
        />
        <CourseRow courses={mentorias} onCoursePress={handleCoursePress} />

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});