import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

export const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navItems = [
    { screen: 'PlantingAptitude', icon: 'bar-chart-2', label: 'Aptidão' },
    { screen: 'Dashboard', icon: 'sun', label: 'Dashboard' },
    { screen: 'History', icon: 'clock', label: 'Histórico' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {navItems.map((item, index) => {
          const isActive = route.name === item.screen;
          const isCenter = item.screen === 'Dashboard';

          return (
            <TouchableOpacity
              key={item.screen}
              onPress={() => navigation.navigate(item.screen)}
              style={[
                styles.navItem,
                isCenter && styles.centerItem
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.iconContainerActive,
                  isCenter && styles.iconContainerCenter
                ]}
              >
                <Icon
                  name={item.icon}
                  size={isCenter ? 28 : 24}
                  color={isActive ? '#ffffff' : '#8e8e93'}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingBottom: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    maxWidth: 448,
    alignSelf: 'center',
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerItem: {
    marginTop: -8,
  },
  iconContainer: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ scale: 1.1 }],
  },
  iconContainerCenter: {
    padding: 16,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
    color: '#8e8e93',
  },
  labelActive: {
    color: '#007AFF',
  },
});