import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const NutrientCard = ({ nutrient }) => {
  const percentage = ((nutrient.current - nutrient.min) / (nutrient.max - nutrient.min)) * 100;
  const isOptimal = nutrient.current >= nutrient.min && nutrient.current <= nutrient.max;

  const getStatusColor = () => {
    if (isOptimal) return '#34C759';
    return '#FF9500';
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* Symbol Circle */}
        <View style={styles.symbolContainer}>
          <View style={styles.symbolCircle}>
            <Text style={styles.symbolText}>{nutrient.symbol}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.info}>
          <Text style={styles.title}>{nutrient.name}</Text>
          <Text style={styles.description}>{nutrient.description}</Text>
          
          {/* Value and Range */}
          <View style={styles.valueContainer}>
            <View>
              <View style={styles.currentValueRow}>
                <Text style={styles.currentValue}>{nutrient.current}</Text>
                <Text style={styles.unit}>{nutrient.unit}</Text>
              </View>
              <Text style={styles.range}>
                Faixa adequada: {nutrient.min}–{nutrient.max}
              </Text>
            </View>
            
            {/* Status Indicator */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>
                {isOptimal ? 'Ideal' : 'Atenção'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: `${Math.min(Math.max(percentage, 0), 100)}%`,
                    backgroundColor: getStatusColor()
                  }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    gap: 16,
  },
  symbolContainer: {
    flexShrink: 0,
  },
  symbolCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  unit: {
    fontSize: 14,
    color: '#8e8e93',
    marginLeft: 4,
  },
  range: {
    fontSize: 11,
    color: '#8e8e93',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f2f2f7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});