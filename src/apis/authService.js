import axiosClient from './axiosClient';

const authService = {
  /**
   * POST /auth/login
   * Body: { email, password }
   * Response: { success, message, data: { token, user } }
   */
  login: (credentials) => axiosClient.post('/auth/login', credentials),

  /**
   * POST /auth/register
   * Body: { name, email, password, password_confirmation, phone }
   * Response: { success, message, data: { token, user } }
   */
  register: (data) => axiosClient.post('/auth/register', data),

  /**
   * POST /auth/logout
   * Header: Authorization Bearer {token}
   * Response: { success, message }
   */
  logout: () => axiosClient.post('/auth/logout'),

  /**
   * GET /auth/me
   * Header: Authorization Bearer {token}
   * Response: { success, data: { id, name, email, phone, address, avatar } }
   */
  getProfile: () => axiosClient.get('/auth/me'),

  /**
   * PUT /auth/profile
   * Body: { name, phone, address }
   * Response: { success, message, data: user }
   */
  updateProfile: (data) => axiosClient.put('/auth/profile', data),

  /**
   * PUT /auth/change-password
   * Body: { current_password, password, password_confirmation }
   * Response: { success, message }
   */
  changePassword: (data) => axiosClient.put('/auth/change-password', data),
};

export default authService;
