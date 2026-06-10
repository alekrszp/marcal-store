import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, radius } from '../theme';

export default function CourseCard({ course, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
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
          <Text style={styles.price}>R$ {course.price}</Text>
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
  tag:            { position: 'absolute', top: spacing.sm, left: spacing.sm, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full },
  tagText:        { fontSize: 9, fontWeight: '800', color: colors.primaryText, letterSpacing: 1 },
  body:           { padding: spacing.md },
  title:          { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  mentor:         { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  footer:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  price:          { fontSize: 16, fontWeight: '900', color: colors.primary },
  btn:            { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.sm },
  btnText:        { fontSize: 11, fontWeight: '900', color: colors.primaryText, letterSpacing: 1 },
});