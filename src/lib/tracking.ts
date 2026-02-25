// Tracking utilities for Google Ads and GA4

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

// Track WhatsApp click
export const trackWhatsAppClick = (source: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'lead_whatsapp',
      source: source, // 'botica', 'bodega', 'home'
      conversion_label: 'whatsapp_click'
    })
    
    // Google Ads conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion ID
        event_category: 'Lead',
        event_label: source
      })
    }
  }
}

// Track demo view
export const trackDemoView = (source: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'view_demo',
      source: source,
      conversion_label: 'demo_view'
    })
  }
}

// Track signup complete
export const trackSignupComplete = (businessType: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'signup_complete',
      business_type: businessType,
      conversion_label: 'signup'
    })
    
    // Google Ads conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/SIGNUP_LABEL', // Replace with actual conversion ID
        event_category: 'Signup',
        event_label: businessType
      })
    }
  }
}

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'scroll_depth',
      scroll_percentage: depth
    })
  }
}

// Track time on page
export const trackTimeOnPage = (seconds: number) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'time_on_page',
      time_seconds: seconds
    })
  }
}

// Track page view for remarketing
export const trackPageView = (pagePath: string, pageType: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: pagePath,
      page_type: pageType // 'botica', 'bodega', 'home', 'demo'
    })
  }
}

// Track modal open
export const trackModalOpen = (modalType: string, source: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'modal_open',
      modal_type: modalType,
      source: source
    })
  }
}

// Track CTA click
export const trackCTAClick = (ctaText: string, ctaLocation: string, destination: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'cta_click',
      cta_text: ctaText,
      cta_location: ctaLocation,
      destination: destination
    })
  }
}
