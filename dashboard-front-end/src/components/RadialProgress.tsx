import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface RadialProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

export const RadialProgress = ({ 
  value, 
  size = 180, 
  strokeWidth = 12 
}: RadialProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 75) return "#10b981"; // green
    if (val >= 50) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#1f2937' }}>
          {value}%
        </Text>
        <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          Aptidão
        </Text>
      </View>
    </View>
  );
};