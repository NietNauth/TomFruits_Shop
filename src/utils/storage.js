const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const storage = {
  // Token
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  // User
  getUser: () => {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  // Auth
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Cart (giữ nguyên logic localStorage cho cart local)
  getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
  setCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
  clearCart: () => localStorage.removeItem('cart'),
};
