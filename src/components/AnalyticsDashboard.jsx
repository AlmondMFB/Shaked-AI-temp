import React, { useState, useEffect } from 'react';
import { 
  getAnalyticsData, 
  setAnalyticsConsent, 
  exportAnalyticsData, 
  clearAnalyticsData 
} from '../utils/analytics';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    events: [],
    eventCounts: {},
    sessionStats: null,
    isEnabled: false
  });
  const [consentGiven, setConsentGiven] = useState(false);
  const [filter, setFilter] = useState('');
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    // Load initial data
    updateAnalyticsData();
    
    // Check consent status
    const consent = localStorage.getItem('analytics-consent');
    setConsentGiven(consent === 'true');
    
    // Listen for new analytics events
    const handleAnalyticsEvent = () => {
      updateAnalyticsData();
    };
    
    window.addEventListener('analytics-event', handleAnalyticsEvent);
    
    // Update data every 10 seconds
    const interval = setInterval(updateAnalyticsData, 10000);
    
    return () => {
      window.removeEventListener('analytics-event', handleAnalyticsEvent);
      clearInterval(interval);
    };
  }, []);

  const updateAnalyticsData = () => {
    const data = getAnalyticsData();
    setAnalyticsData(data);
  };

  const handleConsentChange = (enabled) => {
    setAnalyticsConsent(enabled);
    setConsentGiven(enabled);
    updateAnalyticsData();
  };

  const handleExportData = () => {
    const data = exportAnalyticsData();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      clearAnalyticsData();
      updateAnalyticsData();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const filteredEvents = analyticsData.events.filter(event => 
    !filter || event.name.toLowerCase().includes(filter.toLowerCase())
  );

  const topEvents = Object.entries(analyticsData.eventCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  if (!consentGiven) {
    return (
      <div className="analytics-dashboard">
        <div className="consent-section">
          <h3>📊 Analytics Dashboard</h3>
          <div className="consent-card">
            <h4>Privacy-First Analytics</h4>
            <p>
              This application uses privacy-compliant analytics that stores data locally on your device. 
              No data is sent to external servers.
            </p>
            <div className="consent-features">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>All data stored locally</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚫</span>
                <span>No external tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🗑️</span>
                <span>Easy to delete anytime</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Helps improve user experience</span>
              </div>
            </div>
            <div className="consent-actions">
              <button 
                className="consent-button accept"
                onClick={() => handleConsentChange(true)}
              >
                Enable Analytics
              </button>
              <button 
                className="consent-button decline"
                onClick={() => handleConsentChange(false)}
              >
                Keep Disabled
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h3>📊 Analytics Dashboard</h3>
        <div className="dashboard-actions">
          <button 
            className="action-button export"
            onClick={handleExportData}
            title="Export analytics data as JSON"
          >
            📄 Export Data
          </button>
          <button 
            className="action-button clear"
            onClick={handleClearData}
            title="Clear all analytics data"
          >
            🗑️ Clear Data
          </button>
          <button 
            className="action-button disable"
            onClick={() => handleConsentChange(false)}
            title="Disable analytics"
          >
            🔒 Disable
          </button>
        </div>
      </div>

      {/* Session Stats */}
      {analyticsData.sessionStats && (
        <div className="stats-section">
          <h4>Current Session</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Duration</span>
              <span className="stat-value">
                {formatDuration(analyticsData.sessionStats.duration)}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Events</span>
              <span className="stat-value">
                {analyticsData.sessionStats.eventCount}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Events</span>
              <span className="stat-value">
                {analyticsData.events.length}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Session ID</span>
              <span className="stat-value session-id">
                {analyticsData.sessionStats.sessionId.split('_')[1]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Events */}
      {topEvents.length > 0 && (
        <div className="top-events-section">
          <h4>Top Events</h4>
          <div className="events-chart">
            {topEvents.map(([eventName, count]) => (
              <div key={eventName} className="event-bar">
                <span className="event-name">{eventName}</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${(count / topEvents[0][1]) * 100}%` 
                    }}
                  ></div>
                  <span className="event-count">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="events-section">
        <div className="events-header">
          <h4>Recent Events</h4>
          <input
            type="text"
            placeholder="Filter events..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="events-list">
          {filteredEvents.length === 0 ? (
            <div className="no-events">
              <p>No events to display</p>
              {filter && (
                <p className="filter-hint">
                  Try clearing the filter or interact with the application to generate events.
                </p>
              )}
            </div>
          ) : (
            filteredEvents.slice(0, 20).map((event) => (
              <div key={event.id} className="event-item">
                <div 
                  className="event-summary"
                  onClick={() => setExpandedEvent(
                    expandedEvent === event.id ? null : event.id
                  )}
                >
                  <span className="event-name">{event.name}</span>
                  <span className="event-time">{formatTimestamp(event.timestamp)}</span>
                  <span className="expand-icon">
                    {expandedEvent === event.id ? '▼' : '▶'}
                  </span>
                </div>
                
                {expandedEvent === event.id && (
                  <div className="event-details">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <strong>Session:</strong> {event.sessionId.split('_')[1]}
                      </div>
                      <div className="detail-item">
                        <strong>URL:</strong> {event.url}
                      </div>
                      <div className="detail-item">
                        <strong>Viewport:</strong> {event.viewport.width}x{event.viewport.height}
                      </div>
                      <div className="detail-item">
                        <strong>Screen:</strong> {event.screen.width}x{event.screen.height}
                      </div>
                    </div>
                    
                    {Object.keys(event.data).length > 0 && (
                      <div className="event-data">
                        <strong>Event Data:</strong>
                        <pre>{JSON.stringify(event.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;