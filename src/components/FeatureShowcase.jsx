import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';
import './FeatureShowcase.css';

const FeatureShowcase = () => {
  const { theme } = useTheme();

  const features = [
    {
      id: 'theme-switching',
      title: '🎨 Dynamic Theme Switching',
      description: 'Seamless transition between light and dark modes with CSS custom properties',
      demo: (
        <div className="theme-demo">
          <div className="demo-box light-box">
            <span>Light Theme</span>
          </div>
          <div className="demo-box dark-box">
            <span>Dark Theme</span>
          </div>
        </div>
      )
    },
    {
      id: 'accessibility',
      title: '♿ WCAG 2.1 AA Compliance',
      description: 'High contrast ratios, keyboard navigation, and screen reader support',
      demo: (
        <div className="accessibility-demo">
          <div className="contrast-example">
            <div className="contrast-item">
              <span className="contrast-ratio">21:1</span>
              <span className="contrast-label">Light Mode</span>
            </div>
            <div className="contrast-item">
              <span className="contrast-ratio">18.5:1</span>
              <span className="contrast-label">Dark Mode</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'performance',
      title: '⚡ Performance Optimized',
      description: 'CSS-only animations, efficient re-renders, and minimal bundle size',
      demo: (
        <div className="performance-demo">
          <div className="metric-item">
            <span className="metric-value">< 50ms</span>
            <span className="metric-label">Theme Switch</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">< 2KB</span>
            <span className="metric-label">CSS Bundle</span>
          </div>
        </div>
      )
    },
    {
      id: 'browser-support',
      title: '🌐 Cross-Browser Support',
      description: 'Works on Chrome, Firefox, Safari, and Edge with graceful fallbacks',
      demo: (
        <div className="browser-demo">
          <div className="browser-icons">
            <span className="browser-icon" title="Chrome">🤖</span>
            <span className="browser-icon" title="Firefox">🦊</span>
            <span className="browser-icon" title="Safari">🦁</span>
            <span className="browser-icon" title="Edge">🔶</span>
          </div>
        </div>
      )
    },
    {
      id: 'responsive-design',
      title: '📱 Responsive Design',
      description: 'Optimized for desktop, tablet, and mobile devices',
      demo: (
        <div className="responsive-demo">
          <div className="device desktop" title="Desktop">🖥️</div>
          <div className="device tablet" title="Tablet">📱</div>
          <div className="device mobile" title="Mobile">📱</div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: '📊 Privacy-First Analytics',
      description: 'Local storage only, no external tracking, user consent management',
      demo: (
        <div className="analytics-demo">
          <div className="privacy-badges">
            <span className="badge">🔒 Local Only</span>
            <span className="badge">🚫 No Tracking</span>
          </div>
        </div>
      )
    }
  ];

  const handleFeatureInteraction = (featureId, action) => {
    trackEvent('feature_interaction', {
      feature_id: featureId,
      action: action,
      current_theme: theme
    });
  };

  return (
    <div className="feature-showcase">
      <div className="features-grid">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className="feature-card"
            onClick={() => handleFeatureInteraction(feature.id, 'view')}
            onMouseEnter={() => handleFeatureInteraction(feature.id, 'hover')}
          >
            <div className="feature-header">
              <h3 className="feature-title">{feature.title}</h3>
            </div>
            
            <div className="feature-demo">
              {feature.demo}
            </div>
            
            <div className="feature-description">
              <p>{feature.description}</p>
            </div>
            
            <div className="feature-status">
              <span className="status-badge implemented">✅ Implemented</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Technical Details */}
      <div className="technical-details">
        <h3>Technical Implementation</h3>
        <div className="details-grid">
          <div className="detail-section">
            <h4>CSS Architecture</h4>
            <ul>
              <li>CSS Custom Properties for theming</li>
              <li>Logical property fallbacks</li>
              <li>Reduced motion preferences</li>
              <li>High contrast media queries</li>
            </ul>
          </div>
          
          <div className="detail-section">
            <h4>JavaScript Features</h4>
            <ul>
              <li>React Context for state management</li>
              <li>localStorage persistence</li>
              <li>System preference detection</li>
              <li>Event-driven analytics</li>
            </ul>
          </div>
          
          <div className="detail-section">
            <h4>Accessibility Features</h4>
            <ul>
              <li>ARIA labels and roles</li>
              <li>Keyboard navigation support</li>
              <li>Screen reader announcements</li>
              <li>Focus management</li>
            </ul>
          </div>
          
          <div className="detail-section">
            <h4>Performance Optimizations</h4>
            <ul>
              <li>CSS-only animations</li>
              <li>Efficient re-rendering</li>
              <li>Lazy loading strategies</li>
              <li>Bundle size optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;