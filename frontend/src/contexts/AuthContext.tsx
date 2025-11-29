import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_STORAGE_KEY = '@FarmPulse:token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar token do AsyncStorage ao inicializar
  useEffect(() => {
    loadStoredToken();
  }, []);

  const loadStoredToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        setTokenState(storedToken);
        console.log('Token recuperado do storage');
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setToken = async (newToken: string | null) => {
    try {
      if (newToken) {
        // Salvar token no AsyncStorage
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        console.log('Token salvo no storage');
      } else {
        // Remover token do AsyncStorage
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        console.log('Token removido do storage');
      }
      setTokenState(newToken);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
      // Mesmo com erro, atualizar o estado local
      setTokenState(newToken);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      console.log('Logout realizado - token removido');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
