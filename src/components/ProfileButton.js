import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme';

export default function ProfileButton({ initial, avatar, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      {avatar
        ? <Image source={{ uri: avatar }} style={styles.avatar} />
        : <Text style={styles.initial}>{initial}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:     { width: 38, height: 38, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatar:  { width: 38, height: 38, borderRadius: radius.full },
  initial: { ...typography.h3, fontSize: 16, color: colors.primaryText },
});