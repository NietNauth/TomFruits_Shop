// const TOKEN_KEY = 'token';
// const USER_KEY = 'user';

// export const storage = {
//   // Token
//   getToken: () => localStorage.getItem(TOKEN_KEY),
//   setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
//   removeToken: () => localStorage.removeItem(TOKEN_KEY),

//   // User
//   getUser: () => {
//     const u = localStorage.getItem(USER_KEY);
//     return u ? JSON.parse(u) : null;
//   },
//   setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
//   removeUser: () => localStorage.removeItem(USER_KEY),

//   // Auth
//   isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
//   logout: () => {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//   },

//   // Cart (giữ nguyên logic localStorage cho cart local)
//   getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
//   setCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
//   clearCart: () => localStorage.removeItem('cart'),
// };
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    const u = localStorage.getItem(USER_KEY);

    if (!u || u === 'undefined' || u === 'null') return null;

    try {
      return JSON.parse(u);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser: (user) => {
    if (!user) {
      localStorage.removeItem(USER_KEY);
      return;
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: () => localStorage.removeItem(USER_KEY),

  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCart: () => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  },
  setCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
  clearCart: () => localStorage.removeItem('cart'),
};
