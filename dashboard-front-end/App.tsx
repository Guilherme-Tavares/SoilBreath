import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoginScreen from './src/screens/Login';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { apiClient } from './src/api/client';

function AppContent() {
  const { token, logout, isLoading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Atualizar estado de autenticação quando o token mudar
  useEffect(() => {
    if (token) {
      // Configurar token no cliente API
      apiClient.setToken(token);
      setIsAuthenticated(true);
    } else {
      apiClient.setToken(null);
      setIsAuthenticated(false);
    }
  }, [token]);

  // Configurar callback para quando o token expirar
  useEffect(() => {
    apiClient.setTokenExpiredCallback(() => {
      logout();
      setIsAuthenticated(false);
    });
  }, [logout]);

  const handleLoginSuccess = () => {
    // A autenticação já é gerenciada pelo token no contexto
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  // Mostrar loading enquanto verifica o token armazenado
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <BottomTabNavigator />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
        <AppContent />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});