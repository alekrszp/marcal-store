import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function PlayIcon({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M10 8.5v7l6-3.5-6-3.5z" fill={color} />
    </Svg>
  );
}
