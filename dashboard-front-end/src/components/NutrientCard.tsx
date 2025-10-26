import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Nutrient {
  symbol: string;
  name: string;
  description: string;
  current: number;
  min: number;
  max: number;
  unit: string;
}

interface NutrientCardProps {
  nutrient: Nutrient;
}

export const NutrientCard = ({ nutrient }: NutrientCardProps) => {
  const percentage = ((nutrient.current - nutrient.min) / (nutrient.max - nutrient.min)) * 100;
  const isOptimal = nutrient.current >= nutrient.min && nutrient.current <= nutrient.max;

  const getStatusColor = () => {
    if (isOptimal) return '#10b981'; // green
    return '#f59e0b'; // yellow/warning
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
          <Text style={styles.name}>{nutrient.name}</Text>
          <Text style={styles.description}>{nutrient.description}</Text>
          
          {/* Value and Range */}
          <View style={styles.valueContainer}>
            <View>
              <Text style={styles.value}>
                {nutrient.current}
                <Text style={styles.unit}> {nutrient.unit}</Text>
              </Text>
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
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#3b82f620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  unit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#6b7280',
  },
  range: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});