// Privacy-compliant analytics system
// No external services, all data stored locally

class Analytics {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.isEnabled = this.checkConsent();
    
    // Load existing events from localStorage
    this.loadStoredEvents();
    
    // Set up periodic saving
    this.setupPeriodicSave();
    
    // Track page visibility changes
    this.setupVisibilityTracking();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  checkConsent() {
    const consent = localStorage.getItem('analytics-consent');
    return consent === 'true';
  }

  setConsent(enabled) {
    localStorage.setItem('analytics-consent', enabled.toString());
    this.isEnabled = enabled;
    
    if (!enabled) {
      // Clear stored events if consent is withdrawn
      this.events = [];
      localStorage.removeItem('analytics-events');
    }
  }

  loadStoredEvents() {
    if (!this.isEnabled) return;
    
    try {
      const stored = localStorage.getItem('analytics-events');
      if (stored) {
        this.events = JSON.parse(stored);
        // Keep only recent events (last 30 days)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        this.events = this.events.filter(event => event.timestamp > thirtyDaysAgo);
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error);
      this.events = [];
    }
  }

  saveEvents() {
    if (!this.isEnabled || this.events.length === 0) return;
    
    try {
      localStorage.setItem('analytics-events', JSON.stringify(this.events));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  setupPeriodicSave() {
    // Save events every 30 seconds
    setInterval(() => {
      this.saveEvents();
    }, 30000);
    
    // Save on page unload
    window.addEventListener('beforeunload', () => {
      this.saveEvents();
    });
  }

  setupVisibilityTracking() {
    let visibilityStart = Date.now();
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page became hidden
        const visibleTime = Date.now() - visibilityStart;
        this.trackEvent('page_visibility_hidden', {
          visible_duration: visibleTime,
          timestamp: new Date().toISOString()
        });
      } else {
        // Page became visible
        visibilityStart = Date.now();
        this.trackEvent('page_visibility_visible', {
          timestamp: new Date().toISOString()
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  trackEvent(eventName, eventData = {}) {
    if (!this.isEnabled) return;
    
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: eventName,
      data: eventData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height
      }
    };
    
    this.events.push(event);
    
    // Limit events to prevent memory issues (keep last 1000 events)
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
    
    // Trigger custom event for real-time updates
    window.dispatchEvent(new CustomEvent('analytics-event', { detail: event }));
  }

  getEvents(filters = {}) {
    if (!this.isEnabled) return [];
    
    let filteredEvents = [...this.events];
    
    // Apply filters
    if (filters.eventName) {
      filteredEvents = filteredEvents.filter(event => 
        event.name.includes(filters.eventName)
      );
    }
    
    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(event => 
        event.timestamp >= new Date(filters.startDate).getTime()
      );
    }
    
    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(event => 
        event.timestamp <= new Date(filters.endDate).getTime()
      );
    }
    
    return filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
  }

  getEventCounts() {
    if (!this.isEnabled) return {};
    
    const counts = {};
    this.events.forEach(event => {
      counts[event.name] = (counts[event.name] || 0) + 1;
    });
    
    return counts;
  }

  getSessionStats() {
    if (!this.isEnabled) return null;
    
    const sessionEvents = this.events.filter(event => event.sessionId === this.sessionId);
    const currentTime = Date.now();
    
    return {
      sessionId: this.sessionId,
      duration: currentTime - this.startTime,
      eventCount: sessionEvents.length,
      startTime: this.startTime,
      events: sessionEvents
    };
  }

  exportData() {
    if (!this.isEnabled) return null;
    
    const exportData = {
      exportDate: new Date().toISOString(),
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      events: this.events,
      summary: {
        eventCounts: this.getEventCounts(),
        sessionStats: this.getSessionStats()
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  clearData() {
    this.events = [];
    localStorage.removeItem('analytics-events');
    this.trackEvent('analytics_data_cleared', {
      timestamp: new Date().toISOString()
    });
  }

  // Performance monitoring
  trackPerformance(metricName, value, unit = 'ms') {
    this.trackEvent('performance_metric', {
      metric: metricName,
      value: value,
      unit: unit,
      timestamp: new Date().toISOString()
    });
  }

  // Error tracking
  trackError(error, context = {}) {
    this.trackEvent('error_occurred', {
      message: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString()
    });
  }

  // User interaction tracking
  trackInteraction(element, action, details = {}) {
    this.trackEvent('user_interaction', {
      element: element,
      action: action,
      details: details,
      timestamp: new Date().toISOString()
    });
  }
}

// Create global analytics instance
const analytics = new Analytics();

// Export functions for use in components
export const trackEvent = (eventName, eventData) => {
  analytics.trackEvent(eventName, eventData);
};

export const trackPerformance = (metricName, value, unit) => {
  analytics.trackPerformance(metricName, value, unit);
};

export const trackError = (error, context) => {
  analytics.trackError(error, context);
};

export const trackInteraction = (element, action, details) => {
  analytics.trackInteraction(element, action, details);
};

export const getAnalyticsData = () => {
  return {
    events: analytics.getEvents(),
    eventCounts: analytics.getEventCounts(),
    sessionStats: analytics.getSessionStats(),
    isEnabled: analytics.isEnabled
  };
};

export const setAnalyticsConsent = (enabled) => {
  analytics.setConsent(enabled);
};

export const exportAnalyticsData = () => {
  return analytics.exportData();
};

export const clearAnalyticsData = () => {
  analytics.clearData();
};

export default analytics;