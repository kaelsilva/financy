import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globalSetup: ['test/global-setup.ts'],

    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./test.db',
      JWT_SECRET: 'segredo-usado-apenas-nos-testes-automatizados',
      JWT_EXPIRES_IN: '3d',
    },

    fileParallelism: false,
  },
})
