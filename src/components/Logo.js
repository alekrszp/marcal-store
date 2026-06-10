import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { colors, typography } from '../theme';

function MSLogo({ size = 56 }) {
  const cx       = size / 2;
  const cy       = size / 2;
  const outerR   = size / 2 - 2;
  const innerR   = size / 2 - 7;
  const fontSize = size * 0.48;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={cx} cy={cy} r={outerR}
        fill="none"
        stroke={colors.primary}
        strokeWidth={size * 0.055}
      />
      <Circle
        cx={cx} cy={cy} r={innerR}
        fill="none"
        stroke={colors.primary}
        strokeWidth={size * 0.022}
        strokeDasharray={`${size * 0.08} ${size * 0.06}`}
      />
      <SvgText
        x={cx}
        y={cy + fontSize * 0.36}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={fontSize}
        fontWeight="900"
        fontFamily="serif"
      >
        M
      </SvgText>
    </Svg>
  );
}

export { MSLogo };

export default function Logo({ size = 'md', onlySymbol = false }) {
  const dim = size === 'lg' ? 80 : size === 'sm' ? 40 : 56;

  if (onlySymbol) return <MSLogo size={dim} />;

  return (
    <View style={styles.row}>
      <MSLogo size={dim} />
      <View>
        <Text style={styles.brand}>MARÇAL STORE</Text>
        <Text style={styles.tagline}>Conhecimento de elite</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 14 },
  brand:   { fontSize: 16, fontWeight: '900', color: colors.textPrimary, letterSpacing: 2 },
  tagline: { fontSize: 11, fontWeight: '500', color: colors.primary, marginTop: 2, letterSpacing: 1 },
});