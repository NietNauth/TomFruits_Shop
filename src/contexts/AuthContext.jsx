import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { storage } from '../utils/storage';
import authService from '../apis/authService';
import cartService from '../apis/cartService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      // res = { success, data: { token, user } }
      const { access_token, user: userData } = res.data;
      storage.setToken(access_token);
      storage.setUser(userData);
      setUser(userData);
      
      // Sync cart after login
      try {
        await cartService.syncLocalCartToServer();
      } catch (err) {
        console.error('Cart sync failed:', err);
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Đăng nhập thất bại' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      const { access_token, user: userData } = res.data;
      storage.setToken(access_token);
      storage.setUser(userData);
      setUser(userData);

      // Sync cart after register
      try {
        await cartService.syncLocalCartToServer();
      } catch (err) {
        console.error('Cart sync failed:', err);
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Đăng ký thất bại' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore error, vẫn xóa local
    }
    storage.logout();
    storage.clearCart();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
