// Tipos para autenticação
export interface User {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

// Funções de armazenamento no localStorage
export const authStorage = {
  // Obter todos os usuários registrados
  getUsers: (): User[] => {
    try {
      const users = localStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];
      return parsedUsers;
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      return [];
    }
  },

  // Adicionar novo usuário
  addUser: (user: User): void => {
    try {
      const users = authStorage.getUsers();
      // Verificar se o email já existe
      if (users.some(u => u.email === user.email)) {
        throw new Error('Email já cadastrado');
      }
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      throw error;
    }
  },

  // Buscar usuário por email e senha
  findUser: (email: string, password: string): User | null => {
    try {
      const users = authStorage.getUsers();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);
      
      return foundUser || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  },

  // Salvar usuário autenticado
  setCurrentUser: (user: User): void => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário atual:', error);
    }
  },

  // Obter usuário autenticado atual
  getCurrentUser: (): User | null => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  // Limpar usuário autenticado
  clearCurrentUser: (): void => {
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Erro ao limpar usuário atual:', error);
    }
  },

  // Inicializar com usuário padrão
  initializeDefaultUser: (): void => {
    try {
      const users = authStorage.getUsers();
      const defaultUser: User = {
        name: 'Fiap Pós Tech',
        email: 'fiap@alecrimwallet.com.br',
        password: '1234',
      };
      
      // Procurar se já existe um usuário padrão com esse email
      const existingUserIndex = users.findIndex(u => u.email === 'fiap@alecrimwallet.com.br');
      
      if (existingUserIndex >= 0) {
        // Atualizar usuário existente
        users[existingUserIndex] = defaultUser;
      } else {
        // Adicionar se não existir
        users.push(defaultUser);
      }
      
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao inicializar usuário padrão:', error);
    }
  },
};
