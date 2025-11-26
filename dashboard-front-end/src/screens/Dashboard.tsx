import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RadialProgress } from '../components/RadialProgress';
import { NutrientCard } from '../components/NutrientCard';
import ConfirmModal from '../components/ConfirmModal';
import SuccessModal from '../components/SuccessModal';
import CultureSelectorModal from '../components/CultureSelectorModal';
import { soloService, Solo } from '../api/services/soil';
import { culturaService, Cultura } from '../api/services/cultura';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  // Estados
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soloData, setSoloData] = useState<Solo | null>(null);
  const [selectedCulture, setSelectedCulture] = useState<Cultura | null>(null);
  const [availableCultures, setAvailableCultures] = useState<Cultura[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCultureModal, setShowCultureModal] = useState(false);
  const { logout } = useAuth();

  // Buscar dados da API quando o componente carregar
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Primeiro buscar culturas
      const culturasResponse = await culturaService.getCulturas();
      let culturas: Cultura[] = [];
      
      if (culturasResponse.success && culturasResponse.data) {
        culturas = culturasResponse.data;
        setAvailableCultures(culturas);
      }

      // Depois buscar solo
      const soloResponse = await soloService.getSolos();
      if (soloResponse.success && soloResponse.data.length > 0) {
        setSoloData(soloResponse.data[0]);
        
        // Selecionar automaticamente a cultura mais apta
        if (culturas.length > 0) {
          const aptidoesResponse = await culturaService.getAptidoesPorSolo(soloResponse.data[0].id);
          if (aptidoesResponse.success && aptidoesResponse.data.aptidoes.length > 0) {
            const mostAptCulturaId = aptidoesResponse.data.aptidoes[0].culturaId;
            const culture = culturas.find(c => c.id === mostAptCulturaId);
            if (culture) {
              setSelectedCulture(culture);
            }
          }
        }
      } else {
        setError('Nenhum dado de solo encontrado');
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados iniciais:', err);
      setError('Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  const fetchCultures = async () => {
    try {
      const response = await culturaService.getCulturas();
      if (response.success && response.data) {
        setAvailableCultures(response.data);
      }
    } catch (err) {
      console.error('Erro ao buscar culturas:', err);
    }
  };

  const selectMostAptCulture = async (soloId: number, culturas: Cultura[]) => {
    try {
      const response = await culturaService.getAptidoesPorSolo(soloId);
      if (response.success && response.data.aptidoes.length > 0) {
        // Aptidões já vêm ordenadas por mediaPct (mais apta primeiro)
        const mostAptCulturaId = response.data.aptidoes[0].culturaId;
        const culture = culturas.find(c => c.id === mostAptCulturaId);
        if (culture) {
          setSelectedCulture(culture);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar cultura mais apta:', err);
    }
  };

  const handleCultureChange = async (culturaId: number) => {
    const culture = availableCultures.find(c => c.id === culturaId);
    if (culture) {
      setSelectedCulture(culture);
      setShowCultureModal(false);
    }
  };

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    // Mostrar modal de sucesso após um pequeno delay
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSoloData();
    setRefreshing(false);
  };

  const fetchSoloData = async () => {
    try {
      console.log('Iniciando busca de dados...');
      setLoading(true);
      setError(null);

      console.log('🌐 Chamando API:', 'https://localhost:7137/api/Solo');
      const response = await soloService.getSolos();
      console.log('Resposta da API:', response);

      if (response.success && response.data.length > 0) {
        console.log('Dados encontrados:', response.data[0]);
        setSoloData(response.data[0]);
        
        // Selecionar automaticamente a cultura mais apta
        if (availableCultures.length > 0) {
          await selectMostAptCulture(response.data[0].id, availableCultures);
        }
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
    if (!soloData || !selectedCulture) return 0;

    // Calcula baseado nos valores ideais da cultura selecionada
    const nPercent = Math.min((soloData.nitrogenio / selectedCulture.nitrogenio) * 100, 100);
    const pPercent = Math.min((soloData.fosforo / selectedCulture.fosforo) * 100, 100);
    const kPercent = Math.min((soloData.potassio / selectedCulture.potassio) * 100, 100);

    return Math.round((nPercent + pPercent + kPercent) / 3);
  };

  // Preparar dados dos nutrientes para o NutrientCard
  const nutrients = soloData && selectedCulture ? [
    {
      symbol: "N",
      name: "Nitrogênio",
      description: "Essencial para crescimento vegetativo",
      current: soloData.nitrogenio,
      min: selectedCulture.nitrogenio * 0.7,
      max: selectedCulture.nitrogenio,
      unit: "mg/kg"
    },
    {
      symbol: "P",
      name: "Fósforo",
      description: "Importante para raízes e floração",
      current: soloData.fosforo,
      min: selectedCulture.fosforo * 0.7,
      max: selectedCulture.fosforo,
      unit: "mg/kg"
    },
    {
      symbol: "K",
      name: "Potássio",
      description: "Fortalece resistência da planta",
      current: soloData.potassio,
      min: selectedCulture.potassio * 0.7,
      max: selectedCulture.potassio,
      unit: "mg/kg"
    }
  ] : [];

  // Tela de loading
  if (loading) {
    return (
      <View style={styles.container}>
        {/* Header com logout */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Análise de Solo</Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogoutPress} 
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </View>
    );
  }

  // Tela de erro
  if (error) {
    return (
      <View style={styles.container}>
        {/* Header com logout */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Análise de Solo</Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogoutPress} 
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>
            Verifique se a API está rodando em{'\n'}
            https://localhost:7137
          </Text>
          <TouchableOpacity 
            onPress={handleRefresh} 
            style={styles.retryButton}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
        
        {/* Modals */}
        <ConfirmModal
          visible={showLogoutModal}
          title="Confirmar Saída"
          message="Deseja realmente sair da sua conta?"
          icon="log-out-outline"
          iconColor="#ef4444"
          confirmText="Sair"
          cancelText="Cancelar"
          confirmStyle="destructive"
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
        <SuccessModal
          visible={showSuccessModal}
          title="Até logo! 👋"
          message="Você foi desconectado com sucesso."
          icon="checkmark-circle"
          buttonText="OK"
          onClose={handleSuccessModalClose}
        />
      </View>
    );
  }

  // Tela principal com dados
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Análise de Solo</Text>
          <Text style={styles.headerSubtitle}>
            {soloData?.identificacao || 'Solo sem identificação'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleLogoutPress} 
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Radial Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          {/* Culture Selector */}
          <TouchableOpacity
            style={styles.cultureSelector}
            onPress={() => setShowCultureModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.cultureSelectorContent}>
              <Text style={styles.cultureSelectorLabel}>Cultura:</Text>
              <Text style={styles.cultureSelectorValue}>
                {selectedCulture?.nome || 'Selecione'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#3b82f6" />
          </TouchableOpacity>

          <View style={styles.progressContent}>
            <RadialProgress value={calcularAptidao()} size={180} strokeWidth={12} />
            <Text style={styles.progressTitle}>Aptidão do Solo</Text>
            <Text style={styles.progressSubtitle}>
              {selectedCulture ? `Para cultivo de ${selectedCulture.nome}` : 'Selecione uma cultura'}
            </Text>
          </View>
          
          {/* Botão de Atualizar */}
          <TouchableOpacity 
            onPress={handleRefresh} 
            style={styles.refreshButton}
            disabled={refreshing}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="refresh" 
              size={20} 
              color={refreshing ? "#9ca3af" : "#3b82f6"} 
            />
            <Text style={[styles.refreshButtonText, refreshing && styles.refreshButtonTextDisabled]}>
              {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
            </Text>
          </TouchableOpacity>
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
                  ? `${Math.round(soloData.umidade)}%` 
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
                  ? `${Math.round(soloData.temperatura)}°C` 
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

      {/* Modal de Confirmação de Logout */}
      <ConfirmModal
        visible={showLogoutModal}
        title="Confirmar Saída"
        message="Deseja realmente sair da sua conta?"
        icon="log-out-outline"
        iconColor="#ef4444"
        confirmText="Sair"
        cancelText="Cancelar"
        confirmStyle="destructive"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* Modal de Sucesso */}
      <SuccessModal
        visible={showSuccessModal}
        title="Até logo! 👋"
        message="Você foi desconectado com sucesso."
        icon="checkmark-circle"
        buttonText="OK"
        onClose={handleSuccessModalClose}
      />

      {/* Modal de Seleção de Cultura */}
      <CultureSelectorModal
        visible={showCultureModal}
        cultures={availableCultures.map(c => ({
          id: c.id,
          nome: c.nome,
          icon: getCultureIcon(c.nome),
        }))}
        selectedCultureId={selectedCulture?.id || null}
        onSelect={handleCultureChange}
        onClose={() => setShowCultureModal(false)}
      />
    </ScrollView>
  );
}

// Helper para ícones de cultura
const getCultureIcon = (nome: string): string => {
  const icons: { [key: string]: string } = {
    'Trigo': '🌾',
    'Milho': '🌽',
    'Soja': '🫘',
    'Arroz': '🌾',
    'Feijão': '🫘',
    'Algodão': '☁️',
  };
  return icons[nome] || '🌱';
};

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
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  progressHeader: {
    width: '100%',
  },
  progressContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  refreshButtonTextDisabled: {
    color: '#9ca3af',
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
  cultureSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  cultureSelectorContent: {
    flex: 1,
  },
  cultureSelectorLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  cultureSelectorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});