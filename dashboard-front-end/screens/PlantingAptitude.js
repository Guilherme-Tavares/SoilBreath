import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const PlantingAptitude = () => {
  const crops = [
    { name: "Trigo", aptitude: 86, icon: "🌾" },
    { name: "Milho", aptitude: 78, icon: "🌽" },
    { name: "Soja", aptitude: 72, icon: "🫘" },
    { name: "Arroz", aptitude: 65, icon: "🌾" },
    { name: "Feijão", aptitude: 58, icon: "🫘" },
    { name: "Algodão", aptitude: 45, icon: "☁️" },
  ];

  const getColor = (value) => {
    if (value >= 75) return '#34C759';
    if (value >= 50) return '#FF9500';
    return '#FF3B30';
  };

  const MiniRadialProgress = ({ value }) => {
    const size = 64;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <View style={styles.miniProgressContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e5e7"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(value)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.miniProgressText}>
          <Text style={[styles.miniProgressValue, { color: getColor(value) }]}>
            {value}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aptidão dos Plantios</Text>
        <Text style={styles.headerSubtitle}>
          Compatibilidade do solo com diferentes cultivos
        </Text>
      </View>

      {/* Crops List */}
      <View style={styles.cropsList}>
        {crops.map((crop) => (
          <View key={crop.name} style={styles.cropCard}>
            <View style={styles.cropContent}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>{crop.icon}</Text>
              </View>

              {/* Content */}
              <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{crop.name}</Text>
                <Text style={styles.cropDescription}>
                  Aptidão do solo para este cultivo
                </Text>
              </View>

              {/* Mini Progress */}
              <MiniRadialProgress value={crop.aptitude} />
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Spacing for Navigation */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  cropsList: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  cropCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cropContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  cropDescription: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  miniProgressContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniProgressText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniProgressValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default PlantingAptitude;