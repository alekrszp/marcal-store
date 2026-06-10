import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius } from '../theme';

export default function AvatarPicker({ avatar, initials, onPress }) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.8}>
      {avatar
        ? <Image source={{ uri: avatar }} style={styles.image} />
        : <View style={styles.placeholder}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
      }
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✎</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap:        { position: 'relative', alignSelf: 'center' },
  image:       { width: 100, height: 100, borderRadius: 50 },
  placeholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  initials:    { fontSize: 36, fontWeight: '900', color: colors.primaryText },
  badge:       { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  badgeText:   { fontSize: 13, color: colors.textPrimary },
});