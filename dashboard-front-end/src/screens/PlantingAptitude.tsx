import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Crop {
    name: string;
    aptitude: number;
    icon: string;
}

export default function PlantingAptitude() {
    const crops: Crop[] = [
        { name: "Trigo", aptitude: 86, icon: "🌾" },
        { name: "Milho", aptitude: 78, icon: "🌽" },
        { name: "Soja", aptitude: 72, icon: "🫘" },
        { name: "Arroz", aptitude: 65, icon: "🌾" },
        { name: "Feijão", aptitude: 58, icon: "🫘" },
        { name: "Algodão", aptitude: 45, icon: "☁️" },
    ];

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
                    Compatibilidade do solo com diferentes cultivos
                </Text>
            </View>

            {/* Crops List */}
            <View style={styles.cropsSection}>
                {crops.map((crop) => (
                    <View key={crop.name} style={styles.cropCard}>
                        <View style={styles.cropContent}>
                            {/* Icon */}
                            <View style={styles.iconCircle}>
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
                            <View style={styles.progressContainer}>
                                <MiniProgress value={crop.aptitude} />
                            </View>
                        </View>
                    </View>
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
});