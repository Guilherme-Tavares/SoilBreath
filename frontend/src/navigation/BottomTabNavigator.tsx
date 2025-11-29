import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

// Screens
import DashboardScreen from '../screens/Dashboard';
import PlantingAptitudeScreen from '../screens/PlantingAptitude';
import HistoryScreen from '../screens/History';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Aptidão') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Histórico') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: insets.bottom,
          paddingTop: 8,
          height: 60 + insets.bottom,
        },
        headerShown: false,
      })}
      initialRouteName="Dashboard"
      screenListeners={{
        state: (e) => {
          // Atualizar título da página no navegador baseado na rota ativa
          if (Platform.OS === 'web') {
            const state = e.data.state;
            const routeName = state.routes[state.index].name;
            let title = 'Soil Brief';
            
            switch(routeName) {
              case 'Dashboard':
                title = 'Soil Brief - Análise de Solo';
                break;
              case 'Aptidão':
                title = 'Soil Brief - Aptidão dos Plantios';
                break;
              case 'Histórico':
                title = 'Soil Brief - Histórico';
                break;
            }
            
            document.title = title;
          }
        },
      }}
    >
      <Tab.Screen name="Aptidão" component={PlantingAptitudeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Histórico" component={HistoryScreen} />
    </Tab.Navigator>
  );
}