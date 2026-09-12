import { createContext } from 'react';

import type { User } from '../types/User';

export interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => User | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
