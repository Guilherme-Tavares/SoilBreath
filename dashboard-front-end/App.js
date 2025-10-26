import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';

// Screens
import Dashboard from './screens/Dashboard';
import PlantingAptitude from './screens/PlantingAptitude';
import History from './screens/History';

// Components
import { BottomNav } from './components/BottomNav';

const Stack = createNativeStackNavigator();

// Componente que envolve cada tela com o BottomNav
const ScreenWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
      <BottomNav />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName="Dashboard"
      >
        <Stack.Screen name="Dashboard">
          {() => (
            <ScreenWrapper>
              <Dashboard />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="PlantingAptitude">
          {() => (
            <ScreenWrapper>
              <PlantingAptitude />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="History">
          {() => (
            <ScreenWrapper>
              <History />
            </ScreenWrapper>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default App;