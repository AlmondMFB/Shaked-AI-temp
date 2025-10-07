import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import DarkModeToggle from './components/DarkModeToggle';
import MetricsDashboard from './components/MetricsDashboard';
import { initCompatibility } from './utils/compatibility-utils';
import { addSkipLink } from './utils/a11y-utils';

// Import styles
import './styles/themes.css';
import './styles/global.css';
import './styles/accessibility.css';

/**
 * Main App Component
 * Demonstrates the Dark Mode Toggle implementation with all features
 */
function App() {
  React.useEffect(() => {
    // Initialize browser compatibility features
    initCompatibility();
    
    // Add skip link for accessibility
    addSkipLink('main-content', 'Skip to main content');
  }, []);

  return (
    <ThemeProvider>
      <div className="App">
        {/* Header with Dark Mode Toggle */}
        <header className="app-header">
          <h1 className="header-title">Dark Mode Toggle Demo</h1>
          <div className="header-controls">
            <DarkModeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="main-content">
          <div className="card">
            <h2>🌙 Dark Mode Toggle Feature</h2>
            <p>
              This demo showcases a fully accessible dark mode toggle implementation 
              with comprehensive analytics, cross-browser support, and WCAG 2.1 AA compliance.
            </p>
            
            <h3>Features Implemented:</h3>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>✅ Toggle UI Component with Sun/Moon icons</li>
              <li>✅ Theme Context and State Management</li>
              <li>✅ Light/Dark Theme Styles with proper contrast</li>
              <li>✅ Full Accessibility Support (WCAG 2.1 AA)</li>
              <li>✅ Cross-browser Compatibility</li>
              <li>✅ Analytics and Success Metrics</li>
              <li>✅ Local Storage Persistence</li>
              <li>✅ System Preference Detection</li>
              <li>✅ Keyboard Navigation</li>
              <li>✅ Screen Reader Support</li>
            </ul>

            <h3>Try It Out:</h3>
            <div style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                Use the toggle in the top-right corner to switch themes. 
                You can also use keyboard navigation (Tab to focus, Enter/Space to toggle).
              </p>
              
              <div className="demo-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn">Sample Button</button>
                <button className="btn" style={{ background: 'var(--focus-color)', color: 'white' }}>
                  Primary Button
                </button>
              </div>
              
              <div className="card" style={{ marginTop: '1rem', padding: '1rem' }}>
                <h4>Nested Card Example</h4>
                <p>This demonstrates how the theme system works across nested components.</p>
              </div>
            </div>

            <h3>Analytics Dashboard:</h3>
            <p>
              Click the 📊 button in the bottom-right corner to view real-time metrics 
              including adoption rates, performance data, and usage patterns.
            </p>

            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              background: 'var(--bg-secondary)', 
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)'
            }}>
              <h4>🎯 Success Metrics Targets:</h4>
              <ul style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                <li>Feature adoption rate: 30%+ within first month</li>
                <li>Theme switch performance: &lt;100ms</li>
                <li>User satisfaction rating: 4.0+ out of 5</li>
                <li>Accessibility compliance: WCAG 2.1 AA</li>
                <li>Cross-browser support: Chrome, Firefox, Safari, Edge</li>
              </ul>
            </div>
          </div>
        </main>

        {/* Metrics Dashboard */}
        <MetricsDashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;