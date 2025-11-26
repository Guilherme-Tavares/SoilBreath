import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Cultura {
  id: number;
  nome: string;
  icon: string;
}

interface CultureSelectorModalProps {
  visible: boolean;
  cultures: Cultura[];
  selectedCultureId: number | null;
  onSelect: (culturaId: number) => void;
  onClose: () => void;
}

export default function CultureSelectorModal({
  visible,
  cultures,
  selectedCultureId,
  onSelect,
  onClose,
}: CultureSelectorModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Selecionar Cultura</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Cultures List */}
              <ScrollView style={styles.culturesList}>
                {cultures.map((culture) => (
                  <TouchableOpacity
                    key={culture.id}
                    style={[
                      styles.cultureItem,
                      selectedCultureId === culture.id && styles.cultureItemSelected,
                    ]}
                    onPress={() => {
                      onSelect(culture.id);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cultureIconContainer}>
                      <Text style={styles.cultureIcon}>{culture.icon}</Text>
                    </View>
                    <Text
                      style={[
                        styles.cultureName,
                        selectedCultureId === culture.id && styles.cultureNameSelected,
                      ]}
                    >
                      {culture.nome}
                    </Text>
                    {selectedCultureId === culture.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  culturesList: {
    padding: 12,
  },
  cultureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
  },
  cultureItemSelected: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  cultureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cultureIcon: {
    fontSize: 24,
  },
  cultureName: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  cultureNameSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});
