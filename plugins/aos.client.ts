import { defineNuxtPlugin } from '#app'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Initialize AOS when DOM is ready
    const initAOS = () => {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true, // Animation only happens once
        offset: 100, // Offset (in px) from the original trigger point
        delay: 0,
        disable: false,
        startEvent: 'DOMContentLoaded',
      })
    }

    // Initialize immediately if DOM is already loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAOS)
    } else {
      initAOS()
    }

    // Refresh AOS on route changes
    nuxtApp.hook('page:finish', () => {
      setTimeout(() => {
        AOS.refresh()
      }, 200)
    })

    // Refresh on window load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        AOS.refresh()
      })
    }
  }
})

