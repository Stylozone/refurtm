// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/image', '@nuxt/fonts', 'shadcn-nuxt', 'nuxt-graphql-client'],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
})
