import { usePostHog } from 'posthog-js/react'

// Hook to get PostHog instance
export const useTracking = () => {
  const posthog = usePostHog()

  return {
    trackEvent: (eventName, properties = {}) => {
      if (posthog) {
        posthog.capture(eventName, properties)
      }
    },

    identifyUser: (userId, userProperties = {}) => {
      if (posthog && userId) {
        posthog.identify(userId, userProperties)
      }
    },

    resetUser: () => {
      if (posthog) {
        posthog.reset()
      }
    },

    trackProfileView: (customerId) => {
      if (posthog) {
        posthog.capture('profile_viewed', { customer_id: customerId })
      }
    },

    trackProfileEdit: (customerId, fieldsEdited) => {
      if (posthog) {
        posthog.capture('profile_edited', {
          customer_id: customerId,
          fields_edited: fieldsEdited,
        })
      }
    },

    trackTipClick: (tipTitle, productLink) => {
      if (posthog) {
        posthog.capture('tip_clicked', {
          tip_title: tipTitle,
          product_link: productLink,
        })
      }
    },

    trackEventView: (eventTitle, eventType) => {
      if (posthog) {
        posthog.capture('event_viewed', {
          event_title: eventTitle,
          event_type: eventType,
        })
      }
    },

    trackLogin: (customerId) => {
      if (posthog) {
        posthog.capture('user_logged_in', { customer_id: customerId })
      }
    },

    trackLogout: () => {
      if (posthog) {
        posthog.capture('user_logged_out')
        posthog.reset()
      }
    },
  }
}
