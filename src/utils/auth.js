/**
 * Utility functions for authentication
 */

/**
 * Get authentication token from localStorage
 * @returns {string|null} The stored authentication token or null if not found
 */
export const getToken = () => {
    return localStorage.getItem('authToken');
  };
  
  /**
   * Set authentication token in localStorage
   * @param {string} token - The authentication token to store
   */
  export const setToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  /**
   * Remove authentication token from localStorage
   */
  export const removeToken = () => {
    localStorage.removeItem('authToken');
  };
  
  /**
   * Get user data from localStorage
   * @returns {object|null} The stored user data or null if not found
   */
  export const getUser = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };
  
  /**
   * Set user data in localStorage
   * @param {object} user - The user data to store
   */
  export const setUser = (user) => {
    localStorage.setItem('userData', JSON.stringify(user));
  };
  
  /**
   * Remove user data from localStorage
   */
  export const removeUser = () => {
    localStorage.removeItem('userData');
  };
  
  /**
   * Get authorization header with JWT token
   * @returns {object} Object containing Authorization header with Bearer token
   */
  export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  /**
   * Check if user is an admin
   * @returns {boolean} True if user is an admin
   */
  export const isAdmin = () => {
    const user = getUser();
    return user && user.role === 'admin';
  };
  
  /**
   * Clear all authentication data from localStorage
   */
  export const clearAuth = () => {
    removeToken();
    removeUser();
  };