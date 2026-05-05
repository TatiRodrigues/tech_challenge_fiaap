'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, authStorage } from '@/app/servicos/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carregar usuário ao inicializar (apenas no cliente)
  useEffect(() => {
    console.log('DEBUG - AuthProvider iniciando');
    authStorage.initializeDefaultUser();
    const currentUser = authStorage.getCurrentUser();
    console.log('DEBUG - Usuário atual recuperado:', currentUser);
    setUser(currentUser);
    setIsHydrated(true);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    console.log('DEBUG - Iniciando login com:', { email, password });
    const foundUser = authStorage.findUser(email, password);
    console.log('DEBUG - Usuário encontrado:', foundUser);
    
    if (!foundUser) {
      console.error('DEBUG - Usuário não encontrado, lançando erro');
      throw new Error('Email ou senha inválidos');
    }
    
    console.log('DEBUG - Salvando usuário atual...');
    authStorage.setCurrentUser(foundUser);
    console.log('DEBUG - Atualizando state com usuário:', foundUser);
    setUser(foundUser);
    console.log('DEBUG - Login realizado com sucesso');
  };

  const logout = (): void => {
    authStorage.clearCurrentUser();
    setUser(null);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const newUser: User = { name, email, password };
      authStorage.addUser(newUser);
      authStorage.setCurrentUser(newUser);
      setUser(newUser);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao registrar usuário');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  // Se não estiver dentro do provider, retornar um stub
  if (context === undefined) {
    return {
      user: null,
      login: async (email: string, password: string) => {
        throw new Error('AuthProvider não está inicializado');
      },
      logout: () => {},
      register: async (name: string, email: string, password: string) => {
        throw new Error('AuthProvider não está inicializado');
      },
    } as AuthContextType;
  }
  
  return context;
}
