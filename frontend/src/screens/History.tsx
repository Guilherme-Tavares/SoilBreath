import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { historicoService } from '../api/services/historico';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 300;
const BAR_SPACING = 24;

type ViewMode = 'diario' | 'mensal' | 'anual';

export default function History() {
  const [viewMode, setViewMode] = useState<ViewMode>('diario');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadUltimoRegistro();
  }, []);

  useEffect(() => {
    if (selectedDate || selectedMonth || selectedYear) {
      fetchData();
    }
  }, [viewMode, selectedDate, selectedMonth, selectedYear]);

  const loadUltimoRegistro = async () => {
    try {
      const response = await historicoService.getUltimoRegistro();
      if (response.success && response.data.temRegistros && response.data.data) {
        setSelectedDate(new Date(response.data.data));
        const lastDate = new Date(response.data.data);
        setSelectedMonth(lastDate.getMonth() + 1);
        setSelectedYear(lastDate.getFullYear());
      } else {
        setSelectedDate(new Date());
      }
    } catch (err) {
      console.error('Erro ao carregar último registro:', err);
      setSelectedDate(new Date());
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (viewMode === 'diario') {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await historicoService.getDadosDiarios(dateStr);
        if (response.success) setData(response.data);
      } else if (viewMode === 'mensal') {
        const response = await historicoService.getDadosMensais(selectedMonth, selectedYear);
        if (response.success) setData(response.data);
      } else if (viewMode === 'anual') {
        const response = await historicoService.getDadosAnuais(selectedYear);
        if (response.success) setData(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!data) return null;

    if (viewMode === 'diario') {
      return {
        nitrogenio: Math.round(data.nitrogenio || 0),
        fosforo: Math.round(data.fosforo || 0),
        potassio: Math.round(data.potassio || 0),
        umidade: Math.round(data.umidade || 0),
        temperatura: Math.round(data.temperatura || 0),
        temDados: data.temDados,
      };
    } else {
      return {
        nitrogenio: Math.round(data.nitrogenioMedio || 0),
        fosforo: Math.round(data.fosforoMedio || 0),
        potassio: Math.round(data.potassioMedio || 0),
        umidade: Math.round(data.umidadeMedia || 0),
        temperatura: Math.round(data.temperaturaMedia || 0),
        temDados: data.temDados,
      };
    }
  };

  const renderBarChart = () => {
    const chartData = getChartData();
    if (!chartData) return null;

    const bars = [
      { label: 'N', value: chartData.nitrogenio, color: '#3b82f6' },
      { label: 'P', value: chartData.fosforo, color: '#10b981' },
      { label: 'K', value: chartData.potassio, color: '#f59e0b' },
      { label: 'Umi', value: chartData.umidade, color: '#06b6d4' },
      { label: 'Temp', value: chartData.temperatura, color: '#ef4444' },
    ];

    // Calcular largura disponível
    const totalSpacing = BAR_SPACING * (bars.length + 1);
    const barWidth = (CHART_WIDTH - totalSpacing) / bars.length;

    if (!chartData.temDados) {
      return (
        <View style={styles.noDataContainer}>
          <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
          <Text style={styles.noDataText}>Sem dados disponíveis</Text>
          <Text style={styles.noDataSubtext}>
            {viewMode === 'diario' && 'Nenhum registro encontrado para esta data'}
            {viewMode === 'mensal' && 'Nenhum registro encontrado para este mês'}
            {viewMode === 'anual' && 'Nenhum registro encontrado para este ano'}
          </Text>
        </View>
      );
    }

    // Encontrar o valor máximo real para normalização dinâmica
    const maxValue = Math.max(...bars.map(b => b.value), 1);
    const chartUsableHeight = CHART_HEIGHT - 70; // Espaço para labels e valores

    return (
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Linhas de grade sutis */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = 50 + (1 - ratio) * chartUsableHeight;
          return (
            <Line 
              key={i} 
              x1="0" 
              y1={y} 
              x2={CHART_WIDTH} 
              y2={y} 
              stroke="#f3f4f6" 
              strokeWidth="1" 
            />
          );
        })}

        {/* Barras */}
        {bars.map((bar, index) => {
          // Calcular posição X uniforme
          const xOffset = BAR_SPACING + index * (barWidth + BAR_SPACING);

          // Normalizar altura baseado no maior valor
          const normalizedHeight = (bar.value / maxValue) * chartUsableHeight;
          const barHeight = Math.max(normalizedHeight, 2); // Mínimo de 2px
          const y = 50 + chartUsableHeight - barHeight;

          return (
            <React.Fragment key={index}>
              {/* Sombra da barra */}
              <Rect 
                x={xOffset + 1} 
                y={y + 2} 
                width={barWidth} 
                height={barHeight} 
                fill="#000000" 
                opacity="0.06" 
                rx="6" 
              />
              {/* Barra principal */}
              <Rect 
                x={xOffset} 
                y={y} 
                width={barWidth} 
                height={barHeight} 
                fill={bar.color} 
                rx="6" 
              />
              {/* Highlight sutil no topo */}
              <Rect 
                x={xOffset} 
                y={y} 
                width={barWidth} 
                height={Math.min(barHeight * 0.15, 6)} 
                fill="#ffffff" 
                opacity="0.2" 
                rx="6" 
              />
              {/* Valor acima da barra */}
              <SvgText 
                x={xOffset + barWidth / 2} 
                y={y - 8} 
                fontSize="12" 
                fontWeight="600" 
                fill="#374151" 
                textAnchor="middle"
              >
                {bar.value}
              </SvgText>
              {/* Label abaixo da área do gráfico */}
              <SvgText 
                x={xOffset + barWidth / 2} 
                y={50 + chartUsableHeight + 20} 
                fontSize="12" 
                fontWeight="500" 
                fill="#6b7280" 
                textAnchor="middle"
              >
                {bar.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  const formatarData = () => {
    if (viewMode === 'diario') {
      return selectedDate.toLocaleDateString('pt-BR');
    } else if (viewMode === 'mensal') {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return `${meses[selectedMonth - 1]} ${selectedYear}`;
    } else {
      return selectedYear.toString();
    }
  };

  const changeDate = (direction: number) => {
    if (viewMode === 'diario') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + direction);
      setSelectedDate(newDate);
    } else if (viewMode === 'mensal') {
      let newMonth = selectedMonth + direction;
      let newYear = selectedYear;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
    } else {
      setSelectedYear(selectedYear + direction);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
        <Text style={styles.headerSubtitle}>
          Dados históricos de NPK, umidade e temperatura
        </Text>
      </View>

      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'diario' && styles.modeButtonActive]}
          onPress={() => setViewMode('diario')}
        >
          <Text style={[styles.modeButtonText, viewMode === 'diario' && styles.modeButtonTextActive]}>
            Diário
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'mensal' && styles.modeButtonActive]}
          onPress={() => setViewMode('mensal')}
        >
          <Text style={[styles.modeButtonText, viewMode === 'mensal' && styles.modeButtonTextActive]}>
            Mensal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'anual' && styles.modeButtonActive]}
          onPress={() => setViewMode('anual')}
        >
          <Text style={[styles.modeButtonText, viewMode === 'anual' && styles.modeButtonTextActive]}>
            Anual
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateSelectorContainer}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton}>
          <Ionicons name="chevron-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
        {viewMode === 'diario' ? (
          <TouchableOpacity 
            style={styles.dateDisplay}
            onPress={() => {
              if (Platform.OS !== 'web') {
                setShowDatePicker(true);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dateText}>{formatarData()}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>{formatarData()}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateButton}>
          <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Date Picker nativo para mobile (modo diário) */}
      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}

      <View style={styles.chartCard}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.chartTitle}>Valores Médios</Text>
            <View style={styles.chartContainer}>
              {renderBarChart()}
            </View>
            {data && data.temDados && (
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#3b82f6' }]} />
                  <Text style={styles.legendText}>Nitrogênio (mg/kg)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
                  <Text style={styles.legendText}>Fósforo (mg/kg)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.legendText}>Potássio (mg/kg)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#06b6d4' }]} />
                  <Text style={styles.legendText}>Umidade (%)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                  <Text style={styles.legendText}>Temperatura (°C)</Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    backgroundColor: '#3b82f6', 
    paddingHorizontal: 24, 
    paddingTop: 60, 
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'white', opacity: 0.9, marginTop: 4 },
  modeContainer: { flexDirection: 'row', padding: 16, gap: 12, backgroundColor: 'white', marginTop: 8 },
  modeButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center' },
  modeButtonActive: { backgroundColor: '#3b82f6' },
  modeButtonText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  modeButtonTextActive: { color: 'white' },
  dateSelectorContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'white', marginTop: 8 },
  dateButton: { padding: 8 },
  dateDisplay: { flex: 1, alignItems: 'center' },
  dateText: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  chartCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginHorizontal: 16, marginTop: 16, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 },
  chartContainer: { alignItems: 'center', marginVertical: 16 },
  loadingContainer: { height: 300, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#6b7280' },
  errorContainer: { height: 300, justifyContent: 'center', alignItems: 'center' },
  errorText: { marginTop: 12, fontSize: 14, color: '#ef4444', textAlign: 'center' },
  noDataContainer: { height: 300, justifyContent: 'center', alignItems: 'center' },
  noDataText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: '#6b7280' },
  noDataSubtext: { marginTop: 8, fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  legendContainer: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendColor: { width: 16, height: 16, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 14, color: '#6b7280' },
});
