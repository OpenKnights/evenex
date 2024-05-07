import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import typescript from 'rollup-plugin-typescript2'
import esbuild from 'rollup-plugin-esbuild'
import babel from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'

const entries = ['src/index.ts']
const plugins = [
  alias({
    entries: [{ find: /^node:(.+)$/, replacement: '$1' }]
  }),
  resolve({
    preferBuiltins: true
  }),
  json(),
  commonjs(),
  typescript(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: [...DEFAULT_EXTENSIONS, '.ts']
  }),
  esbuild()
]

const rollupConfig = [
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.esm.js'),
        format: 'es'
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.cjs.js'),
        format: 'cjs'
      }
    ],
    plugins
  })),
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', './').replace('.ts', '.d.ts'),
        format: 'esm'
      }
    ],
    plugins: [dts({ respectExternal: true })]
  }))
]

export default rollupConfig
