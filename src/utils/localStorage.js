/**
 * Local Storage utilities for theme persistence
 * Handles saving and retrieving theme preferences
 */

const THEME_KEY = 'app-theme-preference';

/**
 * Get stored theme preference from localStorage
 * @returns {string|null} - 'light', 'dark', or null if not set
 */
export const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch (error) {
    console.warn('Error reading theme from localStorage:', error);
    return null;
  }
};

/**
 * Store theme preference in localStorage
 * @param {string} theme - 'light' or 'dark'
 */
export const setStoredTheme = (theme) => {
  try {
    if (theme === 'light' || theme === 'dark') {
      localStorage.setItem(THEME_KEY, theme);
    }
  } catch (error) {
    console.warn('Error saving theme to localStorage:', error);
  }
};

/**
 * Remove theme preference from localStorage
 */
export const clearStoredTheme = () => {
  try {
    localStorage.removeItem(THEME_KEY);
  } catch (error) {
    console.warn('Error clearing theme from localStorage:', error);
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};