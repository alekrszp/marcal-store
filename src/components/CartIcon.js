import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export default function CartIcon({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="9" cy="21" r="1.5" fill={color} />
      <Circle cx="18" cy="21" r="1.5" fill={color} />
    </Svg>
  );
}
