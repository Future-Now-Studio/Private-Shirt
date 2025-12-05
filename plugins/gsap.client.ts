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
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration, delay, ease })
          }
        })
      }
    })
  }
})


