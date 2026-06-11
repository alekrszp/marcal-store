import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CartIcon from './CartIcon';
import { colors, radius, typography } from '../theme';

export default function CartButton({ itemCount = 0, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <CartIcon size={20} color={colors.primaryText} />
      {itemCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:        { width: 38, height: 38, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  badge:      { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: radius.full, paddingHorizontal: 3, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background },
  badgeText:  { ...typography.tiny, color: colors.primaryText },
});
