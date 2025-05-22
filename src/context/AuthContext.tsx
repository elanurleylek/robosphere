// src/context/AuthContext.tsx
import React, { useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
// Gerekli tipleri src/lib/types.ts'den import ediyoruz
import { AuthUser, UserInfoWithToken } from '@/lib/types'; // Yolu kendi yapınıza göre düzeltin
// AuthContext'i src/hooks/useAuth.ts'den import ediyoruz
import { AuthContext } from '@/hooks/useAuth'; // Yolu kendi yapınıza göre düzeltin

interface AuthProviderProps {
  children: ReactNode;
}

// SADECE AuthProvider component'ini export ediyoruz
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfoWithToken | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedUserJson = localStorage.getItem('authUser');
      const storedToken = localStorage.getItem('userToken');

      if (storedUserJson && storedToken) {
        const parsedUser: AuthUser = JSON.parse(storedUserJson);
        if (parsedUser && typeof parsedUser.name === 'string') {
            setUserInfo({ ...parsedUser, token: storedToken });
            setTokenState(storedToken);
        } else {
            console.warn("AuthContext: localStorage'dan okunan kullanıcı 'name' alanı eksik veya hatalı.");
            localStorage.removeItem('authUser');
            localStorage.removeItem('userToken');
            setUserInfo(null);
            setTokenState(null);
        }
      } else {
        localStorage.removeItem('authUser');
        localStorage.removeItem('userToken');
        setUserInfo(null);
        setTokenState(null);
      }
    } catch (error) {
        console.error("AuthContext: localStorage'dan veri okunurken hata:", error);
        localStorage.removeItem('authUser');
        localStorage.removeItem('userToken');
        setUserInfo(null);
        setTokenState(null);
    } finally {
        setLoading(false);
    }
  }, []);

  const login = useCallback((user: AuthUser, receivedToken: string) => {
    if (!user || !receivedToken) {
      console.error("AuthContext: Login sırasında user veya token bulunamadı!");
      return;
    }
    const validatedUser: AuthUser = {
        ...user,
        enrolledCourseIds: Array.isArray(user.enrolledCourseIds) && user.enrolledCourseIds.every(id => typeof id === 'string')
            ? user.enrolledCourseIds
            : []
    };
    if (typeof validatedUser.name !== 'string') {
        console.error("AuthContext (login): validatedUser 'name' alanı eksik veya hatalı!", validatedUser);
    }
    try {
        localStorage.setItem('authUser', JSON.stringify(validatedUser));
        localStorage.setItem('userToken', receivedToken);
        setUserInfo({ ...validatedUser, token: receivedToken });
        setTokenState(receivedToken);
    } catch (error) {
        console.error("AuthContext: localStorage'a veri yazılırken hata:", error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
        localStorage.removeItem('authUser');
        localStorage.removeItem('userToken');
        setUserInfo(null);
        setTokenState(null);
    } catch (error) {
        console.error("AuthContext: localStorage'dan veri silinirken hata:", error);
    }
  }, []);

  const updateUserInfo = useCallback((updatedFields: Partial<AuthUser>) => {
    setUserInfo(prevContextInfo => {
      if (!prevContextInfo) return null;

      const finalUpdatedFields = { ...updatedFields };

      if (finalUpdatedFields.enrolledCourseIds && !finalUpdatedFields.enrolledCourseIds.every(id => typeof id === 'string')) {
          console.error("AuthContext (updateUserInfo): enrolledCourseIds alanı string[] olmalı! Bu alan güncellenmeyecek.");
          delete finalUpdatedFields.enrolledCourseIds;
          if (Object.keys(finalUpdatedFields).length === 0 &&
              Object.keys(updatedFields).length === 1 &&
              Object.prototype.hasOwnProperty.call(updatedFields, 'enrolledCourseIds')) {
            return prevContextInfo;
          }
      }

      const { token: prevToken, ...prevAuthUserEquivalent } = prevContextInfo;
      const updatedAuthUser: AuthUser = {
        ...(prevAuthUserEquivalent as AuthUser),
        ...finalUpdatedFields
      };

      try {
        localStorage.setItem('authUser', JSON.stringify(updatedAuthUser));
      } catch (error) {
        console.error("AuthContext: localStorage'a güncellenmiş authUser yazılırken hata:", error);
      }
      return { ...updatedAuthUser, token: prevToken };
    });
  }, []);

  const value = useMemo(() => ({
    userInfo,
    token: tokenState,
    loading,
    login,
    logout,
    updateUserInfo,
  }), [userInfo, tokenState, loading, login, logout, updateUserInfo]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};