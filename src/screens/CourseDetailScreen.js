import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import g from '../theme/globalStyles';
import { colors, spacing, radius, typography } from '../theme';

export default function CourseDetailScreen({ navigation, route }) {
  const { course } = route.params;

  function handleGoBack() {
    navigation.goBack();
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(course.price));

  return (
    <SafeAreaView style={g.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: course.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backText}>← VOLTAR</Text>
          </TouchableOpacity>
          {course.tag ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{course.tag}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{course.category.toUpperCase()}</Text>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.mentor}>por {course.mentor}</Text>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formattedPrice}</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>QUERO ESTE CURSO</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: { height: 260, position: 'relative' },
  image:          { width: '100%', height: '100%' },
  imageOverlay:   { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  backButton:     { position: 'absolute', top: spacing.lg, left: spacing.lg },
  backText:       { fontSize: 12, fontWeight: '700', color: colors.primaryText, letterSpacing: 1.5 },
  tag:            { position: 'absolute', top: spacing.lg, right: spacing.lg, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.full },
  tagText:        { fontSize: 10, fontWeight: '800', color: colors.primaryText, letterSpacing: 1 },
  content:        { padding: spacing.lg },
  category:       { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 2, marginBottom: spacing.xs },
  title:          { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm },
  mentor:         { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  divider:        { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  priceRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  price:          { fontSize: 28, fontWeight: '900', color: colors.primary },
  buyButton:      { flex: 1, backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  buyButtonText:  { ...typography.button, color: colors.primaryText },
});