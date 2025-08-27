import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a simple session ID that persists for the day
const getSessionId = () => {
  const today = new Date().toDateString();
  const storageKey = `analytics_session_${today}`;
  
  let sessionId = localStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, sessionId);
    
    // Clean up old session IDs
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('analytics_session_') && key !== storageKey) {
        localStorage.removeItem(key);
      }
    });
  }
  
  return sessionId;
};

export const useAnalytics = () => {
  const [sessionId] = useState(getSessionId);

  const trackEvent = useCallback(async (
    eventType: 'page_view' | 'outbound_click' | 'search',
    businessId?: string,
    eventData?: any
  ) => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        business_id: businessId,
        event_data: eventData,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [sessionId]);

  const trackPageView = useCallback((businessId: string, businessName: string) => {
    trackEvent('page_view', businessId, { business_name: businessName });
  }, [trackEvent]);

  const trackOutboundClick = useCallback((
    businessId: string, 
    clickType: 'call' | 'website' | 'directions',
    url?: string
  ) => {
    trackEvent('outbound_click', businessId, { click_type: clickType, url });
  }, [trackEvent]);

  const trackSearch = useCallback((
    query?: string,
    filters?: any,
    resultsCount?: number
  ) => {
    trackEvent('search', undefined, { 
      query, 
      filters, 
      results_count: resultsCount 
    });
  }, [trackEvent]);

  return {
    trackPageView,
    trackOutboundClick,
    trackSearch
  };
};