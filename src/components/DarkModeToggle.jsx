import React from 'react';
import { useTheme } from '../hooks/useTheme';
import styles from './DarkModeToggle.module.css';

/**
 * Dark Mode Toggle Component
 * Provides a toggle switch to switch between light and dark themes
 * Features: checkbox-style UI, sun/moon icons, tooltip, smooth transitions
 */
const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    toggleTheme();
    
    // Analytics tracking (Issue #6)
    if (window.analytics) {
      window.analytics.track(isDark ? 'dark_mode_disabled' : 'dark_mode_enabled', {
        timestamp: new Date().toISOString(),
        previousTheme: theme
      });
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <label 
        className={styles.toggleLabel}
        htmlFor="dark-mode-toggle"
        title="Toggle Dark Mode"
      >
        {/* Sun Icon for Light Mode */}
        <span 
          className={`${styles.icon} ${styles.sunIcon} ${!isDark ? styles.active : ''}`}
          aria-hidden="true"
        >
          ☀️
        </span>
        
        {/* Toggle Switch */}
        <input
          id="dark-mode-toggle"
          type="checkbox"
          checked={isDark}
          onChange={handleToggle}
          className={styles.toggleInput}
          aria-label="Toggle dark mode"
          role="switch"
          aria-checked={isDark}
        />
        
        <span className={styles.toggleSlider}></span>
        
        {/* Moon Icon for Dark Mode */}
        <span 
          className={`${styles.icon} ${styles.moonIcon} ${isDark ? styles.active : ''}`}
          aria-hidden="true"
        >
          🌙
        </span>
      </label>
      
      {/* Screen Reader Text */}
      <span className="sr-only">
        {isDark ? 'Dark mode is enabled' : 'Light mode is enabled'}
      </span>
    </div>
  );
};

export default DarkModeToggle;