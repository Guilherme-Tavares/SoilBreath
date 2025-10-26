import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RadialProgress } from '../components/RadialProgress';
import { NutrientCard } from '../components/NutrientCard';

export default function Dashboard() {
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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Análise de Solo</Text>
                <Text style={styles.headerSubtitle}>Cultivo: {cropType}</Text>
            </View>

            {/* Radial Progress Card */}
            <View style={styles.progressCard}>
                <View style={styles.progressContent}>
                    <RadialProgress value={soilAptitude} size={180} strokeWidth={12} />
                    <Text style={styles.progressTitle}>Aptidão do Solo</Text>
                    <Text style={styles.progressSubtitle}>Para cultivo de {cropType}</Text>
                </View>

                {/* Environmental Data */}
                <View style={styles.environmentalGrid}>
                    <View style={styles.environmentalCard}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="water" size={20} color="#3b82f6" />
                        </View>
                        <View>
                            <Text style={styles.environmentalLabel}>Umidade</Text>
                            <Text style={styles.environmentalValue}>{humidity}%</Text>
                        </View>
                    </View>

                    <View style={styles.environmentalCard}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="thermometer" size={20} color="#3b82f6" />
                        </View>
                        <View>
                            <Text style={styles.environmentalLabel}>Temperatura</Text>
                            <Text style={styles.environmentalValue}>{temperature}°C</Text>
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