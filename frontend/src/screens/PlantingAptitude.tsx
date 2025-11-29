import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { culturaService, Cultura, AptidaoSolo } from '../api/services/cultura';
import { soloService } from '../api/services/soil';

// Habilitar animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CropDisplay extends Cultura {
    icon: string;
    aptitude: number;
}

export default function PlantingAptitude() {
    const [crops, setCrops] = useState<CropDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [soloId, setSoloId] = useState<number>(1);

    // Mapear ícones para cada cultura
    const getCropIcon = (nome: string): string => {
        const icons: { [key: string]: string } = {
            'Trigo': '🌾',
            'Milho': '🌽',
            'Soja': '🌿',
            'Arroz': '🍚',
            'Feijão': '🫘',
            'Algodão': '☁️',
        };
        return icons[nome] || '🌱';
    };

    useEffect(() => {
        fetchAptidoes();
    }, []);

    const fetchAptidoes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Buscar o primeiro solo do usuário autenticado
            const solosResponse = await soloService.getSolos();
            if (!solosResponse.success || solosResponse.data.length === 0) {
                setError('Nenhum solo encontrado');
                return;
            }

            const solo = solosResponse.data[0];
            setSoloId(solo.id);

            // Buscar aptidões calculadas pela API
            const aptidoesResponse = await culturaService.getAptidoesPorSolo(solo.id);
            
            if (aptidoesResponse.success && aptidoesResponse.data) {
                // Buscar culturas completas para ter os valores ideais
                const culturasResponse = await culturaService.getCulturas();
                
                if (culturasResponse.success && culturasResponse.data) {
                    const cropsWithDisplay = aptidoesResponse.data.aptidoes.map(apt => {
                        const culturaCompleta = culturasResponse.data.find(c => c.id === apt.culturaId);
                        return {
                            ...culturaCompleta!,
                            icon: getCropIcon(apt.culturaNome),
                            aptitude: Math.round(apt.mediaPct),
                        };
                    });
                    setCrops(cropsWithDisplay);
                }
            } else {
                setError('Nenhuma aptidão calculada');
            }
        } catch (err: any) {
            console.error('Erro ao buscar aptidões:', err);
            setError(err.message || 'Erro ao carregar aptidões');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const getColor = (value: number) => {
        if (value >= 75) return '#10b981';
        if (value >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const MiniProgress = ({ value }: { value: number }) => {
        const size = 64;
        const strokeWidth = 6;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const progress = circumference * (1 - value / 100);

        return (
            <View style={{ width: size, height: size }}>
                <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e5e7eb"
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
                        strokeDashoffset={progress}
                        strokeLinecap="round"
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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Aptidão dos Plantios</Text>
                <Text style={styles.headerSubtitle}>
                    Valores ideais de NPK, umidade e temperatura
                </Text>
            </View>

            {/* Loading State */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Carregando culturas...</Text>
                </View>
            )}

            {/* Error State */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchAptidoes}>
                        <Text style={styles.retryButtonText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Crops List */}
            {!loading && !error && (
                <View style={styles.cropsSection}>
                    {crops.map((crop) => (
                        <TouchableOpacity
                            key={crop.id}
                            style={styles.cropCard}
                            activeOpacity={0.7}
                            onPress={() => toggleExpand(crop.id)}
                        >
                            <View style={styles.cropContent}>
                                {/* Icon */}
                                <View style={styles.iconCircle}>
                                    <Text style={styles.iconText}>{crop.icon}</Text>
                                </View>

                                {/* Content */}
                                <View style={styles.cropInfo}>
                                    <Text style={styles.cropName}>{crop.nome}</Text>
                                    <Text style={styles.cropDescription}>
                                        {expandedId === crop.id ? 'Toque para recolher' : 'Toque para ver valores ideais'}
                                    </Text>
                                </View>

                                {/* Mini Progress */}
                                <View style={styles.progressContainer}>
                                    <MiniProgress value={crop.aptitude} />
                                </View>
                            </View>

                            {/* Expanded Content */}
                            {expandedId === crop.id && (
                                <View style={styles.expandedContent}>
                                    <View style={styles.divider} />
                                    
                                    <Text style={styles.expandedTitle}>Valores Ideais (Embrapa)</Text>
                                    
                                    <View style={styles.nutrientsGrid}>
                                        {/* Nitrogênio */}
                                        <View style={styles.nutrientItem}>
                                            <View style={[styles.nutrientBadge, { backgroundColor: '#3b82f620' }]}>
                                                <Text style={styles.nutrientBadgeText}>N</Text>
                                            </View>
                                            <View style={styles.nutrientInfo}>
                                                <Text style={styles.nutrientLabel}>Nitrogênio</Text>
                                                <Text style={styles.nutrientValue}>{Math.round(crop.nitrogenio)} mg/kg</Text>
                                            </View>
                                        </View>

                                        {/* Fósforo */}
                                        <View style={styles.nutrientItem}>
                                            <View style={[styles.nutrientBadge, { backgroundColor: '#10b98120' }]}>
                                                <Text style={styles.nutrientBadgeText}>P</Text>
                                            </View>
                                            <View style={styles.nutrientInfo}>
                                                <Text style={styles.nutrientLabel}>Fósforo</Text>
                                                <Text style={styles.nutrientValue}>{Math.round(crop.fosforo)} mg/kg</Text>
                                            </View>
                                        </View>

                                        {/* Potássio */}
                                        <View style={styles.nutrientItem}>
                                            <View style={[styles.nutrientBadge, { backgroundColor: '#f59e0b20' }]}>
                                                <Text style={styles.nutrientBadgeText}>K</Text>
                                            </View>
                                            <View style={styles.nutrientInfo}>
                                                <Text style={styles.nutrientLabel}>Potássio</Text>
                                                <Text style={styles.nutrientValue}>{Math.round(crop.potassio)} mg/kg</Text>
                                            </View>
                                        </View>

                                        {/* Umidade */}
                                        <View style={styles.nutrientItem}>
                                            <View style={[styles.nutrientBadge, { backgroundColor: '#06b6d420' }]}>
                                                <Text style={styles.nutrientBadgeText}>💧</Text>
                                            </View>
                                            <View style={styles.nutrientInfo}>
                                                <Text style={styles.nutrientLabel}>Umidade</Text>
                                                <Text style={styles.nutrientValue}>{Math.round(crop.umidade)}%</Text>
                                            </View>
                                        </View>

                                        {/* Temperatura */}
                                        <View style={styles.nutrientItem}>
                                            <View style={[styles.nutrientBadge, { backgroundColor: '#ef444420' }]}>
                                                <Text style={styles.nutrientBadgeText}>🌡️</Text>
                                            </View>
                                            <View style={styles.nutrientInfo}>
                                                <Text style={styles.nutrientLabel}>Temperatura</Text>
                                                <Text style={styles.nutrientValue}>{Math.round(crop.temperatura)}°C</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
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
    header: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'white',
        opacity: 0.9,
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6b7280',
    },
    errorContainer: {
        margin: 24,
        padding: 20,
        backgroundColor: '#fee2e2',
        borderRadius: 12,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#dc2626',
        textAlign: 'center',
        marginBottom: 12,
    },
    retryButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    cropsSection: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    cropCard: {
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
    cropContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3b82f620',
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
        color: '#1f2937',
    },
    cropDescription: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    progressContainer: {
        flexShrink: 0,
    },
    miniProgressText: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniProgressValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    expandedContent: {
        marginTop: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginBottom: 16,
    },
    expandedTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12,
    },
    nutrientsGrid: {
        gap: 12,
    },
    nutrientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    nutrientBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nutrientBadgeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    nutrientInfo: {
        flex: 1,
    },
    nutrientLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 2,
    },
    nutrientValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    infoBox: {
        backgroundColor: '#eff6ff',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    infoText: {
        fontSize: 13,
        color: '#1e40af',
        lineHeight: 18,
    },
});