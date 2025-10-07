import { useThemeContext } from '../context/ThemeContext';

/**
 * Custom hook for theme management
 * Provides easy access to theme state and controls
 */
export const useTheme = () => {
  return useThemeContext();
};

export default useTheme;