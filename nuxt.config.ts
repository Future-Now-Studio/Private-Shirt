// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Configure for Netlify with serverless functions
  nitro: {
    preset: 'netlify'
  },

  modules: [
    ['@nuxtjs/tailwindcss', {
      cssPath: '~/assets/css/tailwind.css',
      config: {
        plugins: [
          require('@tailwindcss/aspect-ratio')
        ]
      }
    }]
  ],

  app: {
    head: {
      title: 'private-shirt.de – Individueller Textildruck',
      htmlAttrs: {
        lang: 'de'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Individuell bedruckte T-Shirts, Hoodies, Tassen & mehr in Premium-Qualität. Für dich, dein Team oder dein Business – ab 1 Stück.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  }
})
