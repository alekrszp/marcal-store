import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { formatCurrency } from '../utils/formatters';

export default function CourseCard({ course, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.card, style]} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.thumbContainer}>
        <Image
          source={{ uri: course.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {course.tag
          ? <View style={styles.tag}>
              <Text style={styles.tagText}>{course.tag}</Text>
            </View>
          : null
        }
        <View style={styles.overlay} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{course.title}</Text>
        <Text style={styles.mentor} numberOfLines={1}>{course.mentor}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(course.price)}</Text>
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>VER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:           { width: 200, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginRight: spacing.md },
  thumbContainer: { height: 120, position: 'relative' },
  image:          { width: '100%', height: '100%' },
  overlay:        { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, backgroundColor: 'rgba(0,0,0,0.4)' },
  tag:            { position: 'absolute', top: spacing.sm, left: spacing.sm, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs - 1, borderRadius: radius.full },
  tagText:        { ...typography.tiny, color: colors.primaryText },
  body:           { padding: spacing.md },
  title:          { ...typography.bodyBold, color: colors.textPrimary },
  mentor:         { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  footer:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  price:          { ...typography.bodyBold, color: colors.primary },
  btn:            { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm - 2, borderRadius: radius.sm },
  btnText:        { ...typography.nano, color: colors.primaryText },
});