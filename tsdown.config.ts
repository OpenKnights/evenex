import type { UserConfig } from 'tsdown'

import { defineConfig } from 'tsdown'

const createConfigs = (base: UserConfig, configs: UserConfig[]) => {
  const config = configs.map((config) => ({
    ...base,
    ...config
  })) as UserConfig
  return config
}

const baseConfig: UserConfig = {
  entry: ['./src/index.ts'],
  clean: true
}

export default defineConfig(
  createConfigs(baseConfig, [
    { format: 'esm', dts: true },
    { format: 'cjs', dts: false }
  ])
)
