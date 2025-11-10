import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RadialProgress } from '../components/RadialProgress';
import { NutrientCard } from '../components/NutrientCard';
import { soloService, Solo } from '../api/services/soil';

export default function Dashboard() {
  // Estados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [soloData, setSoloData] = useState<Solo | null>(null);

  // Buscar dados da API quando o componente carregar
  useEffect(() => {
    fetchSoloData();
  }, []);

  const fetchSoloData = async () => {
    try {
      console.log('Iniciando busca de dados...');
      setLoading(true);
      setError(null);

      console.log('🌐 Chamando API:', 'http://localhost:7137/api/Solo?idPropriedade=1');
      const response = await soloService.getSolos(1);
      console.log('Resposta da API:', response);

      if (response.success && response.data.length > 0) {
        console.log('Dados encontrados:', response.data[0]);
        setSoloData(response.data[0]);
      } else {
        console.log('Nenhum dado encontrado');
        setError('Nenhum dado de solo encontrado');
      }
    } catch (err: any) {
      console.error('Erro capturado:', err);
      console.error('Detalhes do erro:', JSON.stringify(err, null, 2));
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao buscar dados';
      
      if (err.message?.includes("Unknown column 's.umidade'")) {
        errorMessage = 'Erro no banco de dados: coluna "umidade" não existe. Verifique a estrutura da tabela Solo no backend.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      console.log('Finalizando busca');
      setLoading(false);
    }
  };

  // Calcular aptidão do solo (exemplo simplificado)
  const calcularAptidao = () => {
    if (!soloData) return 0;

    // Fórmula simples: média dos nutrientes em relação aos valores ideais
    // Você pode melhorar isso depois
    const nPercent = Math.min((soloData.nitrogenio / 60) * 100, 100);
    const pPercent = Math.min((soloData.fosforo / 45) * 100, 100);
    const kPercent = Math.min((soloData.potassio / 250) * 100, 100);

    return Math.round((nPercent + pPercent + kPercent) / 3);
  };

  // Preparar dados dos nutrientes para o NutrientCard
  const nutrients = soloData ? [
    {
      symbol: "N",
      name: "Nitrogênio",
      description: "Essencial para crescimento vegetativo",
      current: soloData.nitrogenio,
      min: 40,
      max: 60,
      unit: "mg/kg"
    },
    {
      symbol: "P",
      name: "Fósforo",
      description: "Importante para raízes e floração",
      current: soloData.fosforo,
      min: 25,
      max: 45,
      unit: "mg/kg"
    },
    {
      symbol: "K",
      name: "Potássio",
      description: "Fortalece resistência da planta",
      current: soloData.potassio,
      min: 150,
      max: 250,
      unit: "mg/kg"
    }
  ] : [];

  // Tela de loading
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  // Tela de erro
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Verifique se a API está rodando em{'\n'}
          http://localhost:5135
        </Text>
      </View>
    );
  }

  // Tela principal com dados
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Análise de Solo</Text>
        <Text style={styles.headerSubtitle}>
          {soloData?.identificacao || 'Solo sem identificação'}
        </Text>
      </View>

      {/* Radial Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressContent}>
          <RadialProgress value={calcularAptidao()} size={180} strokeWidth={12} />
          <Text style={styles.progressTitle}>Aptidão do Solo</Text>
          <Text style={styles.progressSubtitle}>Baseado nos nutrientes NPK</Text>
        </View>

        {/* Environmental Data */}
        <View style={styles.environmentalGrid}>
          <View style={styles.environmentalCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="water" size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.environmentalLabel}>Umidade</Text>
              <Text style={styles.environmentalValue}>
                {soloData?.umidade != null 
                  ? `${soloData.umidade.toFixed(1)}%` 
                  : '--'}
              </Text>
            </View>
          </View>

          <View style={styles.environmentalCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="thermometer" size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.environmentalLabel}>Temperatura</Text>
              <Text style={styles.environmentalValue}>
                {soloData?.temperatura != null 
                  ? `${soloData.temperatura.toFixed(1)}°C` 
                  : '--'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Nutrients Section */}
      <View style={styles.nutrientsSection}>
        <Text style={styles.sectionTitle}>Nutrientes</Text>
        {nutrients.map((nutrient) => (
          <NutrientCard key={nutrient.symbol} nutrient={nutrient} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
  },
  errorHint: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginTop: -32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#1f2937',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#6b7280',
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
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#3b82f620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  environmentalLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  environmentalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  nutrientsSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
});