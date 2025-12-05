import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    gsap.registerPlugin(ScrollTrigger)

    nuxtApp.vueApp.directive('gsap', {
      mounted(el, binding) {
        const opts = binding?.value || {}
        const {
          y = 30,
          opacity = 0,
          duration = 0.8,
          delay = 0,
          ease = 'power2.out'
        } = opts

        gsap.set(el, { opacity, y })
        const startPos = 'top 90%'
        const animateIn = () => gsap.to(el, { opacity: 1, y: 0, duration, delay, ease })

        // If already in view on mount, animate immediately
        const rect = el.getBoundingClientRect()
        if (rect.top < (window.innerHeight * 0.9)) {
          animateIn()
        } else {
          ScrollTrigger.create({
            trigger: el,
            start: startPos,
            once: true,
            onEnter: animateIn
          })
        }
      }
    })

    // Ensure triggers calculate correctly on route changes
    nuxtApp.hook('page:finish', () => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    window.addEventListener('load', () => ScrollTrigger.refresh())
  }
})


