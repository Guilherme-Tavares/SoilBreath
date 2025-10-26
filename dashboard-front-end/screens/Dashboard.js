import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import { RadialProgress } from '../components/RadialProgress';
import { NutrientCard } from '../components/NutrientCard';

const Dashboard = () => {
  // Mock data
  const soilAptitude = 86;
  const cropType = "Trigo";
  const humidity = 65;
  const temperature = 24;
  
  const nutrients = [
    {
      symbol: "N",
      name: "Nitrogênio",
      description: "Essencial para crescimento vegetativo",
      current: 45,
      min: 40,
      max: 60,
      unit: "mg/kg"
    },
    {
      symbol: "P",
      name: "Fósforo",
      description: "Importante para raízes e floração",
      current: 28,
      min: 25,
      max: 45,
      unit: "mg/kg"
    },
    {
      symbol: "K",
      name: "Potássio",
      description: "Fortalece resistência da planta",
      current: 180,
      min: 150,
      max: 250,
      unit: "mg/kg"
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Análise de Solo</Text>
        <Text style={styles.headerSubtitle}>Cultivo: {cropType}</Text>
      </View>

      {/* Radial Progress Card */}
      <View style={styles.progressCardContainer}>
        <View style={styles.progressCard}>
          <View style={styles.progressContent}>
            <RadialProgress value={soilAptitude} size={180} strokeWidth={12} />
            <Text style={styles.progressTitle}>Aptidão do Solo</Text>
            <Text style={styles.progressSubtitle}>Para cultivo de {cropType}</Text>
          </View>

          {/* Environmental Data */}
          <View style={styles.environmentalGrid}>
            <View style={styles.environmentalCard}>
              <View style={styles.iconCircle}>
                <Icon name="droplet" size={20} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.environmentalLabel}>Umidade</Text>
                <Text style={styles.environmentalValue}>{humidity}%</Text>
              </View>
            </View>
            
            <View style={styles.environmentalCard}>
              <View style={styles.iconCircle}>
                <Icon name="thermometer" size={20} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.environmentalLabel}>Temperatura</Text>
                <Text style={styles.environmentalValue}>{temperature}°C</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Nutrients Section */}
      <View style={styles.nutrientsSection}>
        <Text style={styles.nutrientsTitle}>Nutrientes</Text>
        {nutrients.map((nutrient) => (
          <NutrientCard key={nutrient.symbol} nutrient={nutrient} />
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
    paddingBottom: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressCardContainer: {
    paddingHorizontal: 24,
    marginTop: -32,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e5e7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#000000',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 4,
  },
  environmentalGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  environmentalCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f2f2f7',
    borderRadius: 12,
    padding: 16,
  },
  iconCircle: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  environmentalLabel: {
    fontSize: 11,
    color: '#8e8e93',
  },
  environmentalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  nutrientsSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  nutrientsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default Dashboard;