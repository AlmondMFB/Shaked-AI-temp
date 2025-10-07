import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const { theme, toggleTheme, resetToSystem, isSystemTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    
    // Track the toggle action
    trackEvent('dark_mode_toggled', {
      new_theme: theme === 'light' ? 'dark' : 'light',
      previous_theme: theme,
      interaction_method: 'click'
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
      
      trackEvent('dark_mode_toggled', {
        new_theme: theme === 'light' ? 'dark' : 'light',
        previous_theme: theme,
        interaction_method: 'keyboard'
      });
    }
  };

  const handleResetToSystem = () => {
    resetToSystem();
    trackEvent('theme_reset_requested', {
      system_preference: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    });
  };

  return (
    <div className="dark-mode-toggle-container">
      <div className="toggle-group">
        <button
          className={`dark-mode-toggle ${theme}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-pressed={theme === 'dark'}
          role="switch"
          tabIndex={0}
          type="button"
        >
          <div className="toggle-track">
            <div className="toggle-thumb">
              <span className="toggle-icon" role="img" aria-hidden="true">
                {theme === 'light' ? '☀️' : '🌙'}
              </span>
            </div>
          </div>
          <span className="sr-only">
            {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          </span>
        </button>
        
        <div className="toggle-info">
          <span className="current-theme">
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            {isSystemTheme && (
              <span className="system-indicator" title="Following system preference">
                💻
              </span>
            )}
          </span>
          
          {!isSystemTheme && (
            <button 
              className="reset-button"
              onClick={handleResetToSystem}
              title="Reset to system preference"
              aria-label="Reset to system theme preference"
            >
              Reset to System
            </button>
          )}
        </div>
      </div>
      
      {/* Additional toggle options for testing */}
      <div className="toggle-options">
        <div className="option-item">
          <label className="option-label">
            <input
              type="radio"
              name="theme-option"
              value="light"
              checked={theme === 'light'}
              onChange={() => {
                if (theme !== 'light') {
                  toggleTheme();
                }
              }}
            />
            <span className="option-text">☀️ Light</span>
          </label>
        </div>
        
        <div className="option-item">
          <label className="option-label">
            <input
              type="radio"
              name="theme-option"
              value="dark"
              checked={theme === 'dark'}
              onChange={() => {
                if (theme !== 'dark') {
                  toggleTheme();
                }
              }}
            />
            <span className="option-text">🌙 Dark</span>
          </label>
        </div>
        
        <div className="option-item">
          <button
            className="system-button"
            onClick={handleResetToSystem}
            disabled={isSystemTheme}
          >
            💻 System
          </button>
        </div>
      </div>
    </div>
  );
};

export default DarkModeToggle;