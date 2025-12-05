import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    gsap.registerPlugin(ScrollTrigger)

    nuxtApp.vueApp.directive('gsap', {
      mounted(el, binding) {
        const base = binding?.value || {}
        const defaults = {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0,
          ease: 'power2.out'
        }
        const opts = { ...defaults, ...base }

        const animateOne = (target) => {
          if (!target || target.__gsapAnimated) return
          target.__gsapAnimated = true
          gsap.set(target, { opacity: opts.opacity, y: opts.y })
          const startPos = 'top 90%'
          const run = () => gsap.to(target, { opacity: 1, y: 0, duration: opts.duration, delay: opts.delay, ease: opts.ease })
          const rect = target.getBoundingClientRect()
          if (rect.top < (window.innerHeight * 0.9)) {
            run()
          } else {
            ScrollTrigger.create({
              trigger: target,
              start: startPos,
              once: true,
              onEnter: run
            })
          }
        }

        // Animate the element itself if it seems like a leaf/section
        if (el.matches('section, [data-animate], .animate-on-scroll')) {
          animateOne(el)
        }
        // Animate common child sections within this container
        const targets = el.querySelectorAll('section, [data-animate], .animate-on-scroll')
        targets.forEach(animateOne)
      }
    })

    // Ensure triggers calculate correctly on route changes
    nuxtApp.hook('page:finish', () => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    window.addEventListener('load', () => ScrollTrigger.refresh())
  }
})


