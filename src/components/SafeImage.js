import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function SafeImage({ uri, style, resizeMode = 'cover' }) {
  if (typeof uri === 'string' && uri.trim()) {
    return <Image source={{ uri: uri.trim() }} style={style} resizeMode={resizeMode} />;
  }

  return <View style={[style, styles.placeholder]} />;
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: colors.surfaceAlt },
});
