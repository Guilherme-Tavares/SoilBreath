import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const History = () => {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
        <Text style={styles.headerSubtitle}>
          Acompanhe as mudanças nos nutrientes
        </Text>
      </View>

      {/* Content */}
      <View style={styles.emptyStateContainer}>
        <View style={styles.iconCircle}>
          <Icon name="clock" size={40} color="#007AFF" />
        </View>
        
        <Text style={styles.emptyTitle}>
          Em Desenvolvimento
        </Text>
        
        <Text style={styles.emptyDescription}>
          O histórico de alterações dos nutrientes ainda não está disponível. 
          Em breve você poderá acompanhar a evolução da qualidade do solo ao longo do tempo.
        </Text>
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
  contentContainer: {
    flexGrow: 1,
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
  emptyStateContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default History;