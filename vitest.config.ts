import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // timeout 10000
    testTimeout: 10000,

    // watch false
    watch: false
  }
})
