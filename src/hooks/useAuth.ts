// src/hooks/useAuth.ts
import { createContext, useContext } from 'react';
// Tipleri src/lib/types.ts'den import ediyoruz
import { AuthContextType } from '@/lib/types'; // Yolu kendi yapınıza göre düzeltin

// AuthContext'i burada oluşturup export ediyoruz
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// useAuth hook'u burada tanımlanıyor ve export ediliyor
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth, bir AuthProvider içinde kullanılmalıdır');
  }
  return context;
};