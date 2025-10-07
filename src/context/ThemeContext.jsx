import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackEvent } from '../utils/analytics';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Track theme changes
  useEffect(() => {
    trackEvent('theme_initialized', {
      theme,
      system_theme: systemTheme,
      user_override: localStorage.getItem('theme-preference') !== null
    });
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // If user hasn't manually set a preference, follow system
      if (!localStorage.getItem('theme-preference')) {
        setTheme(newSystemTheme);
        trackEvent('theme_changed', {
          new_theme: newSystemTheme,
          trigger: 'system_change',
          automatic: true
        });
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#ffffff');
    }

    // Save theme preference
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    trackEvent('theme_changed', {
      old_theme: theme,
      new_theme: newTheme,
      trigger: 'user_toggle',
      automatic: false
    });
  };

  const resetToSystem = () => {
    localStorage.removeItem('theme-preference');
    setTheme(systemTheme);
    
    trackEvent('theme_reset_to_system', {
      system_theme: systemTheme,
      previous_theme: theme
    });
  };

  const value = {
    theme,
    systemTheme,
    toggleTheme,
    resetToSystem,
    isSystemTheme: !localStorage.getItem('theme-preference')
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};