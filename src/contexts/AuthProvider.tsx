import { useState, type PropsWithChildren } from 'react';

import { AuthContext } from './AuthContext';
import { predefinedUsers } from '../data/users';
import type { User } from '../types/User';

const storageKey = 'movies_current_user';

const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem(storageKey);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);

  const login = (email: string, password: string) => {
    const user = predefinedUsers.find(
      (predefinedUser) =>
        predefinedUser.email.toLowerCase() === email.trim().toLowerCase() &&
        predefinedUser.password === password,
    );

    if (!user) {
      return null;
    }

    setCurrentUser(user);
    localStorage.setItem(storageKey, JSON.stringify(user));

    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(storageKey);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
