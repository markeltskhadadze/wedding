// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-swiper',
    '@pinia/nuxt',
    '@samk-dev/nuxt-vcalendar',
    '@nuxtjs/i18n',
    ['@nuxtjs/google-fonts', {
      families: {
        Geologica: [400, 500, 700],
        'ZCOOL QingKe HuangYou': [400]
      }
    }]
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: "ru",
        name: "Russian",
        iso: "ru-RU",
        dir: "rtl",
        file: "ru.json"
      },
      {
        code: "en",
        name: "English",
        iso: "en-EN",
        dir: "rtl",
        file: "en.json"
      },
      {
        code: "uz",
        name: "Uzbek",
        iso: "uz-UZ",
        dir: "rtl",
        file: "uz.json"
      }
    ],
    lazy: true,
    langDir: "locale",
    defaultLocale: "ru",
    detectBrowserLanguage: false
  }
})