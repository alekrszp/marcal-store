import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModuloItem from '../components/ModuloItem';
import g from '../theme/globalStyles';
import { colors, spacing, radius, typography } from '../theme';
import { formatCurrency } from '../utils/formatters';

export default function CourseDetailScreen({ navigation, route }) {
  const { course } = route.params;

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={g.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.imageContainer}>
          <Image source={{ uri: course.image }} style={styles.image} resizeMode="cover" />
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

          {course.cargaHoraria ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⏱ {course.cargaHoraria} de conteúdo</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          {course.descricao ? (
            <>
              <Text style={styles.sectionTitle}>SOBRE O CURSO</Text>
              <Text style={styles.descricao}>{course.descricao}</Text>
              <View style={styles.divider} />
            </>
          ) : null}

          {course.modulos?.length ? (
            <>
              <Text style={styles.sectionTitle}>O QUE VOCÊ VAI APRENDER</Text>
              <View style={styles.modulosList}>
                {course.modulos.map((modulo, index) => (
                  <ModuloItem key={index} title={modulo} />
                ))}
              </View>
              <View style={styles.divider} />
            </>
          ) : null}

          <View style={styles.buySection}>
            <View>
              <Text style={styles.priceLabel}>INVESTIMENTO</Text>
              <Text style={styles.price}>{formatCurrency(course.price)}</Text>
            </View>
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
  imageContainer: { height: 280, position: 'relative' },
  image:          { width: '100%', height: '100%' },
  imageOverlay:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  backButton:     { position: 'absolute', top: spacing.lg, left: spacing.lg },
  backText:       { ...typography.caption, fontWeight: '700', color: colors.primaryText, letterSpacing: 1.5 },
  tag:            { position: 'absolute', top: spacing.lg, right: spacing.lg, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full },
  tagText:        { ...typography.nano, color: colors.primaryText },
  content:        { padding: spacing.lg },
  category:       { ...typography.micro, color: colors.primary, marginBottom: spacing.xs },
  title:          { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  mentor:         { ...typography.subtitle, color: colors.textSecondary, marginBottom: spacing.md },
  badge:          { alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.border },
  badgeText:      { ...typography.caption, color: colors.textSecondary },
  divider:        { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  sectionTitle:   { ...typography.micro, color: colors.textSecondary, marginBottom: spacing.md },
  descricao:      { ...typography.body, color: colors.textPrimary },
  modulosList:    { gap: spacing.sm },
  buySection:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  priceLabel:     { ...typography.micro, color: colors.textSecondary, marginBottom: spacing.xs },
  price:          { ...typography.h4, color: colors.primary },
  buyButton:      { flex: 1, backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  buyButtonText:  { ...typography.button, color: colors.primaryText },
});